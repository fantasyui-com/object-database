import Node from 'Node';
import load from 'load';
import id from 'id';
import lookup from 'lookup';
import repeat from 'lodash/repeat.js';

export default class ObjectDatabase {

  #root = null;
  constructor(){

    this.#root = new Node({id:'root', name:'root'});

    const root = this.#root;
    root.make('etc/hosts')
    root.make('users/meow/desktop')
    root.make('users/alice/desktop')
    const workspace = root.make('users/alice/workspace')
    workspace.make('photoshop')
    workspace.make('gimp/plugins')

  }

  async initialize(){
    console.log(await this.dump({path:'users/alice'}));
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

      const spaceIndent = repeat('  ', indent);
      const objectName = node.name||node.id;

      screen.push(`${spaceIndent}${objectName}`);
      if(node.objects) node.objects.forEach(function(child){
        show(child, indent)
      })

      indent--
    }

    const start = this.#root.resolve(path);
    if(start) {
      show(start);
      return screen.join('\n');
    }else{
      console.log(`Path does not exist.`)
      return ''
    }
  }

  createPath(pathString){
  }

  getRoot(){
    return this.#root;
  }

  getObjectContent(pathString){

  }

}
