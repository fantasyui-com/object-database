#!/usr/bin/env -S node --experimental-modules

import ObjectDatabase from './index.mjs';
import express from 'express';

const od = new ObjectDatabase();

const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
