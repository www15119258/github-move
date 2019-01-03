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
    mixins: [BaseModelEditDialogAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}EditController extends BaseModelEditDialogAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    form: {{names.upperCapital}} = new {{names.upperCapital}}();
    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

}
