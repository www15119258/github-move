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
    mixins: [BaseTreeModelEarlyAddDialogAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}AddController extends BaseTreeModelEarlyAddDialogAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    // 设置实体主键
    {{#if metadata}}
    pk: string = '{{metadata.pk}}';
    {{else}}
    pk: string = '';
    {{/if}}
    form: {{names.upperCapital}} = new {{names.upperCapital}}();
    // 设置实体主键
    {{#if metadata}}
    queryForm: QueryForm = new QueryForm([{{names.upperCapital}}.META_ID]);
    {{else}}
    queryForm: QueryForm = new QueryForm(['']);
    {{/if}}

    props: {label: string, children: string} = {
        label: 'label',
        children: 'children'
    };

    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

}
