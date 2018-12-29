<el-form :model="form" ref="form" :rules="rules" :label-position="formLabelPosition" label-width="120px" style="width: 500px">
    {{#if metadata}}
    {{#each metadata.property as |property|}}
        {{#if property.inherit}}
        {{else}}
            {{#equals tsType 'string'}}
    <el-form-item label="{{property.name}}" labelWidth="100px" prop="{{property.id}}">
        <el-input v-model="form.{{property.id}}"></el-input>
    </el-form-item>
            {{/equals}}
            {{#equals tsType 'boolean'}}
    <el-form-item label="{{property.name}}" prop="{{property.id}}">
        <el-switch v-model="form.{{property.id}}"></el-switch>
    </el-form-item>
            {{/equals}}
            {{#equals tsType 'date'}}
    <el-form-item label="{{property.name}}" prop="{{property.id}}">
        <el-date-picker v-model="form.{{property.id}}" type="date"
        format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
            {{/equals}}
        {{/if}}
    {{/each}}
    {{else}}
    <!-- 插入表单内容-->
    <!-- <el-form-item label="名称" labelWidth="100px" prop="name">
        <el-input v-model="form.name"></el-input>
    </el-form-item>-->
    {{/if}}
    <el-form-item>
        <el-button type="primary" @click="ok">确认</el-button>
    </el-form-item>
</el-form>
