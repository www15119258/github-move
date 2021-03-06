{{#each imports as |import|}}
{{{import}}}
{{/each}}

/**
 * version {{package.version}}
 */
@Component
export default class {{names.upperCapital}}Controller extends BaseFormController<{{names.upperCapital}}, {{names.upperCapital}}Service> {

    form: {{names.upperCapital}} = new {{names.upperCapital}}();

    service: {{names.upperCapital}}Service = {{names.upperCapital}}Service.getInstance();

    ok(): void {
        (this.$refs['form'] as ElForm).validate((valid: boolean) => {
            if (valid === false) {
                return;
            }
            // TODO
        });
    }

}
