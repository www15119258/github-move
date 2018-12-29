{{#each imports as |import|}}
{{{import}}}
{{/each}}

export default class {{names.upperCapital}} extends BaseModel {

    {{#if metadata}}
    static META_ID: string = '{{metadata.id}}';
    {{else}}
    static META_ID: string = '';
    {{/if}}

    {{#if metadata}}
        {{#each metadata.property as |property|}}
            {{#if property.inherit}}
            {{else}}
    // {{property.name}}
    {{{formatColumnName property.id}}}?: {{property.tsType}};
            {{/if}}
        {{/each}}
    {{/if}}

    getPk(): string | undefined {
        {{#if metadata}}
        return this.{{metadata.pk}};
        {{else}}
        return this.undefined;
        {{/if}}
    }
}
