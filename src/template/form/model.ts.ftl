{{#each imports as |import|}}
{{{import}}}
{{/each}}

export default class {{names.upperCapital}} extends BaseModel {

    getPk(): string | undefined {
        return undefined;
    }

}
