#!/usr/bin/env python3
"""Migrate the complete bilingual archive to Astro content without altering sources.

Python 3 + the already available PyYAML and BeautifulSoup4 are sufficient.
Run from anywhere; --skip-robot produces the thirty ordinary Markdown posts.
URLs come from the last bilingual route map, including original case/Greek slugs.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
from pathlib import Path

import yaml
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parents[1]


def frontmatter(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"\A---[ \t]*\n([\s\S]*?)\n---[ \t]*\n?", text)
    if not match:
        raise ValueError(f"Missing frontmatter: {path}")
    return yaml.safe_load(match[1]) or {}, text[match.end():]


def route_map(explicit: Path | None) -> tuple[dict, Path]:
    candidates = [explicit] if explicit else [
        ROOT / "bilingual_site/i18n-map.json",
        ROOT / "_site/i18n-map.json",
        ROOT.parent / "bilingual_site/i18n-map.json",
    ]
    for path in candidates:
        if path and path.is_file():
            value = json.loads(path.read_text())
            return {row["key"]: row["paths"] for row in value["posts"]}, path
    raise FileNotFoundError("No bilingual route map; pass --routes /path/to/i18n-map.json")


def liquid_urls(text: str) -> str:
    return re.sub(
        r"""{{\s*(['"])(.*?)\1\s*\|\s*(?:relative_url|absolute_url)\s*}}""",
        lambda m: m[2], text,
    )


def markdown_body(text: str) -> str:
    """Preserve Markdown/code verbatim; normalise only Jekyll-specific adornments."""
    text = liquid_urls(text)
    # Keep responsive attributes: an adjacent Markdown image becomes ordinary HTML.
    image = re.compile(r"!\[([^\]]*)\]\(([^)\n]+)\)\n\{:\s*((?:width|height|srcset|sizes)[^\n]*)\}")
    from html import escape
    text = image.sub(
        lambda m: '<img src="' + escape(m[2], quote=True)
        + '" alt="' + escape(m[1], quote=True) + '" ' + m[3].strip() + ' loading="lazy" />',
        text,
    )
    # Heading IDs are explicit for the portal's remark heading plugin.
    text = re.sub(
        r"(?m)^(#{1,6} .+)\n\{:\s*#([^}\s]+)\s*\}",
        lambda m: m[1] + " {#" + m[2] + "}",
        text,
    )
    # Prompt class markers are presentation, not text. Preserve the blockquote itself.
    text = re.sub(r"(?m)^\{:\s*\.[^}\n]+\}\s*$", "", text)
    if re.search(r"{%|{{", text):
        raise ValueError("Unresolved Liquid remains in an ordinary Markdown article")
    return text.strip() + "\n"


def iso_date(value):
    if isinstance(value, (dt.date, dt.datetime)):
        return value.isoformat()
    raw = str(value)
    try:
        return dt.datetime.fromisoformat(raw).isoformat()
    except ValueError:
        return dt.datetime.strptime(raw, "%Y-%m-%d %H:%M:%S %z").isoformat()


def migrate_metadata(meta: dict, source: Path, lang: str, paths: dict) -> dict:
    key = str(meta.get("translation_key") or source.stem)
    if key not in paths:
        raise ValueError(f"No authoritative URL for {lang}/{key}")
    kind = "guide" if key == "2026-10-21-robot-4wd" else (
        "project" if "gpi-case-2w" in key else "article"
    )
    result = {
        "key": key,
        "lang": lang,
        "title": str(meta["title"]),
        "description": str(meta.get("description") or meta.get("excerpt") or meta["title"]),
        "date": iso_date(meta["date"]),
        "permalink": paths[key][lang],
        "categories": meta.get("categories") or [],
        "tags": meta.get("tags") or [],
        "type": kind,
    }
    for name in ("image", "pin", "toc"):
        if name in meta:
            result[name] = meta[name]
    return result


def emit(path: Path, meta: dict, body: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "---\n" + yaml.safe_dump(meta, allow_unicode=True, sort_keys=False, width=110)
        + "---\n\n" + body, encoding="utf-8"
    )



BT = chr(96)
BLOCK_COMPONENTS = {
    "diagram": "RobotDiagram",
    "harness": "RobotHarness",
    "connections": "RobotConnections",
}


def expand_robot_includes(text: str, lang: str, ancestry=()) -> str:
    pattern = re.compile(r"{%-?\s*include\s+([^\s%]+)[^%]*%}")

    def include(match):
        name = match[1]
        if name in ancestry:
            raise ValueError("Recursive include: " + name)
        if name == "robot/pict.svg":
            return '<span data-migrate-component="diagram"></span>'
        if name == "robot/harness.svg":
            return '<span data-migrate-component="harness"></span>'
        overlay = ROOT / "_translations/en/_includes" / name
        path = overlay if lang == "en" and overlay.exists() else ROOT / "_includes" / name
        value = path.read_text()
        if lang == "en" and path != overlay:
            # The table and SVG labels intentionally have one technical source.
            # Only translate the prose around the connection component here.
            dictionary = json.loads((ROOT / "_translations/en/robot-labels.json").read_text())
            soup = BeautifulSoup(value, "html.parser")
            for node in list(soup.find_all(string=True)):
                if node.find_parent("table"):
                    continue
                raw = str(node)
                if re.search(r"[Α-Ωα-ωάέήίόύώϊϋΐΰ]", raw.replace("Ω", "")):
                    key = re.sub(r"\s+", " ", raw).strip()
                    if key not in dictionary:
                        raise ValueError("Missing translated reference text: " + key)
                    node.replace_with(dictionary[key])
            value = str(soup)
        return expand_robot_includes(value, lang, ancestry + (name,))

    return pattern.sub(include, text)


def html_to_robot_markdown(html: str, lang: str) -> str:
    """Small explicit converter for our audited guide HTML, not arbitrary web pages."""
    from html import escape
    code_blocks = {}
    fence = BT * 3
    excerpt = re.compile(
        r'<div class="firmware-excerpt"\s+data-source-file="([^"]+)">([\s\S]*?)</div>'
    )

    def protect_code(match):
        code = re.search(fence + r"cpp\n([\s\S]*?)" + fence, match[2])
        if not code:
            raise ValueError("Missing cpp excerpt: " + match[1])
        token = f"PORTAL_CODE_BLOCK_{len(code_blocks)}_END"
        code_blocks[token] = (
            fence + "cpp title=" + json.dumps(match[1]) + "\n"
            + code[1] + fence
        )
        return '<div data-migrate-code="' + token + '"></div>'

    html = excerpt.sub(protect_code, liquid_urls(html))
    if re.search(r"{%|{{", html):
        raise ValueError("Unresolved Liquid after robot include/code expansion")
    soup = BeautifulSoup(html, "html.parser")

    def plain(value: str) -> str:
        return escape(re.sub(r"\s+", " ", value), quote=False).replace("{", "&#123;").replace("}", "&#125;")

    def children(node):
        return "".join(render(child) for child in node.children)

    def inline(node):
        return children(node).strip()

    def anchor(node):
        identifier = node.get("id")
        return f'\n\n<a id="{escape(identifier, quote=True)}"></a>\n\n' if identifier else ""

    def list_items(node):
        ordered = node.name == "ol"
        lines = []
        for index, item in enumerate(node.find_all("li", recursive=False), 1):
            value = children(item).strip()
            parts = value.splitlines()
            marker = f"{index}. " if ordered else "- "
            lines.append(marker + (parts[0] if parts else ""))
            lines.extend(" " * len(marker) + line for line in parts[1:])
        return "\n\n" + "\n".join(lines) + "\n\n"

    def render(node):
        if isinstance(node, NavigableString):
            return plain(str(node))
        if not isinstance(node, Tag):
            return ""
        name = node.name
        if node.has_attr("data-migrate-code"):
            return "\n\n" + node["data-migrate-code"] + "\n\n"
        if "viewer" in node.get("class", []):
            placeholder = node.find(attrs={"data-migrate-component": True})
            if not placeholder:
                raise ValueError("Viewer has no diagram/harness component")
            component = BLOCK_COMPONENTS[placeholder["data-migrate-component"]]
            return f'\n\n<{component} lang="{lang}" />\n\n'
        if name == "table" and node.get("id") == "conn":
            return f'\n\n<RobotConnections lang="{lang}" />\n\n'
        if re.fullmatch(r"h[1-6]", name):
            suffix = " \\{#" + node["id"] + "\\}" if node.get("id") else ""
            return "\n\n" + "#" * int(name[1]) + " " + inline(node) + suffix + "\n\n"
        if name == "code":
            content = node.get_text()
            length = max([len(m[0]) for m in re.finditer(BT + "+", content)] + [0]) + 1
            mark = BT * length
            return mark + content + mark
        if name in ("strong", "b"):
            return "**" + inline(node) + "**"
        if name in ("em", "i"):
            value = inline(node)
            return "*" + value + "*" if value else ""
        if name == "br":
            return "  \n"
        if name == "nav":
            links = [render(child) for child in node.find_all("a", recursive=False)]
            return "\n\n" + " · ".join(links) + "\n\n"
        if "legend" in node.get("class", []):
            labels = [inline(child) for child in node.find_all("span", recursive=False)]
            return "\n\n" + "\n".join("- " + value for value in labels) + "\n\n"
        if "note-card" in node.get("class", []):
            value = children(node).strip()
            return "\n\n" + "\n".join("> " + line for line in value.splitlines()) + "\n\n"
        if name == "p":
            return "\n\n" + inline(node) + "\n\n"
        if name in ("ul", "ol"):
            return list_items(node)
        if name == "dl":
            entries = []
            for term in node.find_all("dt", recursive=False):
                definition = term.find_next_sibling("dd")
                value = inline(definition) if definition else ""
                entries.append("- **" + inline(term) + "** — " + value)
            return "\n\n" + "\n".join(entries) + "\n\n"
        if name == "a":
            href = node.get("href")
            if not href:
                return anchor(node) + children(node)
            if node.find("img"):
                return '<a href="' + escape(href, quote=True) + '">' + children(node) + "</a>"
            return "[" + inline(node) + "](" + href + ")"
        if name == "img":
            attrs = {key: node[key] for key in ("src", "alt", "width", "height", "srcset", "sizes", "loading") if node.has_attr(key)}
            return "<img " + " ".join(key + '="' + escape(str(value), quote=True) + '"' for key, value in attrs.items()) + " />"
        if name == "figcaption":
            return "\n\n*" + inline(node) + "*\n\n"
        if name == "details":
            summary = node.find("summary", recursive=False)
            label = inline(summary) if summary else ("Details" if lang == "en" else "Λεπτομέρειες")
            content = "".join(render(child) for child in node.children if child is not summary)
            return "\n\n<details>\n<summary>" + label + "</summary>\n\n" + content.strip() + "\n\n</details>\n\n"
        if name == "summary":
            return ""
        if name == "blockquote":
            return "\n\n" + "\n".join("> " + line for line in children(node).strip().splitlines()) + "\n\n"
        if name in ("script", "style"):
            raise ValueError("Unexpected inline script/style in the article content")
        # Section anchors are old public fragments. Keep them even when the
        # presentation wrappers are removed in favour of Markdown typography.
        return anchor(node) + children(node)

    body = "".join(render(node) for node in soup.contents)
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n[ \t]+\n", "\n\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"
    # Reinsert original code only after prose whitespace normalisation. No code
    # line, indentation, comment, or string literal is reformatted.
    for token, value in code_blocks.items():
        if token not in body:
            raise ValueError("A firmware excerpt was lost during conversion")
        body = body.replace(token, value)
    components = [
        name for name in BLOCK_COMPONENTS.values()
        if f"<{name} " in body
    ]
    imports = "\n".join(
        f"import {name} from '../../../components/robot/{name}.astro';"
        for name in components
    )
    return imports + "\n\n" + body


def migrate_robot(source: Path, lang: str) -> str:
    _, raw = frontmatter(source)
    expanded = expand_robot_includes(raw, lang)
    return html_to_robot_markdown(expanded, lang)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--routes", type=Path)
    parser.add_argument("--output", type=Path, default=ROOT / "src/content/docs")
    parser.add_argument("--skip-robot", action="store_true")
    args = parser.parse_args()
    routes, map_path = route_map(args.routes)
    report = {"routes_source": str(map_path.relative_to(ROOT)) if map_path.is_relative_to(ROOT) else str(map_path),
              "documents": []}
    seen = set()
    for lang, directory in [("el", ROOT / "_posts"), ("en", ROOT / "_translations/en/_posts")]:
        sources = sorted(p for p in directory.iterdir() if p.suffix in (".md", ".html"))
        for source in sources:
            meta, raw = frontmatter(source)
            robot = source.suffix == ".html" and meta.get("robot")
            if robot and args.skip_robot:
                continue
            data = migrate_metadata(meta, source, lang, routes)
            identity = (lang, data["key"])
            if identity in seen:
                raise ValueError(f"Duplicate identity: {identity}")
            seen.add(identity)
            body = migrate_robot(source, lang) if robot else markdown_body(raw)
            extension = ".mdx" if robot else ".md"
            target = args.output / lang / (source.stem + extension)
            emit(target, data, body)
            report["documents"].append({
                "key": data["key"], "lang": lang, "permalink": data["permalink"],
                "source": str(source.relative_to(ROOT)),
                "destination": str(target.relative_to(ROOT)) if target.is_relative_to(ROOT) else str(target),
                "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                "body_sha256": hashlib.sha256(body.encode()).hexdigest(),
                "type": data["type"],
            })
    destination = ROOT / "work-notes/CONTENT_MIGRATION.json"
    destination.parent.mkdir(exist_ok=True)
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"Migrated {len(report['documents'])} documents -> {args.output}")


if __name__ == "__main__":
    main()
