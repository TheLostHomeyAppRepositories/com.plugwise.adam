'use strict';

const PlugwiseGatewayDevice = require('../../lib/PlugwiseGatewayDevice');

module.exports = class PlugwiseSmileDevice extends PlugwiseGatewayDevice {

    onInit(...props) {
        this.driverId = 'smile';

        super.onInit(...props);
    }

};
