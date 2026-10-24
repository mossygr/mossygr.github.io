/** Carry filenames into our accessible code toolbar without modifying the code. */
export default {
 name:'m0ss1-code-meta',
 pre(node){
  node.properties['data-language']=this.options.lang;
  const title=this.options.meta?.__raw?.match(/title="([^"]+)"/);
  if(title)node.properties['data-title']=title[1];
 },
};
