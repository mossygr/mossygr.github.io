/** Preserve public anchors carried over from the original articles. */
export default function explicitHeadings() {
  return tree => {
    // The article template owns h1. Preserve source text/anchors while giving
    // historical Markdown a coherent reading hierarchy inside the new shell.
    const headings=[];
    function collect(node){if(node.type==='heading')headings.push(node);node.children?.forEach(collect);}
    collect(tree);
    const minimum=Math.min(...headings.map(node=>node.depth),2);
    let previous=1;
    for(const node of headings){node.depth=Math.min(6,previous+1,Math.max(2,node.depth+(minimum===1?1:0)));previous=node.depth;}
    function walk(node) {
      if (node.type === 'heading') {
        const last = node.children?.at(-1);
        if (last?.type === 'text') {
          const match = last.value.match(/\s*\{#([^}]+)\}\s*$/);
          if (match) {
            last.value = last.value.slice(0, match.index);
            node.data ??= {}; node.data.hProperties ??= {};
            node.data.hProperties.id = match[1];
          }
        }
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}
