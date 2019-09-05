# object-tree-database
Object Tree Database

## Philosophy

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
