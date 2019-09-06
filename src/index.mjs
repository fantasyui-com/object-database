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

  #logFile = null;
  #logStrategy = 'readline';
  #root = null;

  constructor(options){
    const defaults = { logFile:'object-tree-database.json', logStrategy:'readline' };
    const setup = Object.assign({},options,defaults)
    this.#logFile = setup.logFile;
    this.#logStrategy = setup.logStrategy;
    this.root = new Node({id:'root', name:'root'});

  }

  async initialize(){
    console.log('this.#logFile',this.#logFile)

    if(this.logStrategy == 'tail'){
      this.tail = new tail.Tail(this.#logFile,{fromBeginning:true});
      this.tail.on('line', line => this.line(line));
    } else if(this.logStrategy == 'readline'){
      // readline does not activley tail...
      const rl = readline.createInterface({
        input: fs.createReadStream(this.#logFile),
        crlfDelay: Infinity
      });
      rl.on('line', line => this.line(line));
      setInterval(function(){rl.input.read(0)},1000)
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
