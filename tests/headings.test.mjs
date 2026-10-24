import test from 'node:test';
import assert from 'node:assert/strict';
import explicitHeadings from '../tools/remark-headings.mjs';
test('legacy heading anchors survive Greek and nested Markdown headings',()=>{
 const heading={type:'heading',depth:2,children:[{type:'strong',children:[{type:'text',value:'Ο κώδικας'}]},{type:'text',value:' {#guide-code}'}]};
 explicitHeadings()({type:'root',children:[heading]});
 assert.equal(heading.data.hProperties.id,'guide-code');
 assert.equal(heading.children.at(-1).value,'');
});
test('historical headings fit below the article title without losing text',()=>{
 const headings=[1,2,5,1].map((depth,index)=>({type:'heading',depth,children:[{type:'text',value:`Section ${index}`}]}));
 explicitHeadings()({type:'root',children:headings});
 assert.deepEqual(headings.map(h=>h.depth),[2,3,4,2]);
 assert.equal(headings[0].children[0].value,'Section 0');
});
