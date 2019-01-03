const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const StringUtil = require('../src/util/string-util');
const handlebars = require('handlebars');
const metadataUtil = require('../src/util/metadata-util');
const configUtil = require('../src/util//config-util');
const package = require('../package.json');

handlebars.registerHelper('formatColumnName', function(name) {
    if (name.indexOf('_') >= 0) {
        return `['${name}']`;
    }
    return name;
});

handlebars.registerHelper('equals', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

module.exports = {
    addModel: function (options) {
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
        let params = { config , package};
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
        let type = options.type;
        let mode = options.mode;
        if (type === 'base-model' && mode === 'dialog') {
            templatePath = 'src/template/base-model/dialog';
            this._addModel_1(dir, target, templatePath, params);
        } else if (type === 'base-model' && mode === 'dispatch') {
            templatePath = 'src/template/base-model/dispatch';
            this._addModel_2(dir, target, templatePath, params);
        } else if (type === 'base-tree-model' && mode === 'early') {
            templatePath = 'src/template/base-tree-model/early';
            this._addModel_3(dir, target, templatePath, params);
        } else if (type === 'base-tree-model' && mode === 'lazy') {
            templatePath = 'src/template/base-tree-model/lazy';
            this._addModel_4(dir, target, templatePath, params);
        }
    },
    // 普通对象弹框
    _addModel_1: function(dir, target, templatePath, params) {
        // 生成model
        let modelTemplate = path.resolve(__dirname, '..', templatePath + '/model.ts.ftl');
        let modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.model.ts');
        let imports = [];
        let tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
        if (params.config.base) {
            imports.push(`import BaseModel from '${tempPath}/base-model';`);
        } else {
            imports.push(`import { BaseModel } from 'platform-vue-component2/src';`);
        }
        let content = fs.readFileSync(modelTemplate).toString();
        Object.assign(params, {
            imports
        });
        let result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)
        
        // 生成service
        delete params['imports'];
        imports = [];
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/service.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.service.ts');
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

        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelManagementDialogAbstractController from '${tempPath}/base-model-management.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
        } else {
            imports.push(`import { BaseModelManagementDialogAbstractController, QueryForm } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelAddDialogAbstractController from '${tempPath}/base-model-add.dialog.abstract.controller';`);
        } else {
            imports.push(`import { BaseModelAddDialogAbstractController } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelEditDialogAbstractController from '${tempPath}/base-model-edit.dialog.abstract.controller';`);
        } else {
            imports.push(`import { BaseModelEditDialogAbstractController } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`);
    },
    // 普通对象跳转模板
    _addModel_2: function(dir, target, templatePath, params) {
        // 生成model
        let modelTemplate = path.resolve(__dirname, '..', templatePath + '/model.ts.ftl');
        let modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.model.ts');
        let imports = [];
        let tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
        if (params.config.base) {
            imports.push(`import BaseModel from '${tempPath}/base-model';`);
        } else {
            imports.push(`import { BaseModel } from 'platform-vue-component2/src';`);
        }
        let content = fs.readFileSync(modelTemplate).toString();
        Object.assign(params, {
            imports
        });
        let result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)
        
        // 生成service
        delete params['imports'];
        imports = [];
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/service.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.service.ts');
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

        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelManagementDispatchAbstractController from '${tempPath}/base-model-management.dispatch.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
        } else {
            imports.push(`import { BaseModelManagementDispatchAbstractController, QueryForm } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelAddDispatchAbstractController from '${tempPath}/base-model-add.dispatch.abstract.controller';`);
        } else {
            imports.push(`import { BaseModelAddDispatchAbstractController } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseModelEditDispatchAbstractController from '${tempPath}/base-model-edit.dispatch.abstract.controller';`);
        } else {
            imports.push(`import { BaseModelEditDispatchAbstractController } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`);
    },
    // 树立即加载模板
    _addModel_3: function(dir, target, templatePath, params) {
        // 生成model
        let modelTemplate = path.resolve(__dirname, '..', templatePath + '/model.ts.ftl');
        let modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.model.ts');
        let imports = [];
        let tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
        if (params.config.base) {
            imports.push(`import BaseTreeModel from '${tempPath}/base-tree-model';`);
        } else {
            imports.push(`import { BaseTreeModel } from 'platform-vue-component2/src';`);
        }
        let content = fs.readFileSync(modelTemplate).toString();
        Object.assign(params, {
            imports
        });
        let result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)
        
        // 生成service
        delete params['imports'];
        imports = [];
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/service.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.service.ts');
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/service');
            imports.push(`import BaseTreeModelService from '${tempPath}/base-tree-model.service';`);
        } else {
            imports.push(`import { BaseTreeModelService } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelEarlyManagementDialogAbstractController from '${tempPath}/base-tree-model-early-management.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
        } else {
            imports.push(`import { BaseTreeModelEarlyManagementDialogAbstractController, QueryForm } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelEarlyAddDialogAbstractController from '${tempPath}/base-tree-model-early-add.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
        } else {
            imports.push(`import { BaseTreeModelEarlyAddDialogAbstractController, QueryForm } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelEarlyEditDialogAbstractController from '${tempPath}/base-tree-model-early-edit.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
            
        } else {
            imports.push(`import { BaseTreeModelEarlyEditDialogAbstractController, QueryForm } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`);
    },
    // 树延迟加载模板
    _addModel_4: function(dir, target, templatePath, params) {
        // 生成model
        let modelTemplate = path.resolve(__dirname, '..', templatePath + '/model.ts.ftl');
        let modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.model.ts');
        let imports = [];
        let tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
        if (params.config.base) {
            imports.push(`import BaseTreeModel from '${tempPath}/base-tree-model';`);
        } else {
            imports.push(`import { BaseTreeModel } from 'platform-vue-component2/src';`);
        }
        let content = fs.readFileSync(modelTemplate).toString();
        Object.assign(params, {
            imports
        });
        let result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)
        
        // 生成service
        delete params['imports'];
        imports = [];
        imports.push(`import ${params.names.upperCapital} from './${params.names.middleLine}.model';`);
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/service.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '.service.ts');
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/service');
            imports.push(`import BaseTreeModelService from '${tempPath}/base-tree-model.service';`);
        } else {
            imports.push(`import { BaseTreeModelService } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelLazyManagementDialogAbstractController from '${tempPath}/base-tree-model-lazy-management.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/enum');
            imports.push(`import { PredicateOperator } from '${tempPath}/predicate-operator.enum';`);
        } else {
            imports.push(`import { BaseTreeModelLazyManagementDialogAbstractController, QueryForm, PredicateOperator } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/management/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-management', params.names.middleLine + '-management.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelLazyAddDialogController from '${tempPath}/base-tree-model-lazy-add.dialog.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/enum');
            imports.push(`import { PredicateOperator } from '${tempPath}/predicate-operator.enum';`);
        } else {
            imports.push(`import { BaseTreeModelLazyAddDialogController, QueryForm, PredicateOperator } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/add/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-add', params.names.middleLine + '-add.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)


        // 生成controller
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/controller.ts.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.controller.ts');
        imports.push(`import Component from 'vue-class-component';`);
        imports.push(`import ${params.names.upperCapital} from '../${params.names.middleLine}.model';`);
        imports.push(`import ${params.names.upperCapital}Service from '../${params.names.middleLine}.service';`);
        if (params.config.base) {
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/controller');
            imports.push(`import BaseTreeModelLazyEditDialogAbstractController from '${tempPath}/base-tree-model-lazy-edit.dialog.abstract.controller';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/model');
            imports.push(`import QueryForm from '${tempPath}/query-form';`);
            tempPath = path.relative(path.resolve(modelTarget, '..'), dir + '/src/base/enum');
            imports.push(`import { PredicateOperator } from '${tempPath}/predicate-operator.enum';`);
        } else {
            imports.push(`import { BaseTreeModelLazyEditDialogAbstractController, QueryForm, PredicateOperator } from 'platform-vue-component2/src';`);
        }
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`)

        // 生成html文件
        delete params['imports'];
        imports = [];
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/html.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.html');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/scss.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.scss');
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
        modelTemplate = path.resolve(__dirname, '..', templatePath + '/edit/vue.ftl');
        modelTarget = path.resolve(target, params.names.middleLine, params.names.middleLine + '-edit', params.names.middleLine + '-edit.vue');
        Object.assign(params, {
            imports
        });
        content = fs.readFileSync(modelTemplate).toString();
        result = handlebars.compile(content)(params);
        fse.ensureFileSync(modelTarget);
        fs.writeFileSync(modelTarget, result);
        console.log(`add file:${modelTarget}`);
    }
}
