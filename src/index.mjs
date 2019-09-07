import fs from 'fs';
import path from 'path';

import repeat from 'lodash/repeat.js';

import Node from 'Node';
import id from 'id';
import load from 'load';

import lookup from 'lookup';

import ReadlineStrategy from 'ReadlineStrategy';
import TailStrategy from 'TailStrategy';
import EventStreamStrategy from 'EventStreamStrategy';
import SplitStrategy from 'SplitStrategy';


export default class ObjectDatabase {

  #log = null; // path to log file

  #root = null;

  #strategy = 'readline'; // name
  #processor = null; // class with initialize and dispatch

  constructor(options){
    //console.log(options)
    const defaults = { log:'object-tree-database.json', strategy:'eventstream' };
    const setup = Object.assign({}, defaults, options );
    this.#log = setup.log;
    this.#strategy = setup.strategy;
    this.root = new Node({id:'root', name:'root'});

    //console.log(`this.#strategy: ${this.#strategy}.`)
  }

  async initialize(){

    if(this.#strategy == 'tail'){

      this.#processor = new TailStrategy({ file: this.#log, line: line => this.line(line) });
      await this.#processor.initialize(); // this will read all the existing log lines

    } else if(this.#strategy == 'readline'){

      this.#processor = new ReadlineStrategy({ file: this.#log, line: line => this.line(line) });
      await this.#processor.initialize(); // this will read all the existing log lines

    } else if(this.#strategy == 'eventstream'){

      this.#processor = new EventStreamStrategy({ file: this.#log, line: line => this.line(line) });
      await this.#processor.initialize(); // this will read all the existing log lines

    } else if(this.#strategy == 'split'){

      this.#processor = new SplitStrategy({ file: this.#log, line: line => this.line(line) });
      await this.#processor.initialize(); // this will read all the existing log lines

    }else{

      throw new Error('Unknown strategy.')

    }

    console.log(`Using: ${this.#processor.constructor.name}.`)

  }

  async dispatch(action){
    // process new actions (the processor will save them)
    return await this.#processor.dispatch(action);
  }

  // note: line can be a JSON string, or an object
  async line(data){
    if(!data) return;

    let response = {};

    let lineObject;

    if(typeof data === 'string'){
      // it is a stringified JSON object
      try{
        lineObject = JSON.parse(data);
      }catch(error){
        console.error(error);
      }
    }else{
      // it was already an object
      lineObject = data;
    }

    try{
      const {type:action, ...parameters} = lineObject;
      if(this[action]){
        response = await this[action](parameters);
      }
    }catch(error){
      console.error(error);
    }

    return response;

  } // line

  async make({path}){
    this.root.make(path);
  }

  async dump({path}){
    const screen = [];
    const show = function(node, indent = -1){
      indent++;

      const prefix = repeat('  ', indent);
      const label = node.name||node.id;

      screen.push({prefix, label, indent});
      if(node.objects) node.objects.forEach(function(child){
        show(child, indent)
      })

      indent--
    }

    const start = this.#root.resolve(path);
    if(start) {
      show(start);
      console.dir(screen)
      return screen;
    }else{
      console.log(`Path does not exist.`)
      return []
    }
  }

  // API

  set root(node){
    this.#root = node;
  }
  get root(){
    return this.#root;
  }

}
