'use strict';

import ESComplexModule  from 'typhonjs-escomplex-module/src/ESComplexModule.js';

import Plugins          from './Plugins.js';

export default class ESComplexProject
{
   /**
    * Initializes ESComplexProject
    *
    * @param {object}   options - module options
    */
   constructor(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError('ctor error: `options` is not an `object`.'); }

      this._plugins = new Plugins(options);

      this._moduleAnalyser = new ESComplexModule(options);
   }

   /**
    * Processes the given modules and calculates metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - project processing options
    *
    * @returns {Promise}
    */
   analyze(modules, options = {})
   {
      if (!Array.isArray(modules)) { throw new TypeError('Invalid modules'); }
      if (typeof options !== 'object') { throw new TypeError('analyze error: `options` is not an `object`.'); }

      const settings = this._plugins.onConfigure(options);

      this._plugins.onProjectStart(settings);

      const reports = modules.map((m) =>
      {
         let report;

         if (m.path === '') { throw new Error('Invalid path'); }

         try
         {
            report = this._moduleAnalyser.analyze(m.ast, options);
            report.path = m.path;
            return report;
         }
         catch (error)
         {
            // These error messages are useless unless they contain the module path.
            error.message = `${m.path}: ${error.message}`;
            throw error;
         }
      }, []);

      const results = { reports };

      if (options.skipCalculation) { return results; }

      this._plugins.onProjectEnd(results);

      return results;
   }

   /**
    * Wraps in a Promise processing the given modules and calculates metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - project processing options
    *
    * @returns {Promise}
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
    * Processes the an existing project report and calculates metrics via plugins.
    *
    * @param {object}   reports - An object hash with a `reports` entry that is an Array of module results.
    * @param {object}   options - project processing options
    *
    * @returns {Promise}
    */
   processResults(reports, options = {})
   {
      if (typeof reports !== 'object') { throw new TypeError('Invalid reports'); }
      if (typeof options !== 'object') { throw new TypeError('processResults error: `options` is not an `object`.'); }

      const settings = this._plugins.onConfigure(options);

      this._plugins.onProjectStart(settings);
      this._plugins.onProjectEnd(reports);

      return reports;
   }

   /**
    * Wraps in a Promise processing an existing project report and calculates metrics via plugins.
    *
    * @param {object}   reports - An object hash with a `reports` entry that is an Array of module results.
    * @param {object}   options - project processing options
    *
    * @returns {Promise}
    */
   processResultsThen(reports, options = {})
   {
      return new Promise((resolve, reject) =>
      {
         try { resolve(this.processResults(reports, options)); }
         catch (err) { reject(err); }
      });
   }
}
