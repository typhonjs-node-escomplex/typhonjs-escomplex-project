'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ESComplexModule = require('typhonjs-escomplex-module/dist/ESComplexModule.js');

var _ESComplexModule2 = _interopRequireDefault(_ESComplexModule);

var _Plugins = require('./Plugins.js');

var _Plugins2 = _interopRequireDefault(_Plugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ESComplexProject = function () {
   /**
    * Initializes ESComplexProject
    *
    * @param {object}   options - module options
    */

   function ESComplexProject() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, ESComplexProject);

      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
         throw new TypeError('ctor error: `options` is not an `object`.');
      }

      this._plugins = new _Plugins2.default(options);

      this._moduleAnalyser = new _ESComplexModule2.default(options);
   }

   /**
    * Processes the given modules and calculates metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - project processing options
    *
    * @returns {Promise}
    */


   _createClass(ESComplexProject, [{
      key: 'analyze',
      value: function analyze(modules) {
         var _this = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         if (!Array.isArray(modules)) {
            throw new TypeError('Invalid modules');
         }
         if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            throw new TypeError('analyze error: `options` is not an `object`.');
         }

         var settings = this._plugins.onConfigure(options);

         this._plugins.onProjectStart(settings);

         var reports = modules.map(function (m) {
            var report = void 0;

            if (m.path === '') {
               throw new Error('Invalid path');
            }

            try {
               report = _this._moduleAnalyser.analyze(m.ast, options);
               report.path = m.path;
               return report;
            } catch (error) {
               // These error messages are useless unless they contain the module path.
               error.message = m.path + ': ' + error.message;
               throw error;
            }
         }, []);

         var results = { reports: reports };

         if (options.skipCalculation) {
            return results;
         }

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

   }, {
      key: 'analyzeThen',
      value: function analyzeThen(modules) {
         var _this2 = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         return new Promise(function (resolve, reject) {
            try {
               resolve(_this2.analyze(modules, options));
            } catch (err) {
               reject(err);
            }
         });
      }

      /**
       * Processes the an existing project report and calculates metrics via plugins.
       *
       * @param {Array}    reports - An object hash with a `reports` entry that is an Array of module results.
       * @param {object}   options - project processing options
       *
       * @returns {Promise}
       */

   }, {
      key: 'processResults',
      value: function processResults(reports) {
         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         if ((typeof reports === 'undefined' ? 'undefined' : _typeof(reports)) !== 'object') {
            throw new TypeError('Invalid reports');
         }
         if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            throw new TypeError('processResults error: `options` is not an `object`.');
         }

         var settings = this._plugins.onConfigure(options);

         this._plugins.onProjectStart(settings);
         this._plugins.onProjectEnd(reports);

         return reports;
      }

      /**
       * Wraps in a Promise processing an existing project report and calculates metrics via plugins.
       *
       * @param {Array}    reports - An object hash with a `reports` entry that is an Array of module results.
       * @param {object}   options - project processing options
       *
       * @returns {Promise}
       */

   }, {
      key: 'processResultsThen',
      value: function processResultsThen(reports) {
         var _this3 = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         return new Promise(function (resolve, reject) {
            try {
               resolve(_this3.processResults(reports, options));
            } catch (err) {
               reject(err);
            }
         });
      }
   }]);

   return ESComplexProject;
}();

exports.default = ESComplexProject;
module.exports = exports['default'];