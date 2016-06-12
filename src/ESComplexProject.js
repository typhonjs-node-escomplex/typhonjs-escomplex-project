'use strict';

import ESComplexModule  from 'typhonjs-escomplex-module/src/ESComplexModule.js';

import Plugins          from './Plugins.js';

/**
 * Provides a runtime to invoke ESComplexProject plugins for processing / metrics calculations of projects.
 */
export default class ESComplexProject
{
   /**
    * Initializes ESComplexProject.
    *
    * @param {object}   options - module options including user plugins to load including:
    * ```
    * (boolean)         loadDefaultPlugins - When false ESComplexProject will not load any default plugins.
    * (Array<Object>)   plugins - A list of ESComplexProject plugins that have already been instantiated.
    * ```
    */
   constructor(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError('ctor error: `options` is not an `object`.'); }

      this._plugins = new Plugins(options);

      this._escomplexModule = new ESComplexModule(options);
   }

   /**
    * Processes the given modules and calculates project metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {{reports: Array<{}>}}
    */
   analyze(modules, options = {})
   {
      if (!Array.isArray(modules)) { throw new TypeError('analyze error: `modules` is not an `array`.'); }
      if (typeof options !== 'object') { throw new TypeError('analyze error: `options` is not an `object`.'); }

      const settings = this._plugins.onConfigure(options);

      this._plugins.onProjectStart(settings);

      const reports = modules.map((m) =>
      {
         let report;

         if (m.path === '') { throw new Error('analyze error: Invalid path'); }

         try
         {
            report = this._escomplexModule.analyze(m.ast, options);
            report.path = m.path;
            return report;
         }
         catch (error)
         {
            // Include the module path to distinguish the actual offending entry.
            error.message = `${m.path}: ${error.message}`;
            throw error;
         }
      }, []);

      const results = { reports };

      if (settings.skipCalculation) { return results; }

      this._plugins.onProjectEnd(results);

      return results;
   }

   /**
    * Processes existing project results and calculates metrics via plugins.
    *
    * @param {object}   results - An object hash with a `reports` entry that is an Array of module results.
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {{reports: Array<{}>}}
    */
   processResults(results, options = {})
   {
      if (typeof results !== 'object') { throw new TypeError('processResults error: `results` is not an `object`.'); }
      if (typeof options !== 'object') { throw new TypeError('processResults error: `options` is not an `object`.'); }

      const settings = this._plugins.onConfigure(options);

      this._plugins.onProjectStart(settings);
      this._plugins.onProjectEnd(results);

      return results;
   }

   // Asynchronous Promise based methods ----------------------------------------------------------------------------

   /**
    * Wraps in a Promise processing the given modules and calculates metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - project processing options
    *
    * @returns {Promise<{reports: Array<{}>}>}
    */
   analyzeThen(modules, options = {})
   {
      return new Promise((resolve, reject) =>
      {
         try { resolve(this.analyze(modules, options)); }
         catch (err) { reject(err); }
      });
   }

   /**
    * Wraps in a Promise processing of existing project results and calculates metrics via plugins.
    *
    * @param {object}   results - An object hash with a `reports` entry that is an Array of module results.
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {Promise<{reports: Array<{}>}>}
    */
   processResultsThen(results, options = {})
   {
      return new Promise((resolve, reject) =>
      {
         try { resolve(this.processResults(results, options)); }
         catch (err) { reject(err); }
      });
   }
}
