'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwiseGatewayDriver extends PlugwiseDriver {

    onPairFilterAppliance({ appliance }) {
        return (appliance.type === 'heater_central');
    }

    onPairCapabilityFilter({ appliance }) {

        const capabilityFromLogMap = {
            "central_heating_state": "boiler_state",
            "domestic_hot_water_state": "DHW_state",
            "domestic_hot_water_comfort_mode": "DHW_mode",
            "intended_boiler_temperature": "measure_temperature.intended",
            "boiler_temperature": "measure_temperature.boiler",
            "return_water_temperature": "measure_temperature.return",
            "outdoor_temperature": "measure_temperature.outdoor",
            "modulation_level": "modulation_level",
            "central_heater_water_pressure": "measure_pressure",
            "open_therm_application_specific_fault_code": "boiler_status_code",
            "open_therm_oem_fault_code": "boiler_error_code"
        };

        let capabilities = [];

        if (appliance && appliance.logs
            && Array.isArray(appliance.logs.point_log)) {
            appliance.logs.point_log.forEach(log => {
                if (capabilityFromLogMap[log.type] && log.period && log.period.measurement) {
                    capabilities.splice(Object.keys(capabilityFromLogMap).indexOf(log.type), 0, capabilityFromLogMap[log.type]);
                }
            })
        }

        return capabilities;
    }

};