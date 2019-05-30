'use strict';

const PlugwiseGatewayDriver = require('../../lib/PlugwiseGatewayDriver');

module.exports = class PlugwiseSmileDriver extends PlugwiseGatewayDriver {

	static get BRIDGE_PRODUCTS() {
		return [ 'smile_thermo' ];
	}

};