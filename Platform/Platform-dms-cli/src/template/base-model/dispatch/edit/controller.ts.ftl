{{#each imports as |import|}}
{{{import}}}
{{/each}}

/**
 * version {{package.version}}
 */
@Component
export default class {{names.upperCapital}}EditController extends BaseModelEditDispatchAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    form: {{names.upperCapital}} = new {{names.upperCapital}}();
    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

}
