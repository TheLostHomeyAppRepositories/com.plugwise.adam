'use strict';

const PlugwiseGatewayDevice = require('../../lib/PlugwiseGatewayDevice');

module.exports = class PlugwiseAdamDevice extends PlugwiseGatewayDevice {

    onInit(...props) {
        this.driverId = 'adam';

        super.onInit(...props);
    }

};