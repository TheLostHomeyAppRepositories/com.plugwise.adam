'use strict';

const Homey = require('homey');
const PlugwiseDiscovery = require('./PlugwiseDiscovery');

const DISCOVER_INTERVAL = 1000 * 65; // discover for updates every 65 seconds

module.exports = class PlugwiseApp extends Homey.App {
	
	onInit() {
		this.discovery = new PlugwiseDiscovery();
		this.discovery.on('__log', (...args) => this.log('[PlugwiseDiscovery]', ...args));
		this.discovery.on('__error', (...args) => this.error('[PlugwiseDiscovery]', ...args));

		this.discover = this.discover.bind(this);
		this.discover(30000);

		if (this.discoverInterval) clearInterval(this.discoverInterval);
		this.discoverInterval = setInterval(this.discover, DISCOVER_INTERVAL);
	}
	
	discover(timeout) {
		this.discovery.discover({
			timeout: timeout || 10000,
		}).catch(this.error);
	}
	
	getBridges() {
		return this.discovery.bridges;
	}
	
	async getBridge({ bridgeId }) {
		if (this.discovery.bridges[bridgeId]) {
			return this.discovery.bridges[bridgeId];
		}

		return new Promise(resolve => {
			this.discovery.once(`bridge:${bridgeId}`, resolve);
		});
	}
	
};