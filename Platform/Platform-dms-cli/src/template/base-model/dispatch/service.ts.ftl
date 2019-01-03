{{#each imports as |import|}}
{{{import}}}
{{/each}}

/**
 * version {{package.version}}
 */
export default class {{names.upperCapital}}Service extends BaseModelService<{{names.upperCapital}}> {

    {{#if metadata}}
    module: string = '{{metadata.id}}';
    {{else}}
    module: string = '';
    {{/if}}

    private static instance: {{names.upperCapital}}Service;

    public static getInstance(): {{names.upperCapital}}Service {
        if ({{names.upperCapital}}Service.instance) {
            return {{names.upperCapital}}Service.instance;
        }
        {{names.upperCapital}}Service.instance = new {{names.upperCapital}}Service();
        return {{names.upperCapital}}Service.instance;
    }

}
