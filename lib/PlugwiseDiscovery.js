'use strict';

const { SimpleClass } = require('homey');
const PlugwiseGatewayBridge = require('./PlugwiseGatewayBridge');
const PlugwiseAnnaBridgeLegacy = require('./PlugwiseAnnaBridgeLegacy');

const fetch = require('node-fetch');
const mdns = require('mdns-js');
mdns.excludeInterface('0.0.0.0');

module.exports = class PlugwiseDiscovery extends SimpleClass {
  
  static get BRIDGES() {
    return [
      PlugwiseGatewayBridge,
      PlugwiseAnnaBridgeLegacy
    ];
  }
  
  constructor() {
    super();
    
    this._bridges = {};
    this._browser = mdns.createBrowser(mdns.tcp('plugwise'));
    this._browser.on('update', this._onBrowserUpdate.bind(this));
    this._browser.on('error', this._onBrowserError.bind(this));
    this._ready = new Promise((resolve, reject) => {
      this._browser.once('ready', resolve);
      this._browser.once('error', reject);
    });
    this._ready.catch(console.error);
  }
  
  get bridges() {
    return this._bridges;
  }
  
  async discover({ timeout = 5000 } = {}) {
    await this._ready;
    this.log('Starting discover');
    this._browser.discover();
    await new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
    this.log('Stopping discover');
    this._browser.stop();
    return this._bridges;
  }
  
  _onBrowserError(err) {
    this.error('mDNS Browser Error:', err);
  }
  
  _onBrowserUpdate(data) {
    const {
      addresses,
      type,
      txt,
      fullname: name,
      host,
    } = data;
        
    if(!txt) return;

    const [
      address,
    ] = addresses;
        
    const {
      product,
      version,
    } = this.constructor.parseTXT(txt);
    
    const PlugwiseBridge = this.constructor.BRIDGES.find(Bridge => {
      return Bridge.PRODUCTS.includes(product);
    });
    if(!PlugwiseBridge) return this.log('Found unsupported bridge', product);
    
    const id = host
      .replace('.local', '')
      .replace('smile', '')
      
    fetch(`http://${address}`).then(res => {
      const server = res.headers.get('server');
      if(!server || !server.toLowerCase().includes('plugwise')) return;
      
      if( this._bridges[id] ) {
        if( this._bridges[id].address !== address ) {
          this.log(`Bridge ${id} changed address from ${this._bridges[id].address} to ${address}`);
          this._bridges[id].address = address;
        }
        
        if( this._bridges[id].version !== version ) {
          this.log(`Bridge ${id} changed version from ${this._bridges[id].version} to ${version}`);
          this._bridges[id].version = version;
        }
      } else {
        const bridge = this._bridges[id] = new PlugwiseBridge({
          id,
          name,
          address,
          version,
          product,
        });
        this.emit(`bridge`, bridge);
        this.emit(`bridge:${id}`, bridge);
      	this.log('Found', bridge.constructor.name, bridge.product, bridge.id, bridge.version, bridge.address);
      }      
    }).catch((err) => {
      this.log('Err: ', err)
    });
  }
  
  static parseTXT(txt) {
    return txt.reduce((result, item) => {
      const [ key, value ] = item.split('=');
      return {
        ...result,
        [key]: value,
      };
     }, {});
  }
  
}