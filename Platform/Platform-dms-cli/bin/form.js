'use strict'
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const StringUtil = require('../src/util/string-util');
const handlebars = require('handlebars');
const metadataUtil = require('../src/util/metadata-util');
const configUtil = require('../src/util//config-util');

handlebars.registerHelper('equals', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

module.exports = {
    addComponent: function (options) {
        let config = configUtil.loadConfig();
        if (options.base) {
            Object.assign(config, {base: options.base});
        } else {
            if (config.base === undefined) {
                config.base = false;
            }
        }
        let id = options.id;
        let metadata = undefined;
        if (id && id !== '') {
            metadata = metadataUtil.getMetadataById(id);
            if (metadata === undefined) {
                console.error(`未找到元数据:${id}`);
                return;
            }
        }
        // console.log(metadata);
        let dir = path.resolve(".");
        let target = path.resolve(dir, options.target);
        let params = { config };
        if (metadata) {
            Object.assign(params, { metadata });
        }
        let templatePath = '';
        let name = options.name;
        if (name.endsWith('Model')) {
            name = name.substring(0, name.indexOf(Model));
        }
        let middleLineName = StringUtil.toMiddleLine(name);
        let upperCapitalName = StringUtil.toUpperCapital(name);
        Object.assign(params, {
            names: {
                name: name,
                lowerCase: name.toLowerCase(),
                middleLine: middleLineName,
                upperCapital: upperCapitalName
            }
        });
        templatePath = 'src/template/form'
        let imports = [];
        let tempPath = '';
        // 生成controller
        let modelTemplate = path.resolve(__dirname, '..', templatePath + '/controller.ts.ftl');
        let modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import { ElForm } from 'element-ui/types/form';`);
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from './${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseFormController from '${tempPath}/base-form.controller';`);
        } else {
            imports.push(`import { BaseFormController } from 'platform-vue-component2/src';`);
        }
        let content = fs.readFileSync(modelTemplate).toString();
        Object.assign(params, {
            imports
        });
        let result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.html');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成scss文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.scss');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成vue文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成model文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/model.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.model.ts');
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import BaseModel from '${tempPath}/base-model';`);
        } else {
            imports.push(`import { BaseModel } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成service文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/service.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.service.ts');
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/service');
            imports.push(`import BaseModelService from '${tempPath}/base-model.service';`);
        } else {
            imports.push(`import { BaseModelService } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)
    }
}
