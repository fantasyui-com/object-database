#!/usr/bin/env -S node --experimental-modules
import ObjectTree from './index.mjs';

async function main(){
  const ot = new ObjectTree();
  await ot.initialize();
  const result = await ot.dispatch({type:'dump', path:'/'});
}

main();
