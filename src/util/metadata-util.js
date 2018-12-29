'use strict'

const configUtil = require('./config-util');
const fs = require('fs');
const path = require('path');
const select = require("xpath.js");
const dom = require("xmldom").DOMParser;

module.exports = {
    getMetadataById: function(id) {
        let config = configUtil.loadConfig();
        let metadataPaths = config['metadata-path'];
        if (!metadataPaths || metadataPaths.length === 0) {
            console.error('未找到metadata-path配置！');
            return undefined;
        }
        for (let metadatapath of metadataPaths) {
            let files = fs.readdirSync(metadatapath);
            for (let file of files) {
                let metadatafile = path.resolve(metadatapath, file);
                let extname = path.extname(metadatafile);
                if (extname !== '.meta') {
                    continue;
                }
                let xmlstr = fs.readFileSync(metadatapath + '/' + file, "utf-8").toString();
                let doc = new dom().parseFromString(xmlstr);
                let entities = select(doc, '/metas/entity');
                for (let entity of entities) {
                    if (entity.getAttribute("id") === id) {
                        let props = [];
                        let indexs = []; 
                        let propertyNodes = entity.getElementsByTagName('property');
                        for (let i = 0; i < propertyNodes.length; i++) {
                            let property = propertyNodes[i];
                            let id = property.getAttribute("id");
                            let name = property.getAttribute("name");
                            let define = property.getAttribute("define");
                            let type = property.getAttribute("type");
                            let tsType = getTsType(type);
                            let inherit = false;
                            if (id === 'createby' || id === 'createtime' || id === 'updateby' || id === 'updatetime' || id === 'deleteflag' 
                            || id === 'parent' || id === 'children' || id === 'sort') {
                                inherit = true;
                            }
                            props.push({ id, name, define, tsType, inherit });
                        }
                        let indexNodes = entity.getElementsByTagName('index');
                        let pk = '';
                        for (let i = 0; i < indexNodes.length; i++) {
                            let index = indexNodes[i];
                            let id = index.getAttribute("id");
                            let type = index.getAttribute("type");
                            if (type === '0') {
                                pk =  id;
                            }
                            indexs.push({ id, type });
                        }
                        return { id, property: props, index: indexs, pk};
                    }
                }
            }
        }
        return undefined;
    }
}

// function defineToType(define) {
//     if (define === 'varchar' || define === 'char' || define === 'text' || define === 'longtext') {
//         return 'string';
//     } else if (define === 'int' || define === 'number' || define === 'integer' || define === 'short' || define === 'decimal' || define === 'tiny') {
//         return 'number';
//     } else if (define === 'boolean' || define === 'bool') {
//         return 'boolean';
//     } else if (define === 'date' || define === 'datetime') {
//         return 'Date';
//     } else {
//         return 'string';
//     }
// }

function getTsType(type) {
    if (type === '0' || type === '1' || type === '7' || type === '9' || type === '10' || type === '11' || type === '12') {
        return 'string';
    } else if (type === '2' || type === '3') {
        return 'number';
    } else if (type === '4') {
        return 'boolean';
    } else if (type === '5' || type === '6') {
        return 'Date';
    } else {
        return 'string';
    }
}
