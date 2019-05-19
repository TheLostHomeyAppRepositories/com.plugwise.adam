'use strict';

const Homey = require('homey');
const PlugwiseAnnaDriver = require('../../lib/PlugwiseAnnaDriver');

module.exports = class PlugwiseAnnaSmileDriver extends PlugwiseAnnaDriver {

	onPairFilterAppliance({ appliance }) {
        if( appliance.type === 'heater_central' ) return true;
		return false;
	}

};