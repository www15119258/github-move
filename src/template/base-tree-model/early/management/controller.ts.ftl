{{#each imports as |import|}}
{{{import}}}
{{/each}}

/**
 * version {{package.version}}
 */
{{#if config.base}}
@Component
{{else}}
@Component({
    mixins: [BaseTreeModelEarlyManagementDialogAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}ManagementController extends BaseTreeModelEarlyManagementDialogAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    // 设置实体主键
    {{#if metadata}}
    pk: string = '{{metadata.pk}}';
    {{else}}
    pk: string = '';
    {{/if}}
    form: {{names.upperCapital}} = new {{names.upperCapital}}();

    // 设置权限字符串
    queryPerm?: string = '{{config.name}}:{{names.lowerCase}}:view';
    addPerm?: string = '{{config.name}}:{{names.lowerCase}}:add';
    editPerm?: string = '{{config.name}}:{{names.lowerCase}}:edit';
    deletePerm?: string = '{{config.name}}:{{names.lowerCase}}:delete';

    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

    props: {label: string, children: string} = {
        label: 'label',
        children: 'children'
    };

    buildQueryForm(): QueryForm {
        let queryForm = new QueryForm([{{names.upperCapital}}.META_ID]);
        let filterParams: any[] = [];
        queryForm.start = (this.pagerConfig.page - 1) * this.pagerConfig.pageSize;
        queryForm.limit = this.pagerConfig.pageSize;
        queryForm.andList = filterParams;
        // queryForm.orders = [{ name: 'createtime', order: 'desc' }];
        return queryForm;
    }

}
