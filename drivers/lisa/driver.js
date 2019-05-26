'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwiseLisaDriver extends PlugwiseDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_open_therm' ];
	}

	onPairFilterAppliance({ appliance }) {
		return (appliance.type === 'zone_thermostat');
	}
};