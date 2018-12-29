{{#each imports as |import|}}
{{{import}}}
{{/each}}

{{#if config.base}}
@Component
{{else}}
@Component({
    mixins: [BaseController]
})
{{/if}}
export default class {{names.upperCapital}}Controller extends BaseController {

}
