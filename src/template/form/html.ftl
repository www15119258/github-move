<el-form v-if="form" :model="form" ref="form" :rules="rules" label-position="left">
    <h3 class="title">标题</h3>
    <!-- 
    <el-form-item label="label" labelWidth="100px" prop="prop">
        <el-input v-model="form.prop"></el-input>
    </el-form-item>
    -->
    <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="ok">确认</el-button>
    </el-form-item>
</el-form>
