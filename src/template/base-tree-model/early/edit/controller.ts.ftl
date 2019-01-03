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
    mixins: [BaseTreeModelEarlyEditDialogAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}EditController extends BaseTreeModelEarlyEditDialogAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    // 设置实体主键
    {{#if metadata}}
    pk: string = '{{metadata.pk}}';
    {{else}}
    pk: string = '';
    {{/if}}
    form: {{names.upperCapital}} = new {{names.upperCapital}}();
    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

    validatorFunArgs: any = {pk: this.pk};

    props: {label: string, children: string} = {
        label: 'label',
        children: 'children'
    };

    initQueryForm() {
        let queryForm =  new QueryForm([{{names.upperCapital}}.META_ID]);
        let filterParams: any[] = [];
        queryForm.start = (this.pagerConfig.page - 1) * this.pagerConfig.pageSize;
        queryForm.limit = this.pagerConfig.pageSize;
        queryForm.andList = filterParams;
        // queryForm.orders = [{ name: 'createtime', order: 'asc' }];
        this.queryForm = queryForm;
    }

}
