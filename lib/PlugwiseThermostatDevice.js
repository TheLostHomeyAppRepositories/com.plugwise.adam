'use strict';

const Homey = require('homey');
const PlugwiseDevice = require('./PlugwiseDevice');

module.exports = class PlugwiseThermostatDevice extends PlugwiseDevice {

    onInit(...props) {
        super.onInit(...props);

        this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemperature.bind(this));
        this.registerCapabilityListener('location_preset', this.onCapabilityLocationPreset.bind(this));

        this._setLocationPresetAction = new Homey.FlowCardAction(`${this.driverId}:location_preset:set`).register()
            .registerRunListener(this._setLocationPresetRunListener.bind(this));

        this._locationPresetChangedTrigger = new Homey.FlowCardTriggerDevice(`${this.driverId}:location_preset:changed`).register();
    }

    async _setLocationPresetRunListener({ preset }) {
        return this.onCapabilityLocationPreset(preset)
    }

    async onCapabilityLocationPreset(preset) {
        const { applianceId } = this;

        return this.bridge.setPreset({
            applianceId,
            preset
        });
    }

    async onCapabilityTargetTemperature(value) {
        const { applianceId } = this;

        return this.bridge.setTargetTemperature({
            applianceId,
            setpoint: value,
        });
    }

    onPoll({appliance}) {
        if (appliance) {
            //target_temperature
            if (appliance.actuator_functionalities
                && appliance.actuator_functionalities.thermostat_functionality) {
                const {setpoint} = appliance.actuator_functionalities.thermostat_functionality;
                const value = parseFloat(setpoint);
                this.setCapabilityValue('target_temperature', value).catch(this.error);
            }

            if (appliance.logs
                && Array.isArray(appliance.logs.point_log)) {
                appliance.logs.point_log.forEach(log => {
                    //measure_temperature
                    if (log.type === 'temperature'
                        && log.unit === 'C'
                        && log.period
                        && log.period.measurement) {
                        const value = parseFloat(log.period.measurement.$text);
                        this.setCapabilityValue('measure_temperature', value).catch(this.error);
                    }

                    //location_preset
                    if (this.hasCapability('location_preset')
                        && log.type === 'preset_state'
                        && log.period
                        && log.period.measurement) {
                        const value = log.period.measurement.$text;
                        const preset = value && value !== 'none' ? value : null;
                        if (this.getCapabilityValue('location_preset') !== preset) {
                            this.setCapabilityValue('location_preset', preset).catch(this.error);

                            if (this._locationPresetChangedTrigger)
                                this._locationPresetChangedTrigger
                                    .trigger(this, { preset })
                                    .catch(this.error);

                        }
                    }

                    //measure_luminance
                    if (this.hasCapability('measure_luminance')
                        && log.type === 'illuminance'
                        && log.unit === 'lx'
                        && log.period
                        && log.period.measurement) {
                        const value = parseFloat(log.period.measurement.$text);
                        if (this.getCapabilityValue('measure_luminance') !== value) {
                            this.setCapabilityValue('measure_luminance', value).catch(this.error);
                        }
                    }

                    // alarm_motion (lazy alarm_proximity)
                    if (this.hasCapability('alarm_motion')
                        && log.type === 'proximity_detection'
                        && log.unit === ''
                        && log.period
                        && log.period.measurement) {

                        let curValue = this.getCapabilityValue('alarm_motion');
                        let newValue = (!curValue && Date.parse(log.period.measurement.$attr.log_date) > (Date.now() - 30000));

                        if (curValue !== newValue) {
                            this.setCapabilityValue('alarm_motion', newValue).catch(this.error);
                        }
                    }
                });
            }
        }
    }

};