/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1571477099731_2055';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.redis = {
    host: '127.0.0.1',
    port: 6379,
    options: {},
  };

  config.ticket = {
    local: {
      total: 150, //总数150
      count: 0,
    },
    remote: {
      total: 10000, //总数150
    }

  }

  return {
    ...config,
    ...userConfig,
  };
};
