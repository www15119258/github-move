#!/usr/bin/env node

var program = require('commander');
const package = require('../package.json');
const template = require('./template');
const component = require('./component');
const form = require('./form');

program
.version(package.version);
program
  .command('template')
  .description('生成代码')
  .option("-n, --name [mode]", "实体名称")
  .option("-d, --dir [mode]", "生成代码目录")
  .option("-t, --type [mode]", "实体类型")
  .option("-m, --mode [mode]", "模板类型")
  .option("-b, --base [mode]", "是否base模块")
  .option("-i, --id [mode]", "元数据ID")
  .action(function(options){
    let name = options.name;
    let target = options.dir || '';
    if (target === '') {
        console.log('请指定代码生成目录-d');
        return;
    }
    let type = options.type || 'base-model';
    let mode = options.mode || (type === 'base-model' ? 'dialog' : 'early');
    let base = (options.base && options.base === 'true') ? true : false;
    let id = options.id || '';
    let o = { name, target, type, mode, base, id};
    template.addModel(o);
  });

program
  .command('component')
  .description('生成页面控件')
  .option("-n, --name [mode]", "页面名称")
  .option("-b, --base [mode]", "是否base模块")
  .option("-d, --dir [mode]", "生成代码目录")
  .action(function(options){
    let name = options.name;
    let target = options.dir || '';
    if (target === '') {
        console.log('请指定代码生成目录-d');
        return;
    }
    let base = options.base;
    let o = { name, target, base };
    component.addComponent(o);
  });

program
  .command('form')
  .description('生成表单页面控件')
  .option("-n, --name [mode]", "页面名称")
  .option("-b, --base [mode]", "是否base模块")
  .option("-d, --dir [mode]", "生成代码目录")
  .action(function(options){
    let name = options.name;
    let target = options.dir || '';
    if (target === '') {
        console.log('请指定代码生成目录-d');
        return;
    }
    let base = options.base;
    let o = { name, target, base };
    form.addComponent(o);
  });
program.parse(process.argv);
