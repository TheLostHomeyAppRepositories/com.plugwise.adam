'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwisePlugDriver extends PlugwiseDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_open_therm' ];
	}

	onPairFilterAppliance({ appliance }) {
		return (appliance.type === 'zz_misc' || appliance.type === 'central_heating_pump');
	}
	
};