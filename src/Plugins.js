'use strict';

import PluginManager          from 'typhonjs-plugin-manager';

import PluginMetricsProject   from 'escomplex-plugin-metrics-project/src/PluginMetricsProject.js';

export default class Plugins
{
   constructor(options = {})
   {
      this._pluginManager = new PluginManager();

      if (typeof options.loadDefaultPlugins === 'boolean' && !options.loadDefaultPlugins) { /* nop */ }
      else
      {
         this._pluginManager.addPlugin(new PluginMetricsProject());
      }
   }

   onConfigure(options)
   {
      const settings =
      {
         skipCalculation: typeof options.skipCalculation === 'boolean' ? options.skipCalculation : false
      };

      const event = this._pluginManager.invoke('onConfigure', { options, settings }, true);
      return event !== null ? event.data.settings : settings;
   }

   onProjectStart(settings)
   {
      const report = {};
      this._pluginManager.invoke('onProjectStart', { settings }, false);
      return report;
   }

   onProjectEnd(results)
   {
      const event = this._pluginManager.invoke('onProjectEnd', { results }, false);
      return event !== null ? event.data.results : results;
   }
}
