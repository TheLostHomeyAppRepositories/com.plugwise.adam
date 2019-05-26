'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwiseAnnaDriver extends PlugwiseDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_thermo', 'smile-thermo' ];
	}

	onPairFilterAppliance({ appliance }) {
		return (appliance.type === 'thermostat');
	}

};