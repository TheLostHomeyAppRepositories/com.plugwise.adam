'use strict';

const PlugwiseThermostatDevice = require('../../lib/PlugwiseThermostatDevice');

module.exports = class PlugwiseAnnaDevice extends PlugwiseThermostatDevice {

    onInit(...props) {
        this.driverId = 'anna';

        super.onInit(...props);
    }

};