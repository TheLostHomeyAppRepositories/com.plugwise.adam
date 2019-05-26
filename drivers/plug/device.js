'use strict';

const Homey = require('homey');
const PlugwiseDevice = require('../../lib/PlugwiseDevice');

module.exports = class PlugwisePlugDevice extends PlugwiseDevice {

  onInit(...props) {
    this.driverId = 'plug';

    super.onInit(...props);
    
    this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
  }
  
  onPoll({ appliance }) {
    //console.log(JSON.stringify(appliance, false, 2));
    
    if( appliance.actuator_functionalities
     && appliance.actuator_functionalities.relay_functionality ) {
      const { state } = appliance.actuator_functionalities.relay_functionality;
      this.setCapabilityValue('onoff', state === 'on').catch(this.error);
    }
    
    if( appliance.logs
     && Array.isArray(appliance.logs.point_log) ) {
       appliance.logs.point_log.forEach(log => {
         if( log.type === 'electricity_consumed'
          && log.unit === 'W'
          && log.period
          && log.period.measurement ) {
           const value = parseFloat(log.period.measurement.$text);
           this.setCapabilityValue('measure_power', value).catch(this.error);
         }
       });
    }
    
    if( appliance.logs
     && Array.isArray(appliance.logs.interval_log) ) {
       appliance.logs.interval_log.forEach(log => {         
         if( log.type === 'electricity_consumed'
          && log.unit === 'Wh'
          && log.period
          && log.period.measurement ) {
           const value = parseFloat(log.period.measurement.$text) / 1000;
           this.setCapabilityValue('meter_power', value).catch(this.error);           
         }
       });
    }
  }
  
  async onCapabilityOnoff(value) {
    return this.bridge.setRelay({
      applianceId: this.applianceId,
      on: !!value,
    });
  }
	
};