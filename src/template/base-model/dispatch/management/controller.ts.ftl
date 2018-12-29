{{#each imports as |import|}}
{{{import}}}
{{/each}}

{{#if config.base}}
@Component
{{else}}
@Component({
    mixins: [BaseModelManagementDispatchAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}ManagmentController extends BaseModelManagementDispatchAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    // 设置实体主键
    {{#if metadata}}
    pk: string = '{{metadata.pk}}';
    {{else}}
    pk: string = '';
    {{/if}}
    form: {{names.upperCapital}} = new {{names.upperCapital}}();

    // 设置需要显示的字段
    // examples:
    // columns: any[] = [
    //     {
    //         'prop': 'name',
    //         'label': '名称',
    //         'header-align': 'center',
    //         'align': 'left',
    //         'width': 200
    //     }
    // ];
    {{#if metadata}}
    columns: any[] = [
        {{#each metadata.property as |property|}}
            {{#if property.inherit}}
            {{else}}
        {
            'prop': '{{property.id}}',
            'label': '{{property.name}}',
            'header-align': 'center',
            'align': 'left',
            'width': 200
        },
            {{/if}}
        {{/each}}
    ];
    {{else}}
    columns: any[] = [];
    {{/if}}

    // 设置权限字符串
    queryPerm?: string = '{{config.name}}:{{names.lowerCase}}:view';
    addPerm?: string = '{{config.name}}:{{names.lowerCase}}:add';
    editPerm?: string = '{{config.name}}:{{names.lowerCase}}:edit';
    deletePerm?: string = '{{config.name}}:{{names.lowerCase}}:delete';

    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

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
