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
      /**
       * Load project source and local test files from NPM module typhonjs-escomplex-commons and
       * typhonjs-escomplex-module. The order is purposely out of order to test sorting of `srcPath`.
       * @type {string[]}
       */
      const s_LOCAL_TEST_FILES =
      [
         './node_modules/typhonjs-escomplex-module/src/ESComplexModule.js',
         './node_modules/typhonjs-escomplex-module/src/index.js',
         './node_modules/typhonjs-escomplex-module/src/Plugins.js',

         './node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js',
         './node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js',
         './node_modules/typhonjs-escomplex-commons/src/utils/ObjectUtil.js',
         './node_modules/typhonjs-escomplex-commons/src/project/result/ProjectResult.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/TransformFormat.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js',
         './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js',
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
               assert.strictEqual(result.reports[0].aggregate.halstead.volume, 11.61);
            });

            test('first report aggregate has correct Halstead effort', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.effort, 11.61);
            });

            test('first report aggregate has correct Halstead bugs', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.bugs, 0.004);
            });

            test('first report aggregate has correct Halstead time', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.time, 0.645);
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
               assert.strictEqual(result.effort, 11.61);
            });

            test('mean per-function parameter count is correct', () =>
            {
               assert.strictEqual(result.params, 0);
            });

            test('mean per-function maintainability index is correct', () =>
            {
               assert.strictEqual(result.maintainability, 139.997);
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
               assert.strictEqual(result.reports[0].aggregate.halstead.volume, 11.61);
            });

            test('first report aggregate has correct Halstead effort', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.effort, 11.61);
            });

            test('first report aggregate has correct Halstead bugs', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.bugs, 0.004);
            });

            test('first report aggregate has correct Halstead time', () =>
            {
               assert.strictEqual(result.reports[0].aggregate.halstead.time, 0.645);
            });

            test('first report has correct srcPath', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, 'a');
            });

            test('second report maintainability index is correct', () =>
            {
               assert.strictEqual(result.reports[1].maintainability, 128.115);
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
               assert.strictEqual(result.effort, 193.162);
            });

            test('mean per-function parameter count is correct', () =>
            {
               assert.strictEqual(result.params, 1);
            });

            test('mean per-function maintainability index is correct', () =>
            {
               assert.strictEqual(result.maintainability, 134.056);
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
// TODO REMOVE
/*
result.reports.forEach((report, index) =>
{
   console.log(`assert.strictEqual(result.reports[${index}].filePath, '${report.filePath}');`);
});

result.reports.forEach((report, index) =>
{
   console.log(`assert.strictEqual(result.reports[${index}].srcPath, '${report.srcPath}');`);
});
*/
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
               assert.strictEqual(result.reports[18].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js');
               assert.strictEqual(result.reports[19].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js');
               assert.strictEqual(result.reports[20].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js');
               assert.strictEqual(result.reports[21].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js');
               assert.strictEqual(result.reports[22].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js');
               assert.strictEqual(result.reports[23].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js');
               assert.strictEqual(result.reports[24].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js');
               assert.strictEqual(result.reports[25].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js');
               assert.strictEqual(result.reports[26].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js');
               assert.strictEqual(result.reports[27].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js');
               assert.strictEqual(result.reports[28].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js');
               assert.strictEqual(result.reports[29].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js');
               assert.strictEqual(result.reports[30].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js');
               assert.strictEqual(result.reports[31].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js');
               assert.strictEqual(result.reports[32].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js');
               assert.strictEqual(result.reports[33].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js');
               assert.strictEqual(result.reports[34].filePath, './node_modules/typhonjs-escomplex-commons/src/transform/TransformFormat.js');
               assert.strictEqual(result.reports[35].filePath, './node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[36].filePath, './node_modules/typhonjs-escomplex-commons/src/utils/ObjectUtil.js');
               assert.strictEqual(result.reports[37].filePath, './node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[38].filePath, './node_modules/typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[39].filePath, './node_modules/typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[40].filePath, './node_modules/typhonjs-escomplex-module/src/Plugins.js');

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
               assert.strictEqual(result.reports[18].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js');
               assert.strictEqual(result.reports[19].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js');
               assert.strictEqual(result.reports[20].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js');
               assert.strictEqual(result.reports[21].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js');
               assert.strictEqual(result.reports[22].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js');
               assert.strictEqual(result.reports[23].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js');
               assert.strictEqual(result.reports[24].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js');
               assert.strictEqual(result.reports[25].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js');
               assert.strictEqual(result.reports[26].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js');
               assert.strictEqual(result.reports[27].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js');
               assert.strictEqual(result.reports[28].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js');
               assert.strictEqual(result.reports[29].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js');
               assert.strictEqual(result.reports[30].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js');
               assert.strictEqual(result.reports[31].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js');
               assert.strictEqual(result.reports[32].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js');
               assert.strictEqual(result.reports[33].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js');
               assert.strictEqual(result.reports[34].srcPath, 'typhonjs-escomplex-commons/src/transform/TransformFormat.js');
               assert.strictEqual(result.reports[35].srcPath, 'typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[36].srcPath, 'typhonjs-escomplex-commons/src/utils/ObjectUtil.js');
               assert.strictEqual(result.reports[37].srcPath, 'typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[38].srcPath, 'typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[39].srcPath, 'typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[40].srcPath, 'typhonjs-escomplex-module/src/Plugins.js');

               assert.strictEqual(result.reports[39].srcPathAlias, 'typhonjs-escomplex-module');
            });

            test('reports only contains object hash w/ filePath, srcPath and srcPathAlias entries', () =>
            {
               const testString = '[{"filePath":"./src/ESComplexProject.js","srcPath":"./src/ESComplexProject.js"},{"filePath":"./src/index.js","srcPath":"./src/index.js"},{"filePath":"./src/Plugins.js","srcPath":"./src/Plugins.js"},{"filePath":"./test/fixture/testImportNPMAlias.js","srcPath":"./test/fixture/testImportNPMAlias.js"},{"filePath":"./test/fixture/testRequireNPMAlias.js","srcPath":"./test/fixture/testRequireNPMAlias.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js","srcPath":"typhonjs-escomplex-commons/src/module/plugin/syntax/AbstractSyntaxLoader.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/AbstractReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/AbstractReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/ClassReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/ClassReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/HalsteadData.js","srcPath":"typhonjs-escomplex-commons/src/module/report/HalsteadData.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/MethodReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/MethodReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/report/ModuleReport.js","srcPath":"typhonjs-escomplex-commons/src/module/report/ModuleReport.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/actualize.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/actualize.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/HalsteadArray.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/safeArray.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/safeArray.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/safeName.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/safeName.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/Trait.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/Trait.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js","srcPath":"typhonjs-escomplex-commons/src/module/traits/TraitHalstead.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/project/result/ProjectResult.js","srcPath":"typhonjs-escomplex-commons/src/project/result/ProjectResult.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js","srcPath":"typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/transform/TransformFormat.js","srcPath":"typhonjs-escomplex-commons/src/transform/TransformFormat.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/utils/MathUtil.js","srcPath":"typhonjs-escomplex-commons/src/utils/MathUtil.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/utils/ObjectUtil.js","srcPath":"typhonjs-escomplex-commons/src/utils/ObjectUtil.js"},{"filePath":"./node_modules/typhonjs-escomplex-commons/src/utils/StringUtil.js","srcPath":"typhonjs-escomplex-commons/src/utils/StringUtil.js"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/ESComplexModule.js","srcPath":"typhonjs-escomplex-module/src/ESComplexModule.js"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/index.js","srcPath":"typhonjs-escomplex-module/src/index.js","srcPathAlias":"typhonjs-escomplex-module"},{"filePath":"./node_modules/typhonjs-escomplex-module/src/Plugins.js","srcPath":"typhonjs-escomplex-module/src/Plugins.js"}]';

               assert.strictEqual(JSON.stringify(result.reports), testString);
            });
         });

         suite('local source + NPM module typhonjs-escomplex-commons and typhonjs-escomplex-module test w/ dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze(s_LOCAL_TEST_DATA, { commonjs: true, serializeReports: false });
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
// TODO REMOVE
// fs.writeFileSync(process.cwd() + '/test/fixture/large_project2.json', result.toFormat('json', { spacing: 3}), 'utf8');

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
               assert.strictEqual(result.reports[18].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSON.js');
               assert.strictEqual(result.reports[19].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONCheckstyle.js');
               assert.strictEqual(result.reports[20].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONMinimal.js');
               assert.strictEqual(result.reports[21].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/json/FormatJSONModules.js');
               assert.strictEqual(result.reports[22].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdown.js');
               assert.strictEqual(result.reports[23].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownAdjacency.js');
               assert.strictEqual(result.reports[24].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownMinimal.js');
               assert.strictEqual(result.reports[25].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownModules.js');
               assert.strictEqual(result.reports[26].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/markdown/FormatMarkdownVisibility.js');
               assert.strictEqual(result.reports[27].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/AbstractFormatText.js');
               assert.strictEqual(result.reports[28].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/AbstractTextMatrix.js');
               assert.strictEqual(result.reports[29].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatText.js');
               assert.strictEqual(result.reports[30].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextAdjacency.js');
               assert.strictEqual(result.reports[31].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextMinimal.js');
               assert.strictEqual(result.reports[32].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextModules.js');
               assert.strictEqual(result.reports[33].srcPath, 'typhonjs-escomplex-commons/src/transform/formats/text/FormatTextVisibility.js');
               assert.strictEqual(result.reports[34].srcPath, 'typhonjs-escomplex-commons/src/transform/TransformFormat.js');
               assert.strictEqual(result.reports[35].srcPath, 'typhonjs-escomplex-commons/src/utils/MathUtil.js');
               assert.strictEqual(result.reports[36].srcPath, 'typhonjs-escomplex-commons/src/utils/ObjectUtil.js');
               assert.strictEqual(result.reports[37].srcPath, 'typhonjs-escomplex-commons/src/utils/StringUtil.js');
               assert.strictEqual(result.reports[38].srcPath, 'typhonjs-escomplex-module/src/ESComplexModule.js');
               assert.strictEqual(result.reports[39].srcPath, 'typhonjs-escomplex-module/src/index.js');
               assert.strictEqual(result.reports[40].srcPath, 'typhonjs-escomplex-module/src/Plugins.js');
            });

            test('adjacency list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[2,10,17,38]},{"row":1,"cols":[0]},{"row":3,"cols":[39]},{"row":4,"cols":[39]},{"row":7,"cols":[6,9]},{"row":9,"cols":[6,8]},{"row":10,"cols":[6,7,9,34,35]},{"row":11,"cols":[12,13,15]},{"row":12,"cols":[16]},{"row":17,"cols":[10,34,35,37]},{"row":19,"cols":[36]},{"row":20,"cols":[36]},{"row":22,"cols":[29,37]},{"row":23,"cols":[30]},{"row":24,"cols":[31,37]},{"row":25,"cols":[27]},{"row":26,"cols":[33]},{"row":27,"cols":[37]},{"row":28,"cols":[36]},{"row":29,"cols":[27,34]},{"row":30,"cols":[28]},{"row":31,"cols":[27]},{"row":32,"cols":[27]},{"row":33,"cols":[28]},{"row":34,"cols":[10,17,18,19,20,21,22,23,24,25,26,29,30,31,32,33]},{"row":35,"cols":[36]},{"row":37,"cols":[36]},{"row":38,"cols":[40]},{"row":39,"cols":[38]},{"row":40,"cols":[10]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,2,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40]},{"row":1,"cols":[0,1,2,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40]},{"row":2,"cols":[2]},{"row":3,"cols":[3,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]},{"row":4,"cols":[4,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]},{"row":5,"cols":[5]},{"row":6,"cols":[6]},{"row":7,"cols":[6,7,8,9]},{"row":8,"cols":[8]},{"row":9,"cols":[6,8,9]},{"row":10,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]},{"row":11,"cols":[11,12,13,15,16]},{"row":12,"cols":[12,16]},{"row":13,"cols":[13]},{"row":14,"cols":[14]},{"row":15,"cols":[15]},{"row":16,"cols":[16]},{"row":17,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]},{"row":18,"cols":[18]},{"row":19,"cols":[19,36]},{"row":20,"cols":[20,36]},{"row":21,"cols":[21]},{"row":22,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]},{"row":23,"cols":[23,28,30,36]},{"row":24,"cols":[24,27,31,36,37]},{"row":25,"cols":[25,27,36,37]},{"row":26,"cols":[26,28,33,36]},{"row":27,"cols":[27,36,37]},{"row":28,"cols":[28,36]},{"row":29,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]},{"row":30,"cols":[28,30,36]},{"row":31,"cols":[27,31,36,37]},{"row":32,"cols":[27,32,36,37]},{"row":33,"cols":[28,33,36]},{"row":34,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]},{"row":35,"cols":[35,36]},{"row":36,"cols":[36]},{"row":37,"cols":[36,37]},{"row":38,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40]},{"row":39,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]},{"row":40,"cols":[6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,40]}]';

               assert.strictEqual(JSON.stringify(result.visibilityList), testString);
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
               const testString = '[{"row":0,"cols":[1,2]},{"row":1,"cols":[2]},{"row":2,"cols":[1]},{"row":3,"cols":[0]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,1,2]},{"row":1,"cols":[1,2]},{"row":2,"cols":[1,2]},{"row":3,"cols":[0,1,2,3]}]';

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
               const testString = '[{"row":0,"cols":[1,2]},{"row":1,"cols":[2]},{"row":2,"cols":[1]},{"row":3,"cols":[0]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,1,2]},{"row":1,"cols":[1,2]},{"row":2,"cols":[1,2]},{"row":3,"cols":[0,1,2,3]}]';

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
               const testString = '[{"row":0,"cols":[1,2]},{"row":1,"cols":[2]},{"row":2,"cols":[1]},{"row":3,"cols":[0]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,1,2]},{"row":1,"cols":[1,2]},{"row":2,"cols":[1,2]},{"row":3,"cols":[0,1,2,3]}]';

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
               const testString = '[{"row":0,"cols":[1,2]},{"row":1,"cols":[2]},{"row":2,"cols":[1]},{"row":3,"cols":[0]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,1,2]},{"row":1,"cols":[1,2]},{"row":2,"cols":[1,2]},{"row":3,"cols":[0,1,2,3]}]';

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
               const testString = '[{"row":0,"cols":[1,3]},{"row":1,"cols":[2]},{"row":3,"cols":[4]},{"row":4,"cols":[5]}]';

               assert.strictEqual(JSON.stringify(result.adjacencyList), testString);
            });

            test('visibility list is correct', () =>
            {
               const testString = '[{"row":0,"cols":[0,1,2,3,4,5]},{"row":1,"cols":[1,2]},{"row":2,"cols":[2]},{"row":3,"cols":[3,4,5]},{"row":4,"cols":[4,5]},{"row":5,"cols":[5]}]';

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
            const resultFixture = require('typhonjs-escomplex-test-data/files/large-project/results/results');
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
               this.timeout(400);
               escomplexProject.analyze(s_LOCAL_TEST_DATA);
            });
         });
      });
   });
}

