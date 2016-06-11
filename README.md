# typhonjs-escomplex-project
Provides project oriented AST processing for complexity reports.

More information forthcoming. This NPM module is currently not published, but can be linked to from Github as a dependency in `package.json` as follows:
```
"dependencies": {
  "typhonjs-escomplex-project": "git+https://git@github.com/typhonjs-node-escomplex/typhonjs-escomplex-project.git",
}
```

An ES6 example follows:
```
import escomplexProject from 'typhonjs-escomplex-project';

const modules = 
[
   { ast: <some parsed AST>, path: 'a/file/path/1' },
   { ast: <some parsed AST>, path: 'a/file/path/2' }
]);

const results = escomplexProject.analyze(modules);
```


A CJS example follows:
```
var escomplexProject = require('typhonjs-escomplex-project');

var modules = 
[
   { ast: <some parsed AST>, path: 'a/file/path/1' },
   { ast: <some parsed AST>, path: 'a/file/path/2' }
]);

var results = escomplexProject.analyze(modules);
```
