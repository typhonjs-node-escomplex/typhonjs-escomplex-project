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

var Plugins = function () {
   function Plugins() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Plugins);

      this._pluginManager = new _typhonjsPluginManager2.default();

      if (typeof options.loadDefaultPlugins === 'boolean' && !options.loadDefaultPlugins) {/* nop */} else {
            this._pluginManager.addPlugin(new _PluginMetricsProject2.default());
         }
   }

   _createClass(Plugins, [{
      key: 'onConfigure',
      value: function onConfigure(options) {
         var settings = {
            skipCalculation: typeof options.skipCalculation === 'boolean' ? options.skipCalculation : false
         };

         var event = this._pluginManager.invoke('onConfigure', { options: options, settings: settings }, true);
         return event !== null ? event.data.settings : settings;
      }
   }, {
      key: 'onProjectStart',
      value: function onProjectStart(settings) {
         var report = {};
         this._pluginManager.invoke('onProjectStart', { settings: settings }, false);
         return report;
      }
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