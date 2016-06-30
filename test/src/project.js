'use strict';

import { assert }       from 'chai';

import parsers          from './parsers';
import * as testconfig  from './testconfig';

import escomplexProject from '../../src';

if (testconfig.modules['project'])
{
   parsers.forEach((Parser) =>
   {
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

         test('analyzeThen function is exported', () =>
         {
            assert.isFunction(escomplexProject.analyzeThen);
         });

         test('processResultsThen function is exported', () =>
         {
            assert.isFunction(escomplexProject.processResultsThen);
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

         test('analyzeThen does not throw when modules is array', () =>
         {
            assert.doesNotThrow(() =>
            {
               escomplexProject.analyzeThen([]);
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

            test('adjacency matrix exists', () =>
            {
               assert.isArray(result.adjacencyMatrix);
            });

            test('adjacency matrix has zero length', () =>
            {
               assert.lengthOf(result.adjacencyMatrix, 0);
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
               result = escomplexProject.analyze([{ ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'), path: 'a' }]);
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

            test('first report has correct path', () =>
            {
               assert.strictEqual(result.reports[0].path, 'a');
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
                     path: 'b'
                  },
                  { ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'), path: 'a' }
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

            test('first report has correct path', () =>
            {
               assert.strictEqual(result.reports[0].path, 'a');
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

            test('second report has correct path', () =>
            {
               assert.strictEqual(result.reports[1].path, 'b');
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
            const modules = [];
            let reportsOnly;

            setup(() =>
            {
               modules.push({
                  ast: Parser.parse('function foo (a, b) { if (a) { b(a); } else { a(b); } } function bar (c, d) { var i; for (i = 0; i < c.length; i += 1) { d += 1; } console.log(d); }'),
                  path: 'b'
               });
               modules.push({
                  ast: Parser.parse('if (true) { "foo"; } else { "bar"; }'),
                  path: 'a'
               });
               reportsOnly = escomplexProject.analyze(modules, { skipCalculation: true });
            });

            test('should not have aggregates if we call with skipCalculation', () =>
            {
               assert.deepEqual(Object.keys(reportsOnly), ['reports']);
            });

            test('should not have coreSize or visibilityMatrix if we call with noCoreSize', () =>
            {
               const results = escomplexProject.analyze(modules, { noCoreSize: true });
               assert.notOk(results.coreSize);
               assert.notOk(results.visibilityMatrix);
               // make sure we still have a few things though
               assert.ok(results.adjacencyMatrix);
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
               assert.notOk(results.coreSize);
               assert.notOk(results.visibilityMatrix);
               // make sure we still have a few things though
               assert.ok(results.adjacencyMatrix);
               assert.ok(results.loc);
            });

            test('should be able to run processResultsThen', () =>
            {
               const fullReport = escomplexProject.analyze(modules);

               escomplexProject.processResultsThen(reportsOnly).then((calcReport) =>
               {
                  assert.deepEqual(calcReport, fullReport);
               });
            });
         });

         suite('modules with dependencies:', () =>
         {
            let result;

            setup(() =>
            {
               result = escomplexProject.analyze([
                  { ast: Parser.parse('require("./a");"d";'), path: '/d.js' },
                  { ast: Parser.parse('require("./b");"c";'), path: '/a/c.js' },
                  { ast: Parser.parse('require("./c");"b";'), path: '/a/b.js' },
                  { ast: Parser.parse('require("./a/b");require("./a/c");"a";'), path: '/a.js' }
               ]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].path, '/a.js');
               assert.strictEqual(result.reports[1].path, '/d.js');
               assert.strictEqual(result.reports[2].path, '/a/b.js');
               assert.strictEqual(result.reports[3].path, '/a/c.js');
            });

            test('adjacency matrix is correct', () =>
            {
               assert.lengthOf(result.adjacencyMatrix, 4);

               assert.lengthOf(result.adjacencyMatrix[0], 4);
               assert.strictEqual(result.adjacencyMatrix[0][0], 0);
               assert.strictEqual(result.adjacencyMatrix[0][1], 0);
               assert.strictEqual(result.adjacencyMatrix[0][2], 1);
               assert.strictEqual(result.adjacencyMatrix[0][3], 1);

               assert.lengthOf(result.adjacencyMatrix[1], 4);
               assert.strictEqual(result.adjacencyMatrix[1][0], 1);
               assert.strictEqual(result.adjacencyMatrix[1][1], 0);
               assert.strictEqual(result.adjacencyMatrix[1][2], 0);
               assert.strictEqual(result.adjacencyMatrix[1][3], 0);

               assert.lengthOf(result.adjacencyMatrix[2], 4);
               assert.strictEqual(result.adjacencyMatrix[2][0], 0);
               assert.strictEqual(result.adjacencyMatrix[2][1], 0);
               assert.strictEqual(result.adjacencyMatrix[2][2], 0);
               assert.strictEqual(result.adjacencyMatrix[2][3], 1);

               assert.lengthOf(result.adjacencyMatrix[3], 4);
               assert.strictEqual(result.adjacencyMatrix[3][0], 0);
               assert.strictEqual(result.adjacencyMatrix[3][1], 0);
               assert.strictEqual(result.adjacencyMatrix[3][2], 1);
               assert.strictEqual(result.adjacencyMatrix[3][3], 0);
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
                  { ast: Parser.parse('"f";'), path: '/a/c/f.js' },
                  { ast: Parser.parse('require("./f");"e";'), path: '/a/c/e.js' },
                  { ast: Parser.parse('"d";'), path: '/a/b/d.js' },
                  { ast: Parser.parse('require("./c/e");"c";'), path: '/a/c.js' },
                  { ast: Parser.parse('require("./b/d");"b";'), path: '/a/b.js' },
                  { ast: Parser.parse('require("./a/b");require("./a/c");"a";'), path: '/a.js' }
               ]);
            });

            teardown(() =>
            {
               result = undefined;
            });

            test('reports are in correct order', () =>
            {
               assert.strictEqual(result.reports[0].path, '/a.js');
               assert.strictEqual(result.reports[1].path, '/a/b.js');
               assert.strictEqual(result.reports[2].path, '/a/c.js');
               assert.strictEqual(result.reports[3].path, '/a/b/d.js');
               assert.strictEqual(result.reports[4].path, '/a/c/e.js');
               assert.strictEqual(result.reports[5].path, '/a/c/f.js');
            });

            test('adjacency matrix is correct', () =>
            {
               assert.lengthOf(result.adjacencyMatrix, 6);

               assert.lengthOf(result.adjacencyMatrix[0], 6);
               assert.strictEqual(result.adjacencyMatrix[0][0], 0);
               assert.strictEqual(result.adjacencyMatrix[0][1], 1);
               assert.strictEqual(result.adjacencyMatrix[0][2], 1);
               assert.strictEqual(result.adjacencyMatrix[0][3], 0);
               assert.strictEqual(result.adjacencyMatrix[0][4], 0);
               assert.strictEqual(result.adjacencyMatrix[0][5], 0);

               assert.lengthOf(result.adjacencyMatrix[1], 6);
               assert.strictEqual(result.adjacencyMatrix[1][0], 0);
               assert.strictEqual(result.adjacencyMatrix[1][1], 0);
               assert.strictEqual(result.adjacencyMatrix[1][2], 0);
               assert.strictEqual(result.adjacencyMatrix[1][3], 1);
               assert.strictEqual(result.adjacencyMatrix[1][4], 0);
               assert.strictEqual(result.adjacencyMatrix[1][5], 0);

               assert.lengthOf(result.adjacencyMatrix[2], 6);
               assert.strictEqual(result.adjacencyMatrix[2][0], 0);
               assert.strictEqual(result.adjacencyMatrix[2][1], 0);
               assert.strictEqual(result.adjacencyMatrix[2][2], 0);
               assert.strictEqual(result.adjacencyMatrix[2][3], 0);
               assert.strictEqual(result.adjacencyMatrix[2][4], 1);
               assert.strictEqual(result.adjacencyMatrix[2][5], 0);

               assert.lengthOf(result.adjacencyMatrix[3], 6);
               assert.strictEqual(result.adjacencyMatrix[3][0], 0);
               assert.strictEqual(result.adjacencyMatrix[3][1], 0);
               assert.strictEqual(result.adjacencyMatrix[3][2], 0);
               assert.strictEqual(result.adjacencyMatrix[3][3], 0);
               assert.strictEqual(result.adjacencyMatrix[3][4], 0);
               assert.strictEqual(result.adjacencyMatrix[3][5], 0);

               assert.lengthOf(result.adjacencyMatrix[4], 6);
               assert.strictEqual(result.adjacencyMatrix[4][0], 0);
               assert.strictEqual(result.adjacencyMatrix[4][1], 0);
               assert.strictEqual(result.adjacencyMatrix[4][2], 0);
               assert.strictEqual(result.adjacencyMatrix[4][3], 0);
               assert.strictEqual(result.adjacencyMatrix[4][4], 0);
               assert.strictEqual(result.adjacencyMatrix[4][5], 1);

               assert.lengthOf(result.adjacencyMatrix[5], 6);
               assert.strictEqual(result.adjacencyMatrix[5][0], 0);
               assert.strictEqual(result.adjacencyMatrix[5][1], 0);
               assert.strictEqual(result.adjacencyMatrix[5][2], 0);
               assert.strictEqual(result.adjacencyMatrix[5][3], 0);
               assert.strictEqual(result.adjacencyMatrix[5][4], 0);
               assert.strictEqual(result.adjacencyMatrix[5][5], 0);
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

         suite('large project calculation performance and accuracy', () =>
         {
            let resultFixture;
            setup(() =>
            {
               resultFixture = require('../fixture/ast_moz');
            });

            test('running calculations should be sufficently fast', function()
            {
               this.timeout(50);
               escomplexProject.processResults(resultFixture);
            });
         });
      });
   });
}

