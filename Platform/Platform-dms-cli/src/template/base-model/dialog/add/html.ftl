<el-dialog @open="beforeOpen" :close-on-click-modal="false" title="新增" :visible.sync="show" :before-close="beforeClose" @close="initForm" append-to-body>
    <el-form v-if="form" :model="form" ref="form" :rules="rules">
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
        <el-form-item label="{{property.name}}" labelWidth="100px"  prop="{{property.id}}">
            <el-switch v-model="form.{{property.id}}"></el-switch>
        </el-form-item>
                {{/equals}}
                {{#equals tsType 'date'}}
        <el-form-item label="{{property.name}}" labelWidth="100px"  prop="{{property.id}}">
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
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="ok">确认</el-button>
    </div>
</el-dialog>