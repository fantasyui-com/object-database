import Node from 'Node';
import load from 'load';
import id from 'id';
import lookup from 'lookup';
import repeat from 'lodash/repeat.js';

export default class ObjectDatabase {

  #root = null;

  constructor(){

    this.root = new Node({id:'root', name:'root'});

    this.root.make('etc/hosts')
    this.root.make('users/meow/desktop')
    this.root.make('users/alice/desktop')

    const workspace = this.root.make('users/alice/workspace');

    workspace.make('photoshop')
    workspace.make('gimp/plugins')

  }

  async initialize(){
    console.log(await this.dump({path:'/'}));
  }

  async dispatch(actionObject){

    console.log(`Dispatch intercepted: ${JSON.stringify(actionObject)}`)

    const {method, ...parameters} = actionObject;
    if(this[method]){
      return await this[method](parameters)
    }

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
      return screen;
    }else{
      console.log(`Path does not exist.`)
      return []
    }
  }

  // API

  createPath(pathString){
  }

  set root(node){
    this.#root = node;
  }
  get root(){
    return this.#root;
  }

  getObjectContent(pathString){

  }

}
