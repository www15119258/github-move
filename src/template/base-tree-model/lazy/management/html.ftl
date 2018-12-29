<div v-if="$hasPerm(queryPerm)">
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" ref="form" :model="form" :rules="rules">
                <el-form-item>
                    <el-button type="primary" @click="ok">刷新</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-if="showBtnAdd && $hasPerm(addPerm)">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEdit" v-if="showBtnEdit && $hasPerm(editPerm)">编辑</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleDelete" v-if="showBtnDelete && $hasPerm(deletePerm)">删除</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-tree ref="tree" lazy node-key="{{metadata.pk}}" :data="datas" :props="props" :default-expand-all="defaultExpandAll"
                :default-expanded-keys="defaultExpandedKeys"
                :show-checkbox="multipleSelect" :check-strictly="checkStrictly" :expand-on-click-node="expandOnClickNode"
                @node-expand="handleNodeExpand"
                highlight-current @check="handleCheck" @current-change="handleCurrentChange"></el-tree>
        </el-col>
    </el-row>
    <{{config.name}}-page-{{names.middleLine}}-add v-if="$hasPerm(addPerm)" :parent="current" :show="showAddDialog" :callback="addCallback" @close="close"></{{config.name}}-page-{{names.middleLine}}-add>
    <{{config.name}}-page-{{names.middleLine}}-edit v-if="$hasPerm(editPerm)" :model="current" :show="showEditDialog" :callback="editCallback" @close="close"></{{config.name}}-page-{{names.middleLine}}-edit>
</div>