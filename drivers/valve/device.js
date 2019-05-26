'use strict';

const PlugwiseThermostatDevice = require('../../lib/PlugwiseThermostatDevice');

module.exports = class PlugwiseValveDevice extends PlugwiseThermostatDevice {

    onInit(...props) {
        this.driverId = 'valve';

        super.onInit(...props);
    }

    onPoll({ appliance }) {
        super.onPoll({ appliance });

        if( appliance.logs
         && Array.isArray(appliance.logs.point_log) ) {
           appliance.logs.point_log.forEach(log => {

                if (log.type === 'valve_position'
                    && log.period
                    && log.period.measurement
                ) {
                    const value = parseFloat(log.period.measurement.$text) * 100;
                    this.setCapabilityValue('valve_position', value).catch(this.error);
                }

                if (log.type === 'battery'
                    && log.period
                    && log.period.measurement
                ) {
                    const value = parseFloat(log.period.measurement.$text) * 100;
                    this.setCapabilityValue('measure_battery', value).catch(this.error);
                }

           });
        }
	}
};