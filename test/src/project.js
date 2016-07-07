import fs               from 'fs';

import { assert }       from 'chai';

import parsers          from './parsers';
import * as testconfig  from './testconfig';

import ProjectResult    from 'typhonjs-escomplex-commons/src/project/result/ProjectResult';

import escomplexProject from '../../src';

if (testconfig.modules['project'])
{
   parsers.forEach((Parser) =>
   {
      // Load project source and local test files from NPM module typhonjs-escomplex-commons.

      const s_LOCAL_TEST_FILES =
      [
         './node_modules/typhonjs-escomplex-module/src/ESComplexModule.js',
         './node_modules/typhonjs-escomplex-module/src/index.js',
         './node_modules/typhonjs-escomplex-module/src/Plugins.js',

         './node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js',
         './node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js',
         './node_modules/typhonjs-escomplex-commons/src/project/result/ProjectResult.js',
         './node_modules/typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js',
         './node_modules/typhonjs-escomplex-commons/src/module/report/AbstractReport.js',
         './node_modules/typhonjs-escomplex-commons/src/module/report/ClassReport.js',
         './node_modules/typhonjs-escomplex-commons/src/module/report/HalsteadData.js',
         './node_modules/typhonjs-escomplex-commons/src/module/report/MethodReport.js',
         './node_modules/typhonjs-escomplex-commons/src/module/report/ModuleReport.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/actualize.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/safeArray.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/safeName.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/Trait.js',
         './node_modules/typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js',

         './test/fixture/testImportNPMAlias.js',
         './test/fixture/testRequireNPMAlias.js',

         './src/ESComplexProject.js',
         './src/index.js',
         './src/Plugins.js'
      ];

      const s_LOCAL_TEST_DATA = s_LOCAL_TEST_FILES.map((filePath) =>
      {
         let srcPath = filePath;
         let srcPathAlias = undefined;

         // Remove leading `./node_modules/` from file path for the source path which is what is referenced in the code.
         if (filePath.startsWith('./node_modules/'))
         {
            srcPath = filePath.replace(/^\.\/node_modules\//, '');
         }

         // Add srcPathAlias for typhonjs-escomplex-module NPM main alias.
         if (filePath === './node_modules/typhonjs-escomplex-module/src/index.js')
         {
            srcPathAlias = 'typhonjs-escomplex-module';
         }

         return {
            ast: Parser.parse(fs.readFileSync(filePath, 'utf8')),
            filePath,
            srcPath,
            srcPathAlias
         };
      });

      suite(`(${Parser.name}) project:`, () =>
      {
         test('require returns object', () =>
         {
            assert.isObject(escomplexProject);
         });

         test('analyze function is exported', () =>
         {
            assert.isFunction(escomplexProject.analyze);
         });

         test('processResults function is exported', () =>
         {
            assert.isFunction(escomplexProject.processResults);
         });

         test('analyzeAsync function is exported', () =>
         {
            assert.isFunction(escomplexProject.analyzeAsync);
         });

         test('processResultsAsync function is exported', () =>
         {
            assert.isFunction(escomplexProject.processResultsAsync);
         });

         test('analyze throws when modules is object', () =>
         {
            assert.throws(() =>
            {
               escomplexProject.analyze({
                  body: [],
                  loc: {
                     start: {
                        line: 0
                     },
                     end: {
                        line: 0
                     }
                  }
               });
            });
         });

         test('analyze does not throw when modules is array', () =>
         {
            assert.doesNotThrow(() =>
            {
               escomplexProject.analyze([]);
            });
         });

         test('analyzeAsync does not throw when modules is array', () =>
         {
            assert.doesNotThrow(() =>
            {
               escomplexProject.analyzeAsync([]);
            });
         });

         test('analyze throws when modules is not an array', () =>
         {
            assert.throws(() =>
            {
               escomplexProject.analyze({});
            });
         });

         test('analyze throws when `srcPath` is missing', () =>
         {
            assert.throws(() =>
            {
               escomplexProject.analyze([{ ast: Parser.parse('if (true) { "foo"; } else { "bar"; }') }]);
            });
         });

         suite('no modules:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('object was returned', () =>
            {
               assert.isObject(result);
            });

            test('reports array exists', () =>
            {
               assert.isArray(result.reports);
            });

            test('reports array has zero length', () =>
            {
               assert.lengthOf(result.reports, 0);
            });

            test('adjacency list exists', () =>
            {
               assert.isArray(result.adjacencyList);
            });

            test('adjacency list has zero length', () =>
            {
               assert.lengthOf(result.adjacencyList, 0);
            });

            test('first-order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 0);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 0);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });

            test('mean per-function logical LOC is correct', () =>
            {
               assert.strictEqual(result.loc, 0);
            });

            test('mean per-function cyclomatic complexity is correct', () =>
            {
               assert.strictEqual(result.cyclomatic, 0);
            });

            test('mean per-function Halstead effort is correct', () =>
            {
               assert.strictEqual(result.effort, 0);
            });

            test('mean per-function parameter count is correct', () =>
            {
               assert.strictEqual(result.params, 0);
            });

            test('mean per-function maintainability index is correct', () =>
            {
               assert.strictEqual(result.maintainability, 0);
            });
         });

         suite('one module:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([{ ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'), srcPath: 'a' }]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports is correct length', () =>
            {
               assert.lengthOf(result.reports, 1);
            });

            test('first report aggregate has correct physical lines of code', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.sloc.physical, 1);
            });

            test('first report aggregate has correct logical lines of code', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.sloc.logical, 4);
            });

            test('first report aggregate has correct cyclomatic complexity', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.cyclomatic, 2);
            });

            test('first report aggregate has correct cyclomatic complexity density', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.cyclomaticDensity, 50);
            });

            test('first report methods is empty', () =>
            {
               assert.lengthOf(result.reports[0].methods, 0);
            });

            test('first report aggregate has correct Halstead total operators', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operators.total, 2);
            });

            test('first report aggregate has correct Halstead distinct operators', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operators.distinct, 2);
            });

            test('first report aggregate has correct Halstead total operands', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operands.total, 3);
            });

            test('first report aggregate has correct Halstead distinct operands', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operands.distinct, 3);
            });

            test('first report aggregate has correct Halstead operator identifier length', () =>
            {
               assert.lengthOf(
                  result.reports[0].aggregate.halstead.operators.identifiers,
                  result.reports[0].aggregate.halstead.operators.distinct
               );
            });

            test('first report aggregate has correct Halstead operand identifier length', () =>
            {
               assert.lengthOf(
                  result.reports[0].aggregate.halstead.operands.identifiers,
                  result.reports[0].aggregate.halstead.operands.distinct
               );
            });

            test('first report aggregate has correct Halstead length', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.length, 5);
            });

            test('first report aggregate has correct Halstead vocabulary', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.vocabulary, 5);
            });

            test('first report aggregate has correct Halstead difficulty', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.difficulty, 1);
            });

            test('first report aggregate has correct Halstead volume', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.volume), 12);
            });

            test('first report aggregate has correct Halstead effort', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.effort), 12);
            });

            test('first report aggregate has correct Halstead bugs', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.bugs), 0);
            });

            test('first report aggregate has correct Halstead time', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.time), 1);
            });

            test('first report has correct srcPath', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, 'a');
            });

            test('first-order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 0);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 100);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });

            test('mean per-function logical LOC is correct', () =>
            {
               assert.strictEqual(result.loc, 4);
            });

            test('mean per-function cyclomatic complexity is correct', () =>
            {
               assert.strictEqual(result.cyclomatic, 2);
            });

            test('mean per-function Halstead effort is correct', () =>
            {
               assert.strictEqual(Math.round(result.effort), 12);
            });

            test('mean per-function parameter count is correct', () =>
            {
               assert.strictEqual(result.params, 0);
            });

            test('mean per-function maintainability index is correct', () =>
            {
               assert.strictEqual(Math.round(result.maintainability), 140);
            });
         });

         suite('two modules:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  {
                     ast: Parser.parse('function foo (a, b) { if (a) { b(a); } else { a(b); } } function bar (c, d) { var i; for (i = 0; i < c.length; i += 1) { d += 1; } console.log(d); }'),
                     srcPath: 'b'
                  },
                  { ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'), srcPath: 'a' }
               ]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports is correct length', () =>
            {
               assert.lengthOf(result.reports, 2);
            });

            test('first report aggregate has correct physical lines of code', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.sloc.physical, 1);
            });

            test('first report aggregate has correct logical lines of code', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.sloc.logical, 4);
            });

            test('first report aggregate has correct cyclomatic complexity', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.cyclomatic, 2);
            });

            test('first report aggregate has correct cyclomatic complexity density', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.cyclomaticDensity, 50);
            });

            test('first report methods is empty', () =>
            {
               assert.lengthOf(result.reports[0].methods, 0);
            });

            test('first report aggregate has correct Halstead total operators', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operators.total, 2);
            });

            test('first report aggregate has correct Halstead distinct operators', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operators.distinct, 2);
            });

            test('first report aggregate has correct Halstead total operands', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operands.total, 3);
            });

            test('first report aggregate has correct Halstead distinct operands', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.operands.distinct, 3);
            });

            test('first report aggregate has correct Halstead operator identifier length', () =>
            {
               assert.lengthOf(
                  result.reports[0].aggregate.halstead.operators.identifiers,
                  result.reports[0].aggregate.halstead.operators.distinct
               );
            });

            test('first report aggregate has correct Halstead operand identifier length', () =>
            {
               assert.lengthOf(
                  result.reports[0].aggregate.halstead.operands.identifiers,
                  result.reports[0].aggregate.halstead.operands.distinct
               );
            });

            test('first report aggregate has correct Halstead length', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.length, 5);
            });

            test('first report aggregate has correct Halstead vocabulary', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.vocabulary, 5);
            });

            test('first report aggregate has correct Halstead difficulty', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.difficulty, 1);
            });

            test('first report aggregate has correct Halstead volume', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.volume), 12);
            });

            test('first report aggregate has correct Halstead effort', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.effort), 12);
            });

            test('first report aggregate has correct Halstead bugs', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.bugs), 0);
            });

            test('first report aggregate has correct Halstead time', () =>
            {
               assert.strictEqual(Math.round(result.reports[0].aggregate.halstead.time), 1);
            });

            test('first report has correct srcPath', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, 'a');
            });

            test('second report maintainability index is correct', () =>
            {
               assert.strictEqual(Math.round(result.reports[1].maintainability), 128);
            });

            test('second report first method has correct parameter count', () =>
            {
               assert.strictEqual(result.reports[1].methods[0].params, 2);
            });

            test('second report second method has correct parameter count', () =>
            {
               assert.strictEqual(result.reports[1].methods[1].params, 2);
            });

            test('second report aggregate has correct parameter count', () =>
            {
               assert.strictEqual(result.reports[1].aggregate.params, 4);
            });

            test('second report mean parameter count is correct', () =>
            {
               assert.strictEqual(result.reports[1].params, 2);
            });

            test('second report has correct srcPath', () =>
            {
               assert.strictEqual(result.reports[1].srcPath, 'b');
            });

            test('first-order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 0);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 50);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });

            test('mean per-function logical LOC is correct', () =>
            {
               assert.strictEqual(result.loc, 4);
            });

            test('mean per-function cyclomatic complexity is correct', () =>
            {
               assert.strictEqual(result.cyclomatic, 2);
            });

            test('mean per-function Halstead effort is correct', () =>
            {
               assert.strictEqual(result.effort, 193.1614743092401);
            });

            test('mean per-function parameter count is correct', () =>
            {
               assert.strictEqual(result.params, 1);
            });

            test('mean per-function maintainability index is correct', () =>
            {
               assert.strictEqual(result.maintainability, 134.05623254229997);
            });
         });

         suite('two modules with different options:', () =>
         {
            const modules =
            [
               {
                  ast: Parser.parse('function foo (a, b) { if (a) { b(a); } else { a(b); } } function bar (c, d) { var i; for (i = 0; i < c.length; i += 1) { d += 1; } console.log(d); }'),
                  srcPath: 'b'
               },
               {
                  ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'),
                  srcPath: 'a'
               }
            ];

            let reportsOnly;

            setup(() =>
            {
               reportsOnly = escomplexProject.analyze(modules, { skipCalculation: true });
            });

            test('should have default values if we call with skipCalculation', () =>
            {
               assert.lengthOf(reportsOnly.reports, 2);
               assert.strictEqual(reportsOnly.loc, 0);
               assert.strictEqual(reportsOnly.maintainability, 0);
               assert.strictEqual(reportsOnly.coreSize, 0);
               assert.isUndefined(reportsOnly.adjacencyList);
               assert.isUndefined(reportsOnly.visibilityList);
            });

            test('should have default coreSize and visibilityMatrix if we call with noCoreSize', () =>
            {
               const results = escomplexProject.analyze(modules, { noCoreSize: true });

               assert.strictEqual(results.coreSize, 0);
               assert.isUndefined(results.visibilityList);

               // make sure we still have a few things though
               assert.ok(results.adjacencyList);
               assert.ok(results.loc);
            });

            test('should be able to run processResults', () =>
            {
               const fullReport = escomplexProject.analyze(modules);
               const calcReport = escomplexProject.processResults(reportsOnly);

               assert.deepEqual(calcReport, fullReport);
            });

            test('should be able to run processResults without calculating coreSize', () =>
            {
               const results = escomplexProject.processResults(reportsOnly, { noCoreSize: true });
               assert.strictEqual(results.coreSize, 0);
               assert.isUndefined(results.visibilityList);

               // make sure we still have a few things though
               assert.ok(results.adjacencyList);
               assert.ok(results.loc);
            });

            test('should be able to run processResultsAsync', () =>
            {
               const fullReport = escomplexProject.analyze(modules);

               escomplexProject.processResultsAsync(reportsOnly).then((calcReport) =>
               {
                  assert.deepEqual(calcReport, fullReport);
               });
            });
         });

         suite('local source + NPM module typhonjs-escomplex-commons test w/ serializeReports false:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze(s_LOCAL_TEST_DATA, { serializeReports: false });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].filePath, './src/ESComplexProject.js');
               assert.strictEqual(result.reports[1].filePath, './src/index.js');
               assert.strictEqual(result.reports[2].filePath, './src/Plugins.js');
               assert.strictEqual(result.reports[3].filePath, './test/fixture/testImportNPMAlias.js');
               assert.strictEqual(result.reports[4].filePath, './test/fixture/testRequireNPMAlias.js');
               assert.strictEqual(result.reports[5].filePath, './node_modules/typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js');
               assert.strictEqual(result.reports[6].filePath, './node_modules/typhonjs-escomplex-commons/src/module/report/AbstractReport.js');
               assert.strictEqual(result.reports[7].filePath, './node_modules/typhonjs-escomplex-commons/src/module/report/ClassReport.js');
               assert.strictEqual(result.reports[8].filePath, './node_modules/typhonjs-escomplex-commons/src/module/report/HalsteadData.js');
               assert.strictEqual(result.reports[9].filePath, './node_modules/typhonjs-escomplex-commons/src/module/report/MethodReport.js');
               assert.strictEqual(result.reports[10].filePath, './node_modules/typhonjs-escomplex-commons/src/module/report/ModuleReport.js');
               assert.strictEqual(result.reports[11].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/actualize.js');
               assert.strictEqual(result.reports[12].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js');
               assert.strictEqual(result.reports[13].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/safeArray.js');
               assert.strictEqual(result.reports[14].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/safeName.js');
               assert.strictEqual(result.reports[15].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/Trait.js');
               assert.strictEqual(result.reports[16].filePath, './node_modules/typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js');
               assert.strictEqual(result.reports[17].filePath, './node_modules/typhonjs-escomplex-commons/src/project/result/ProjectResult.js');
               assert.strictEqual(result.reports[18].filePath, './node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[19].filePath, './node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[20].filePath, './node_modules/typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[21].filePath, './node_modules/typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[22].filePath, './node_modules/typhonjs-escomplex-module/src/Plugins.js');

               assert.strictEqual(result.reports[0].srcPath, './src/ESComplexProject.js');
               assert.strictEqual(result.reports[1].srcPath, './src/index.js');
               assert.strictEqual(result.reports[2].srcPath, './src/Plugins.js');
               assert.strictEqual(result.reports[3].srcPath, './test/fixture/testImportNPMAlias.js');
               assert.strictEqual(result.reports[4].srcPath, './test/fixture/testRequireNPMAlias.js');
               assert.strictEqual(result.reports[5].srcPath, 'typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js');
               assert.strictEqual(result.reports[6].srcPath, 'typhonjs-escomplex-commons/src/module/report/AbstractReport.js');
               assert.strictEqual(result.reports[7].srcPath, 'typhonjs-escomplex-commons/src/module/report/ClassReport.js');
               assert.strictEqual(result.reports[8].srcPath, 'typhonjs-escomplex-commons/src/module/report/HalsteadData.js');
               assert.strictEqual(result.reports[9].srcPath, 'typhonjs-escomplex-commons/src/module/report/MethodReport.js');
               assert.strictEqual(result.reports[10].srcPath, 'typhonjs-escomplex-commons/src/module/report/ModuleReport.js');
               assert.strictEqual(result.reports[11].srcPath, 'typhonjs-escomplex-commons/src/module/traits/actualize.js');
               assert.strictEqual(result.reports[12].srcPath, 'typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js');
               assert.strictEqual(result.reports[13].srcPath, 'typhonjs-escomplex-commons/src/module/traits/safeArray.js');
               assert.strictEqual(result.reports[14].srcPath, 'typhonjs-escomplex-commons/src/module/traits/safeName.js');
               assert.strictEqual(result.reports[15].srcPath, 'typhonjs-escomplex-commons/src/module/traits/Trait.js');
               assert.strictEqual(result.reports[16].srcPath, 'typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js');
               assert.strictEqual(result.reports[17].srcPath, 'typhonjs-escomplex-commons/src/project/result/ProjectResult.js');
               assert.strictEqual(result.reports[18].srcPath, 'typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[19].srcPath, 'typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[20].srcPath, 'typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[21].srcPath, 'typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[22].srcPath, 'typhonjs-escomplex-module/src/Plugins.js');

               assert.strictEqual(result.reports[21].srcPathAlias, 'typhonjs-escomplex-module');
            });

            test('reports only contains object hash / srcPath entries', () =>
            {
               const testString = '[{"filePath":"./src/ESComplexProject.js","srcPath":"./src/ESComplexProject.js"},{"filePath":"./src/index.js","srcPath":"./src/index.js"},{"filePath":"./src/Plugins.js","srcPath":"./src/Plugins.js"},{"filePath":"./test/fixture/testImportNPMAlias.js","srcPath":"./test/fixture/testImportNPMAlias.js"},{"filePath":"./test/fixture/testRequireNPMAlias.js","srcPath":"./test/fixture/testRequireNPMAlias.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js","srcPath":"typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/AbstractReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/AbstractReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/ClassReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/ClassReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/HalsteadData.js","srcPath":"typhonjs-escomplex-commons/src/module/report/HalsteadData.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/MethodReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/MethodReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/ModuleReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/ModuleReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/actualize.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/actualize.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/safeArray.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/safeArray.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/safeName.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/safeName.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/Trait.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/Trait.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/project/result/ProjectResult.js","srcPath":"typhonjs-escomplex-commons/src/project/result/ProjectResult.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js","srcPath":"typhonjs-escomplex-commons/src/utils/MathUtil.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js","srcPath":"typhonjs-escomplex-commons/src/utils/StringUtil.js"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/ESComplexModule.js","srcPath":"typhonjs-escomplex-module/src/ESComplexModule.js"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/index.js","srcPath":"typhonjs-escomplex-module/src/index.js","srcPathAlias":"typhonjs-escomplex-module"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/Plugins.js","srcPath":"typhonjs-escomplex-module/src/Plugins.js"}]';

               assert.strictEqual(JSON.stringify(result.reports), testString);
            });
         });

         suite('local source + NPM module typhonjs-escomplex-commons test w/ dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze(s_LOCAL_TEST_DATA, { commonjs: true });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, './src/ESComplexProject.js');
               assert.strictEqual(result.reports[1].srcPath, './src/index.js');
               assert.strictEqual(result.reports[2].srcPath, './src/Plugins.js');
               assert.strictEqual(result.reports[3].srcPath, './test/fixture/testImportNPMAlias.js');
               assert.strictEqual(result.reports[4].srcPath, './test/fixture/testRequireNPMAlias.js');
               assert.strictEqual(result.reports[5].srcPath, 'typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js');
               assert.strictEqual(result.reports[6].srcPath, 'typhonjs-escomplex-commons/src/module/report/AbstractReport.js');
               assert.strictEqual(result.reports[7].srcPath, 'typhonjs-escomplex-commons/src/module/report/ClassReport.js');
               assert.strictEqual(result.reports[8].srcPath, 'typhonjs-escomplex-commons/src/module/report/HalsteadData.js');
               assert.strictEqual(result.reports[9].srcPath, 'typhonjs-escomplex-commons/src/module/report/MethodReport.js');
               assert.strictEqual(result.reports[10].srcPath, 'typhonjs-escomplex-commons/src/module/report/ModuleReport.js');
               assert.strictEqual(result.reports[11].srcPath, 'typhonjs-escomplex-commons/src/module/traits/actualize.js');
               assert.strictEqual(result.reports[12].srcPath, 'typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js');
               assert.strictEqual(result.reports[13].srcPath, 'typhonjs-escomplex-commons/src/module/traits/safeArray.js');
               assert.strictEqual(result.reports[14].srcPath, 'typhonjs-escomplex-commons/src/module/traits/safeName.js');
               assert.strictEqual(result.reports[15].srcPath, 'typhonjs-escomplex-commons/src/module/traits/Trait.js');
               assert.strictEqual(result.reports[16].srcPath, 'typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js');
               assert.strictEqual(result.reports[17].srcPath, 'typhonjs-escomplex-commons/src/project/result/ProjectResult.js');
               assert.strictEqual(result.reports[18].srcPath, 'typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[19].srcPath, 'typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[20].srcPath, 'typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[21].srcPath, 'typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[22].srcPath, 'typhonjs-escomplex-module/src/Plugins.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[2,10,17,20],[0],[],[21],[21],[],[],[6,9],[],[6,8],[6,7,9],[12,13,15],[16],[],[],[],[],[10,19],[],[],[22],[20],[10]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,2,6,7,8,9,10,17,19,20,22],[0,1,2,6,7,8,9,10,17,19,20,22],[2],[3,6,7,8,9,10,20,21,22],[4,6,7,8,9,10,20,21,22],[5],[6],[6,7,8,9],[8],[6,8,9],[6,7,8,9,10],[11,12,13,15,16],[12,16],[13],[14],[15],[16],[6,7,8,9,10,17,19],[18],[19],[6,7,8,9,10,20,22],[6,7,8,9,10,20,21,22],[6,7,8,9,10,22]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('toStringAdjacency', () =>
            {
               const testString = '0:\t./src/ESComplexProject.js\n\t2:\t./src/Plugins.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\n1:\t./src/index.js\n\t0:\t./src/ESComplexProject.js\n\n2:\t./src/Plugins.js\n\n3:\t./test/fixture/testImportNPMAlias.js\n\t21:\ttyphonjs-escomplex-module/src/index.js\n\n4:\t./test/fixture/testRequireNPMAlias.js\n\t21:\ttyphonjs-escomplex-module/src/index.js\n\n5:\ttyphonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js\n\n6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\n7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\n8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\n9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\n10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\n11:\ttyphonjs-escomplex-commons/src/module/traits/actualize.js\n\t12:\ttyphonjs-escomplex-commons/src/module/traits/HalsteadArray.js\n\t13:\ttyphonjs-escomplex-commons/src/module/traits/safeArray.js\n\t15:\ttyphonjs-escomplex-commons/src/module/traits/Trait.js\n\n12:\ttyphonjs-escomplex-commons/src/module/traits/HalsteadArray.js\n\t16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\n13:\ttyphonjs-escomplex-commons/src/module/traits/safeArray.js\n\n14:\ttyphonjs-escomplex-commons/src/module/traits/safeName.js\n\n15:\ttyphonjs-escomplex-commons/src/module/traits/Trait.js\n\n16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\n17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\n18:\ttyphonjs-escomplex-commons/src/utils/MathUtil.js\n\n19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\n20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n21:\ttyphonjs-escomplex-module/src/index.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\n22:\ttyphonjs-escomplex-module/src/Plugins.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\n';

               assert.strictEqual(result.toStringAdjacency(), testString);
            });

            test('toStringVisibility', () =>
            {
               const testString = '0:\t./src/ESComplexProject.js\n\t0:\t./src/ESComplexProject.js\n\t2:\t./src/Plugins.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n1:\t./src/index.js\n\t0:\t./src/ESComplexProject.js\n\t1:\t./src/index.js\n\t2:\t./src/Plugins.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n2:\t./src/Plugins.js\n\t2:\t./src/Plugins.js\n\n3:\t./test/fixture/testImportNPMAlias.js\n\t3:\t./test/fixture/testImportNPMAlias.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t21:\ttyphonjs-escomplex-module/src/index.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n4:\t./test/fixture/testRequireNPMAlias.js\n\t4:\t./test/fixture/testRequireNPMAlias.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t21:\ttyphonjs-escomplex-module/src/index.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n5:\ttyphonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js\n\t5:\ttyphonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js\n\n6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\n7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\n8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\n9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\n10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\n11:\ttyphonjs-escomplex-commons/src/module/traits/actualize.js\n\t11:\ttyphonjs-escomplex-commons/src/module/traits/actualize.js\n\t12:\ttyphonjs-escomplex-commons/src/module/traits/HalsteadArray.js\n\t13:\ttyphonjs-escomplex-commons/src/module/traits/safeArray.js\n\t15:\ttyphonjs-escomplex-commons/src/module/traits/Trait.js\n\t16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\n12:\ttyphonjs-escomplex-commons/src/module/traits/HalsteadArray.js\n\t12:\ttyphonjs-escomplex-commons/src/module/traits/HalsteadArray.js\n\t16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\n13:\ttyphonjs-escomplex-commons/src/module/traits/safeArray.js\n\t13:\ttyphonjs-escomplex-commons/src/module/traits/safeArray.js\n\n14:\ttyphonjs-escomplex-commons/src/module/traits/safeName.js\n\t14:\ttyphonjs-escomplex-commons/src/module/traits/safeName.js\n\n15:\ttyphonjs-escomplex-commons/src/module/traits/Trait.js\n\t15:\ttyphonjs-escomplex-commons/src/module/traits/Trait.js\n\n16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\t16:\ttyphonjs-escomplex-commons/src/module/traits/TraitHalstead.js\n\n17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t17:\ttyphonjs-escomplex-commons/src/project/result/ProjectResult.js\n\t19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\n18:\ttyphonjs-escomplex-commons/src/utils/MathUtil.js\n\t18:\ttyphonjs-escomplex-commons/src/utils/MathUtil.js\n\n19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\t19:\ttyphonjs-escomplex-commons/src/utils/StringUtil.js\n\n20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n21:\ttyphonjs-escomplex-module/src/index.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t20:\ttyphonjs-escomplex-module/src/ESComplexModule.js\n\t21:\ttyphonjs-escomplex-module/src/index.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n22:\ttyphonjs-escomplex-module/src/Plugins.js\n\t6:\ttyphonjs-escomplex-commons/src/module/report/AbstractReport.js\n\t7:\ttyphonjs-escomplex-commons/src/module/report/ClassReport.js\n\t8:\ttyphonjs-escomplex-commons/src/module/report/HalsteadData.js\n\t9:\ttyphonjs-escomplex-commons/src/module/report/MethodReport.js\n\t10:\ttyphonjs-escomplex-commons/src/module/report/ModuleReport.js\n\t22:\ttyphonjs-escomplex-module/src/Plugins.js\n\n';

               assert.strictEqual(result.toStringVisibility(), testString);
            });
         });

         suite('cjs modules with dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('require("./a");'), srcPath: '/d.js' },
                  { ast: Parser.parse('require("./b");'), srcPath: '/a/c.js' },
                  { ast: Parser.parse('require("./c");'), srcPath: '/a/b.js' },
                  { ast: Parser.parse('require("./a/b");require("./a/c");'), srcPath: '/a.js' }
               ], { commonjs: true });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, '/a.js');
               assert.strictEqual(result.reports[1].srcPath, '/a/b.js');
               assert.strictEqual(result.reports[2].srcPath, '/a/c.js');
               assert.strictEqual(result.reports[3].srcPath, '/d.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[1,2],[2],[1],[0]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,1,2],[1,2],[1,2],[0,1,2,3]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('first order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 31.25);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 68.75);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });
         });

         suite('cjs modules with dynamic dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('require("dynamic_a");'), srcPath: '/d.js' },
                  { ast: Parser.parse('require("dynamic_b");'), srcPath: '/a/c.js' },
                  { ast: Parser.parse('require("dynamic_c");'), srcPath: '/a/b.js' },
                  { ast: Parser.parse('require("./a/b");require("./a/c");'), srcPath: '/a.js' }
               ],
               { commonjs: true, dependencyResolver: (dependency) =>
                  {
                     switch (dependency)
                     {
                        case 'dynamic_a': return './a';
                        case 'dynamic_b': return './b';
                        case 'dynamic_c': return './c';
                        default: return dependency;
                     }
                  }
               });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, '/a.js');
               assert.strictEqual(result.reports[1].srcPath, '/a/b.js');
               assert.strictEqual(result.reports[2].srcPath, '/a/c.js');
               assert.strictEqual(result.reports[3].srcPath, '/d.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[1,2],[2],[1],[0]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,1,2],[1,2],[1,2],[0,1,2,3]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('first order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 31.25);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 68.75);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });
         });

         suite('esm modules with dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('import d from "./a";'), srcPath: '/d.js' },
                  { ast: Parser.parse('import c from "./b";'), srcPath: '/a/c.js' },
                  { ast: Parser.parse('import b from "./c";'), srcPath: '/a/b.js' },
                  { ast: Parser.parse('import a from "./a/b"; import aa from "./a/c";'), srcPath: '/a.js' }
               ]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, '/a.js');
               assert.strictEqual(result.reports[1].srcPath, '/a/b.js');
               assert.strictEqual(result.reports[2].srcPath, '/a/c.js');
               assert.strictEqual(result.reports[3].srcPath, '/d.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[1,2],[2],[1],[0]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,1,2],[1,2],[1,2],[0,1,2,3]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('first order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 31.25);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 68.75);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });
         });

         suite('esm modules with dynamic dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('import d from "dynamic_a";'), srcPath: '/d.js' },
                  { ast: Parser.parse('import c from "dynamic_b";'), srcPath: '/a/c.js' },
                  { ast: Parser.parse('import b from "dynamic_c";'), srcPath: '/a/b.js' },
                  { ast: Parser.parse('import a from "./a/b"; import aa from "./a/c";'), srcPath: '/a.js' }
               ],
               {
                  dependencyResolver: (dependency) =>
                  {
                     switch (dependency)
                     {
                        case 'dynamic_a': return './a';
                        case 'dynamic_b': return './b';
                        case 'dynamic_c': return './c';
                        default: return dependency;
                     }
                  }
               });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, '/a.js');
               assert.strictEqual(result.reports[1].srcPath, '/a/b.js');
               assert.strictEqual(result.reports[2].srcPath, '/a/c.js');
               assert.strictEqual(result.reports[3].srcPath, '/d.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[1,2],[2],[1],[0]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,1,2],[1,2],[1,2],[0,1,2,3]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('first order density is correct', () =>
            {
               assert.strictEqual(result.firstOrderDensity, 31.25);
            });

            test('change cost is correct', () =>
            {
               assert.strictEqual(result.changeCost, 68.75);
            });

            test('core size is correct', () =>
            {
               assert.strictEqual(result.coreSize, 0);
            });
         });

         suite('MacCormack, Rusnak & Baldwin example:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('"f";'), srcPath: '/a/c/f.js' },
                  { ast: Parser.parse('require("./f");"e";'), srcPath: '/a/c/e.js' },
                  { ast: Parser.parse('"d";'), srcPath: '/a/b/d.js' },
                  { ast: Parser.parse('require("./c/e");"c";'), srcPath: '/a/c.js' },
                  { ast: Parser.parse('require("./b/d");"b";'), srcPath: '/a/b.js' },
                  { ast: Parser.parse('require("./a/b");require("./a/c");"a";'), srcPath: '/a.js' }
               ], { commonjs: true });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, '/a.js');
               assert.strictEqual(result.reports[1].srcPath, '/a/b.js');
               assert.strictEqual(result.reports[2].srcPath, '/a/b/d.js');
               assert.strictEqual(result.reports[3].srcPath, '/a/c.js');
               assert.strictEqual(result.reports[4].srcPath, '/a/c/e.js');
               assert.strictEqual(result.reports[5].srcPath, '/a/c/f.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[[1,3],[2],[],[4],[5],[]]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[[0,1,2,3,4,5],[1,2],[2],[3,4,5],[4,5],[5]]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
            });

            test('first order density is correct', () =>
            {
               assert.isTrue(result.firstOrderDensity > 13.88);
               assert.isTrue(result.firstOrderDensity < 13.89);
            });

            test('change cost is correct', () =>
            {
               assert.isTrue(result.changeCost > 41.66);
               assert.isTrue(result.changeCost < 41.67);
            });

            test('core size is correct', () =>
            {
               assert.isTrue(result.coreSize > 16.66);
               assert.isTrue(result.coreSize < 16.67);
            });
         });

         suite('large project calculation performance', () =>
         {
            const resultFixture = require('../fixture/large_project');
            const resultSkipCalc = escomplexProject.analyze(s_LOCAL_TEST_DATA, { skipCalculation: true });

            test('deserialize JSON object should be sufficiently fast', function()
            {
               this.timeout(100);
               ProjectResult.parse(resultFixture);
            });

            test('running calculations should be sufficiently fast', function()
            {
               this.timeout(100);
               escomplexProject.processResults(resultSkipCalc);
            });

            test('running analyze should be sufficiently fast', function()
            {
               this.timeout(200);
               escomplexProject.analyze(s_LOCAL_TEST_DATA);
            });
         });
      });
   });
}

