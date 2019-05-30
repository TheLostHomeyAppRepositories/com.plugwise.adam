'use strict';

const Homey = require('homey');

module.exports = class PlugwiseDriver extends Homey.Driver {
  
	static get BRIDGE_PRODUCTS() {
		return [];
	}
	
	onPair( socket ) {
  	
		let bridge;
		let bridges;
		let password;

		const onListDevices = ( data, callback ) => {
			if( bridge ) return onListDevicesDevices( data, callback );
			return onListDevicesBridges( data, callback );
		};

		const onListDevicesBridges = ( data, callback ) => {
			bridges = Homey.app.getBridges();
			const devices = Object.values(bridges).filter(bridge => {
				return this.constructor.BRIDGE_PRODUCTS.includes(bridge.product);
			}).map(bridge => {
				return {
					name: bridge.name,
					data: {
						id: bridge.id,
					}
				}
			});
			callback(null, devices);
		};

		const onListDevicesDevices = ( data, callback ) => {
			if(!bridge)
			  return callback( new Error('Missing Bridge') );

		  this.onPairListDevices({ bridge })
			.then(devices => {
			  callback( null, devices );
			}).catch(callback);
		};

		const onListBridgesSelection = ( data, callback ) => {
			callback();

			const [ device ] = data;
			const { id } = device.data;

			bridge = bridges[id];
		};

		const onPincode = ( pincode, callback ) => {
			if(!bridge)
			  return callback( new Error('Missing Bridge') );

		  password = pincode.join('');

		  bridge.testPassword({ password })
			.then(result => {
			  if( result === true )
				bridge.password = password;

			  callback( null, result );
			}).catch(callback);
		};

		const onShowView = ( viewId, callback ) => {
			callback();

			if( viewId === 'loading' ) {
			if( bridge && bridge.password ) {
			  socket.showView('list_devices');
			} else {
			  socket.showView('pincode');
			}
		  }
		};

		socket.on('showView', onShowView);
		socket.on('list_devices', onListDevices);
		socket.on('list_bridges_selection', onListBridgesSelection);
		socket.on('pincode', onPincode);


    }
	
	async onPairListDevices({ bridge }) {
		const appliances = await bridge.getAppliances();

		return appliances.filter(appliance => {
			return this.onPairFilterAppliance({ appliance });
		}).map(appliance => {

			const device = {
				name: appliance.name,
				data: {
				  bridgeId: bridge.id,
				  applianceId: appliance.$attr.id,
				},
				store: {
				  password: bridge.password,
				}
			};

            if (typeof this.onPairCapabilityFilter === "function") {
                device.capabilities = this.onPairCapabilityFilter({ appliance });
            }

			return device;
		});
	}
	
	onPairFilterAppliance({ appliance }) {
		return false;
	}
	
};