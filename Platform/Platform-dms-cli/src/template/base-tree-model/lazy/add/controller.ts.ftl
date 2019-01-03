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
    mixins: [BaseTreeModelLazyAddDialogController]
})
{{/if}}
export default class {{names.upperCapital}}AddController extends BaseTreeModelLazyAddDialogController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    pk: string = '{{metadata.pk}}';
    form: {{names.upperCapital}} = new {{names.upperCapital}}();

    props: {label: string, children: string} = {
        label: 'label',
        children: 'children'
    };

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
