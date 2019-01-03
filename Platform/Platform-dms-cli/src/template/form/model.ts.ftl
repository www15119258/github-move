{{#each imports as |import|}}
{{{import}}}
{{/each}}

/**
 * version {{package.version}}
 */
export default class {{names.upperCapital}} extends BaseModel {

    getPk(): string | undefined {
        return undefined;
    }

}
