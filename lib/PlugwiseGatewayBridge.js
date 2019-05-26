'use strict';

const PlugwiseBridge = require('./PlugwiseBridge');

module.exports = class PlugwiseGatewayBridge extends PlugwiseBridge {

  static get PRODUCTS() {
    return [ 'smile_open_therm', 'smile_thermo' ];
  }

};