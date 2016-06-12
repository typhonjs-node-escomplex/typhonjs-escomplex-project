'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typhonjsPluginManager = require('typhonjs-plugin-manager');

var _typhonjsPluginManager2 = _interopRequireDefault(_typhonjsPluginManager);

var _PluginMetricsProject = require('escomplex-plugin-metrics-project/dist/PluginMetricsProject.js');

var _PluginMetricsProject2 = _interopRequireDefault(_PluginMetricsProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provides a wrapper around PluginManager for ESComplexProject. Several convenience methods for the plugin callbacks
 * properly manage and or create initial data that are processed by the plugins.
 *
 * The default plugins loaded include:
 * @see https://www.npmjs.com/package/escomplex-plugin-metrics-project
 */

var Plugins = function () {
   /**
    * Initializes Plugins.
    *
    * @param {object}   options - module options including user plugins to load including:
    * ```
    * (boolean)         loadDefaultPlugins - When false ESComplexProject will not load any default plugins.
    * (Array<Object>)   plugins - A list of ESComplexProject plugins that have already been instantiated.
    * ```
    */

   function Plugins() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Plugins);

      this._pluginManager = new _typhonjsPluginManager2.default();

      if (typeof options.loadDefaultPlugins === 'boolean' && !options.loadDefaultPlugins) {/* nop */} else {
            this._pluginManager.addPlugin(new _PluginMetricsProject2.default());
         }
   }

   /**
    * Initializes the default `settings` object hash and then invokes the `onConfigure` plugin callback for all loaded
    * plugins.
    *
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {object}
    */


   _createClass(Plugins, [{
      key: 'onConfigure',
      value: function onConfigure(options) {
         /**
          * Default settings with potential user override of `skipCalculation`.
          * @type {{skipCalculation: boolean}}
          */
         var settings = {
            skipCalculation: typeof options.skipCalculation === 'boolean' ? options.skipCalculation : false
         };

         var event = this._pluginManager.invoke('onConfigure', { options: options, settings: settings }, true);
         return event !== null ? event.data.settings : settings;
      }

      /**
       * Initializes the default `report` object hash and then invokes the `onProjectStart` plugin callback for all loaded
       * plugins.
       *
       * @param {object}   settings - Settings for project processing.
       */

   }, {
      key: 'onProjectStart',
      value: function onProjectStart(settings) {
         this._pluginManager.invoke('onProjectStart', { settings: settings }, false);
      }

      /**
       * Invokes the `onProjectEnd` plugin callback for all loaded plugins such they might finish calculating results.
       *
       * @param {{reports: Array<{}>}} results -
       *
       * @returns {{reports: Array<{}>}}
       */

   }, {
      key: 'onProjectEnd',
      value: function onProjectEnd(results) {
         var event = this._pluginManager.invoke('onProjectEnd', { results: results }, false);
         return event !== null ? event.data.results : results;
      }
   }]);

   return Plugins;
}();

exports.default = Plugins;
module.exports = exports['default'];