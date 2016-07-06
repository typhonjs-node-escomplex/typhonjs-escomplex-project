import ESComplexModule  from 'typhonjs-escomplex-module/src/ESComplexModule';

import ModuleReport     from 'typhonjs-escomplex-commons/src/module/report/ModuleReport';
import ProjectResult    from 'typhonjs-escomplex-commons/src/project/result/ProjectResult';

import Plugins          from './Plugins';

/**
 * Provides a runtime to invoke ESComplexProject plugins for processing / metrics calculations of projects.
 */
export default class ESComplexProject
{
   /**
    * Initializes ESComplexProject.
    *
    * @param {object}   pathModule - Provides an object which matches the Node path module. In particular the following
    *                                entries must be provided:
    * ```
    * (string)    sep - Provides the platform-specific path segment separator: `/` on POSIX & `\` on Windows.
    *
    * (function)  dirname - Returns the directory name of a path, similar to the Unix dirname command.
    *
    * (function)  extname - Returns the extension of the path, from the last occurance of the . (period) character to
    *                       end of string in the last portion of the path.
    *
    * (function)  relative - Returns the relative path from from to to.
    *
    * (function)  resolve - Resolves a sequence of paths or path segments into an absolute path.
    * ```
    *
    * @param {object}   options - module and project options including user plugins to load including:
    * ```
    * (object)             module - Provides an object hash of the following options for the module runtime:
    *    (boolean)         loadDefaultPlugins - When false ESComplexModule will not load any default plugins.
    *    (Array<Object>)   plugins - A list of ESComplexModule plugins that have already been instantiated.
    *
    * (object)             project - Provides an object hash of the following options for the project runtime:
    *    (boolean)         loadDefaultPlugins - When false ESComplexProject will not load any default plugins.
    *    (Array<Object>)   plugins - A list of ESComplexProject plugins that have already been instantiated.
    * ```
    *
    * @see https://nodejs.org/api/path.html
    */
   constructor(pathModule, options = {})
   {
      // Verify essential Node path module API.
      /* istanbul ignore if */
      if (typeof pathModule !== 'object') { throw new TypeError('ctor error: `pathModule` is not an `object`.'); }

      /* istanbul ignore if */
      if (typeof pathModule.sep !== 'string')
      {
         throw new TypeError('ctor error: `pathModule.sep` is not a `string`.');
      }

      /* istanbul ignore if */
      if (typeof pathModule.dirname !== 'function')
      {
         throw new TypeError('ctor error: `pathModule.dirname` is not a `function`.');
      }

      /* istanbul ignore if */
      if (typeof pathModule.extname !== 'function')
      {
         throw new TypeError('ctor error: `pathModule.extname` is not a `function`.');
      }

      /* istanbul ignore if */
      if (typeof pathModule.relative !== 'function')
      {
         throw new TypeError('ctor error: `pathModule.relative` is not a `function`.');
      }

      /* istanbul ignore if */
      if (typeof pathModule.resolve !== 'function')
      {
         throw new TypeError('ctor error: `pathModule.resolve` is not a `function`.');
      }

      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError('ctor error: `options` is not an `object`.'); }

      this._pathModule = pathModule;

      this._plugins = new Plugins(options.project);

      this._escomplexModule = new ESComplexModule(options.module);
   }

   /**
    * Processes the given modules and calculates project metrics via plugins.
    *
    * @param {Array<object>}  modules - Array of object hashes containing `ast` and `srcPath` entries. Optionally
    *                                   `srcPathAlias` and `filePath` entries may also be provided.
    *
    * @param {object}         options - (Optional) project processing options.
    *
    * @returns {ProjectResult}
    */
   analyze(modules, options = {})
   {
      if (!Array.isArray(modules)) { throw new TypeError('analyze error: `modules` is not an `array`.'); }

      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError('analyze error: `options` is not an `object`.'); }

      const settings = this._plugins.onConfigure(options);

      this._plugins.onProjectStart(this._pathModule, settings);

      const reports = modules.map((m) =>
      {
         let report;

         if (typeof m.srcPath !== 'string' || m.srcPath === '') { throw new Error('analyze error: Invalid `srcPath`'); }

         try
         {
            report = this._escomplexModule.analyze(m.ast, options);

            // Set any supplied filePath / srcPath / srcPathAlias data.
            report.filePath = m.filePath;
            report.srcPath = m.srcPath;
            report.srcPathAlias = m.srcPathAlias;

            return report;
         }
         catch (error)
         {
            // Include the module srcPath to distinguish the actual offending entry.

            /* istanbul ignore next */
            error.message = `${m.srcPath}: ${error.message}`;

            /* istanbul ignore next */
            throw error;
         }
      }, []);

      const results = new ProjectResult(reports, settings);

      if (settings.skipCalculation) { return results; }

      this._plugins.onProjectEnd(this._pathModule, results);

      return results.finalize();
   }

   /**
    * Processes existing project results and calculates metrics via plugins.
    *
    * @param {ProjectResult}  results - An instance of ProjectResult with a `reports` entry that is an Array of
    *                                   ModuleReports.
    *
    * @param {object}         options - (Optional) project processing options.
    *
    * @returns {ProjectResult}
    */
   processResults(results, options = {})
   {
      /* istanbul ignore if */
      if (!(results instanceof ProjectResult))
      {
         throw new TypeError('processResults error: `results` is not an instance of ProjectResult.');
      }

      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError('processResults error: `options` is not an `object`.'); }

      /* istanbul ignore if */
      if (results.reports.length > 0 && !(results.reports[0] instanceof ModuleReport))
      {
         throw new TypeError(
          'processResults error: `results.reports` does not appear to contain `ModuleReport` entries.');
      }

      const settings = this._plugins.onConfigure(options);

      // Override any stored settings given new options / settings set during processing reports.
      results.settings = settings;

      this._plugins.onProjectStart(this._pathModule, settings);
      this._plugins.onProjectEnd(this._pathModule, results);

      return results.finalize();
   }

   // Asynchronous Promise based methods ----------------------------------------------------------------------------

   /**
    * Wraps in a Promise processing the given modules and calculates metrics via plugins.
    *
    * @param {Array<object>}  modules - Array of object hashes containing `ast` and `srcPath` entries. Optionally
    *                                   `srcPathAlias` and `filePath` entries may also be provided.
    *
    * @param {object}         options - project processing options
    *
    * @returns {Promise<ProjectResult>}
    */
   analyzeAsync(modules, options = {})
   {
      return new Promise((resolve, reject) =>
      {
         try { resolve(this.analyze(modules, options)); }
         catch (err) { /* istanbul ignore next */ reject(err); }
      });
   }

   /**
    * Wraps in a Promise processing of existing project results and calculates metrics via plugins.
    *
    * @param {object}   results - An object hash with a `reports` entry that is an Array of module results.
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {Promise<ProjectResult>}
    */
   processResultsAsync(results, options = {})
   {
      return new Promise((resolve, reject) =>
      {
         try { resolve(this.processResults(results, options)); }
         catch (err) { /* istanbul ignore next */ reject(err); }
      });
   }
}
