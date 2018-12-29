'use strict'
const path = require('path');
const os = require('os');
const fse = require('fs-extra')

module.exports = {
    loadConfig: function() {
        let sysConfig = {};
        if (fse.existsSync(os.homedir()+"/.dmscli.json")) {
            sysConfig = require(os.homedir()+"/.dmscli.json");
        }
        let proConfig = {};
        if (fse.existsSync(path.resolve(".")+"/dmscli.json")) {
            proConfig = require(path.resolve(".")+"/dmscli.json");
        }
        let config = Object.assign(sysConfig, proConfig);
        return config;
    }
}