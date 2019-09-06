# object-tree-database
Object Tree Database

## External API

At the end of the day, when you are exhausted and your database horks your data,
for the fifteenth time, you got to ask your self are you a :mouse: or a :woman:?

The point of this database is simple files that you can simply manipulate and easily strategize about.
The primary protection of data, is your responsibility, your backup; but you know what to backup from day one.
The snapshot and the log of few entries that came afterwards.

This is an in-memory database, even though it tails the log, and creates snapshots all over.
The file-system and database is like :dog: and :cat:. They cooperate but they are not in any harmony,
there are no guarantees that you are safe from data loss on any database.

Indeed, the best way to save data is to ship it to
multiple remote servers where that data will be kept in memory long enough to be safely stored, even then
you will have disk failures, memory errors and flipped bits from distant dying suns.

In context of data safety, index and blob is pure overhead. Here is JSON, something you can understand,
test, replay, experiment, compare.

The primary method of controlling the database is the log file. Everything in
the log file is replayed at program start-up. Line by line. Log file path
can be set via ObjectTree constructor:

```JavaScript
import ObjectTree from './index.mjs';
const ot = new ObjectTree({logFile: 'object-tree-database.json'});
```
Contents of the log file look as follows:

```JSON

  {"type":"make","path":"etc/hosts"}
  {"type":"make","path":"users/meow/desktop"}
  {"type":"make","path":"users/alice/desktop"}
  {"type":"make","path":"users/alice/workspace/photoshop"}
  {"type":"make","path":"users/alice/workspace/gimp/plugins"}
  {"type":"dump","path":"users"}

```

You are encouraged to save and load snapshots, when the log file becomes too large:

```sh

  echo '{"type":"snapshot", "file":"object-tree-snapshot-346.json"}' >> object-tree-database.json;

```

now you can replace the entire contents of object-tree-database.json with a single line

```sh
# note that we are using > and not >>
echo '{"type":"restore", "file":"object-tree-snapshot-346.json"}' > object-tree-database.json;

```

resulting in

```JSON

  {"type":"restore", "file":"object-tree-snapshot-346.json"}

```

Here are four ways to manipulate the data:

### Import ObjectTree Interface

```JavaScript

import ObjectTree from 'object-tree-database';
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

import ObjectTree from 'object-tree-database';
const ot = new ObjectTree();
await ot.initialize();

const root = ot.root;
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


## Todo

content function
snapshot/restore methods
