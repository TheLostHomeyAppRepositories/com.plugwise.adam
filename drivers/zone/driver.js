'use strict';

const PlugwiseDriver = require('../../lib/PlugwiseDriver');

module.exports = class PlugwiseZoneDriver extends PlugwiseDriver {

    static get BRIDGE_PRODUCTS() {
        return [ 'smile_open_therm' ];
    }

	async onPairListDevices({ bridge }) {
        const locations = await bridge.getLocations();

        return locations.filter(location => {
            return location.type !== 'building'; // Home
        }).map(location => {
            return {
                name: location.name,
                data: {
                    bridgeId: bridge.id,
                    locationId: location.$attr.id
                },
                store: {
                    password: bridge.password
                }
            }
        });
	}

};