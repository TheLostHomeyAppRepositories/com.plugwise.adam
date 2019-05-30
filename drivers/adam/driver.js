'use strict';

const PlugwiseGatewayDriver = require('../../lib/PlugwiseGatewayDriver');

module.exports = class PlugwiseAdamDriver extends PlugwiseGatewayDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_open_therm' ];
	}

};