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
    mixins: [BaseTreeModelLazyManagementDialogAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}ManagmentController extends BaseTreeModelLazyManagementDialogAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    // 设置实体主键
    {{#if metadata}}
    pk: string = '{{metadata.pk}}';
    {{else}}
    pk: string = '';
    {{/if}}
    form: {{names.upperCapital}} = new {{names.upperCapital}}();

    props: {label: string, children: string} = {
        label: 'label',
        children: 'children'
    };

    // 设置权限字符串
    queryPerm?: string = '{{config.name}}:{{names.lowerCase}}:view';
    addPerm?: string = '{{config.name}}:{{names.lowerCase}}:add';
    editPerm?: string = '{{config.name}}:{{names.lowerCase}}:edit';
    deletePerm?: string = '{{config.name}}:{{names.lowerCase}}:delete';

    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

    buildQueryForm(parent: {{names.upperCapital}} | undefined): QueryForm {
        let queryForm =  new QueryForm([{{names.upperCapital}}.META_ID]);
        let filterParams: any[] = [];
        if (parent) {
            filterParams.push({
                key: 'parent',
                operator: PredicateOperator.EQ,
                value: parent[this.pk]
            });
        } else {
            filterParams.push({
                key: 'parent',
                operator: PredicateOperator.ISNULL
            });
        }
        queryForm.start = (this.pagerConfig.page - 1) * this.pagerConfig.pageSize;
        queryForm.limit = this.pagerConfig.pageSize;
        queryForm.andList = filterParams;
        // queryForm.orders = [{ name: 'sort', order: 'asc' }];
        return queryForm;
    }

}
