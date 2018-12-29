{{#each imports as |import|}}
{{{import}}}
{{/each}}

{{#if config.base}}
@Component
{{else}}
@Component({
    mixins: [BaseModelEditDispatchAbstractController]
})
{{/if}}
export default class {{names.upperCapital}}EditController extends BaseModelEditDispatchAbstractController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    form: {{names.upperCapital}} = new {{names.upperCapital}}();
    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

}
