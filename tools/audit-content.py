#!/usr/bin/env python3
"""Verify the one-time Astro migration against preserved bilingual source content.

This command writes only an evidence report, never Markdown/MDX or frontend files.
Run: python3 tools/audit-content.py
"""
from pathlib import Path
import argparse
import importlib.util
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path, default=ROOT / "work-notes/CONTENT_MIGRATION_INVARIANTS.json")
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("migration_helpers", ROOT / "tools/migrate-content.py")
    helpers = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helpers)
    records = json.loads((ROOT / "work-notes/CONTENT_MIGRATION.json").read_text())["documents"]
    fence = chr(96) * 3
    checks = []
    failures = []
    for row in records:
        source = ROOT / row["source"]
        target = ROOT / row["destination"]
        meta, raw = helpers.frontmatter(source)
        data, body = helpers.frontmatter(target)
        body = body.lstrip("\n")
        result = {
            "key": row["key"], "lang": row["lang"], "permalink": row["permalink"],
            "source_unchanged": helpers.hashlib.sha256(source.read_bytes()).hexdigest() == row["source_sha256"],
            "route_matches_map": data["permalink"] == row["permalink"],
            "date_preserved": helpers.iso_date(meta["date"]) == data["date"],
        }
        if row["type"] == "guide":
            includes = ROOT / ("_includes/robot" if row["lang"] == "el" else "_translations/en/_includes/robot")
            original = re.findall(fence + r"cpp\n([\s\S]*?)" + fence, (includes / "code-walkthrough.html").read_text())
            migrated = re.findall(fence + r'cpp title="[^"]+"\n([\s\S]*?)' + fence, body)
            old_ids = re.findall(r'<h[1-6] id="([^"]+)"', helpers.expand_robot_includes(raw, row["lang"]))
            new_ids = re.findall(r"\\\{#([^}]+)\\\}", body)
            # Converter executes in memory only; no files are emitted by this audit.
            expected_body = helpers.migrate_robot(source, row["lang"])
            result.update(
                code_blocks=len(original), code_payloads_exact=original == migrated,
                heading_ids_preserved=old_ids == new_ids, heading_count=len(new_ids),
                full_robot_transform_exact=expected_body.strip("\n") == body.strip("\n"),
                component_contract=[c for c in ["RobotDiagram", "RobotHarness", "RobotConnections"] if "<" + c + " " in body],
                delegated_component_ids=["viewer-pict", "pict", "info", "viewer-harness", "harness", "conn"],
            )
        else:
            original = re.findall(fence + r"[^\n]*\n([\s\S]*?)" + fence, raw)
            migrated = re.findall(fence + r"[^\n]*\n([\s\S]*?)" + fence, body)
            result.update(
                code_blocks=len(original), code_payloads_exact=original == migrated,
                full_markdown_transform_exact=helpers.markdown_body(raw).strip("\n") == body.strip("\n"),
                source_body_empty=not raw.strip(),
            )
        required = ["source_unchanged", "route_matches_map", "date_preserved", "code_payloads_exact"]
        required += [key for key in ["heading_ids_preserved", "full_robot_transform_exact", "full_markdown_transform_exact"] if key in result]
        for key in required:
            if not result[key]:
                failures.append(row["source"] + ": " + key)
        checks.append(result)
    expected_targets = {row["destination"] for row in records}
    actual_targets = {str(path.relative_to(ROOT)) for path in (ROOT / "src/content/docs").rglob("*") if path.suffix in (".md", ".mdx")}
    if expected_targets != actual_targets:
        failures.append("Content manifest and actual Markdown/MDX inventory differ")
    pairs = {}
    for row in records:
        pair = pairs.setdefault(row["key"], [])
        pair.append(row["lang"])
    if len(records) != 32 or len(pairs) != 16:
        failures.append("Migration baseline requires exactly 32 documents and 16 language pairs")
    if any(sorted(languages) != ["el", "en"] for languages in pairs.values()):
        failures.append("Every original key must have exactly one el and one en document")
    if len({row["permalink"] for row in records}) != len(records):
        failures.append("Duplicate legacy route in content manifest")
    report = {
        "status": "fail" if failures else "pass",
        "documents": len(checks),
        "language_pairs": len({row["key"] for row in records}),
        "unique_routes": len({row["permalink"] for row in records}),
        "checks": checks, "errors": failures,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: report[key] for key in ["status", "documents", "language_pairs", "unique_routes", "errors"]}, ensure_ascii=False))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
