#!/usr/bin/env -S node --experimental-modules

import ObjectTree from './index.mjs';
import express from 'express';

async function main(){

  const ot = new ObjectTree({
    logStrategy:'tail',
    logFile:'object-tree-database.json'
  });
  await ot.initialize();

  const app = express();
  const port = 3001;

  app.get('/', async (req, res) => {

    console.log( ot.root )

    const action = Object.assign({method:'noop'},req.params,req.query);
    const result = await ot.dispatch(action);
    res.json(result);


  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}

main();
