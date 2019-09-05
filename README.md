# object-tree-database
Object Tree Database

## External API

At the end of the day, when you are exhausted and your database horks your data,
for the fifteenth time, you got to ask your self are you a :mouse: or a :man:?

Here are four ways to manipulate the data:

### Import ObjectTree Interface

```JavaScript

import ObjectTree from './index.mjs';
const ot = new ObjectTree();
await ot.initialize();
const result = await ot.dispatch({type:'dump', path:'users'});

```

### Connect to Server, through HTTP client

```JavaScript
import axios from 'axios';
axios
.get('http://127.1:3001/', {params:{type:'dump',path:'users'}})
.then(function(response){console.log(response);})
```

### Command Line HTTP Client
```sh

curl '127.1:3001?type=dump&path=users'

```

### Appending to the log file

```sh

echo '{"type":"dump","path":"users"}' >> object-tree-database.json;

```

## Working with Internal API

First create a stable tree structure.

```JavaScript

const root = this.root;
root.make('etc/hosts')
root.make('users/meow/desktop')
root.make('users/alice/desktop')
const workspace = root.make('users/alice/workspace')
workspace.make('photoshop')
workspace.make('gimp/plugins')

```

Now you are able to add new users

```JavaScript

const users = root.resolve('users');
users.make('alice')
users.make('bob')

```

Now, you set content;

```JavaScript

const alice = root.resolve('users/alice');

alice.content = {
  email: 'alice@example.com'
  some:{
    strage:{
      deeeply:{
        nested:{
          list:[
            {name:'Mallory': pbx:'212-555-1212', nick: 'Khing of NyanNEX'}
          ]
        }
      }
    }
  }
};


```

to get the data out

```JavaScript

  const alice = root.resolve('users/alice');
  console.log(alice.content);

```

## Fields

### id

Id should be universally unique across all systems.
- By default it is a 128 bit random hex.

### name

Name is the name of the "file", it should be unique in the objects set.
- Server will not allow objects with duplicate names. throw


## Debug
List of debug operations via curl

dump database

      curl '127.1:3001?type=dump&path=/'
