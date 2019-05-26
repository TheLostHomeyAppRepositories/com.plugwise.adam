'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwiseSmileDriver extends PlugwiseDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_thermo' ];
	}

	onPairFilterAppliance({ appliance }) {
		return (appliance.type === 'heater_central');
	}

};