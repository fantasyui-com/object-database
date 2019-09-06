import fs from 'fs';
import path from 'path';
import readline from 'readline';

import repeat from 'lodash/repeat.js';

import tail from 'tail';

import Node from 'Node';
import id from 'id';
import load from 'load';

import lookup from 'lookup';

export default class ObjectDatabase {

  #logFile = 'object-tree-database.json';
  #root = null;

  constructor(options){

    if(options.logFile) this.#logFile = options.logFile;

    this.root = new Node({id:'root', name:'root'});

  }

  async initialize(){

    if(this.tailLog)
    this.tail = new tail.Tail(this.#logFile,{fromBeginning:true});
    this.tail.on('line', line => this.line(line));
    }else{
    // todo use es here
    }
  }

  // All actions are first saved to the log.
  async dispatch(actionObject){
    fs.appendFile(this.#logFile, JSON.stringify(actionObject)+'\n', (error) => {
      if (error) console.error(error);
    });
  }

  async line(line){
    const lineObject = JSON.parse(line);
    const {type:action, ...parameters} = lineObject;
    console.log(`this.${action}(${JSON.stringify(parameters)})`)
    if(this[action]){
      await this[action](parameters);
    }
  }

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
