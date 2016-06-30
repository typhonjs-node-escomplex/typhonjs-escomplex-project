'use strict';

import PluginManager          from 'typhonjs-plugin-manager/src/PluginManager';

import PluginMetricsProject   from 'escomplex-plugin-metrics-project/src/PluginMetricsProject';

/**
 * Provides a wrapper around PluginManager for ESComplexProject. Several convenience methods for the plugin callbacks
 * properly manage and or create initial data that are processed by the plugins.
 *
 * The default plugins loaded include:
 * @see https://www.npmjs.com/package/escomplex-plugin-metrics-project
 */
export default class Plugins
{
   /**
    * Initializes Plugins.
    *
    * @param {object}   options - module options including user plugins to load including:
    * ```
    * (boolean)         loadDefaultPlugins - When false ESComplexProject will not load any default plugins.
    * (Array<Object>)   plugins - A list of ESComplexProject plugins that have already been instantiated.
    * ```
    */
   constructor(options = {})
   {
      this._pluginManager = new PluginManager();

      if (typeof options.loadDefaultPlugins === 'boolean' && !options.loadDefaultPlugins) { /* nop */ }
      else
      {
         this._pluginManager.addPlugin(new PluginMetricsProject());
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
   onConfigure(options)
   {
      /**
       * Default settings with potential user override of `skipCalculation`.
       * @type {{skipCalculation: boolean}}
       */
      const settings =
      {
         skipCalculation: typeof options.skipCalculation === 'boolean' ? options.skipCalculation : false
      };

      const event = this._pluginManager.invoke('onConfigure', { options, settings }, true);
      return event !== null ? event.data.settings : settings;
   }

   /**
    * Initializes the default `report` object hash and then invokes the `onProjectStart` plugin callback for all loaded
    * plugins.
    *
    * @param {object}   settings - Settings for project processing.
    */
   onProjectStart(settings)
   {
      this._pluginManager.invoke('onProjectStart', { settings }, false);
   }

   /**
    * Invokes the `onProjectEnd` plugin callback for all loaded plugins such they might finish calculating results.
    *
    * @param {{reports: Array<{}>}} results -
    *
    * @returns {{reports: Array<{}>}}
    */
   onProjectEnd(results)
   {
      const event = this._pluginManager.invoke('onProjectEnd', { results }, false);
      return event !== null ? event.data.results : results;
   }
}
