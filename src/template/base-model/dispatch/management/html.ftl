<div v-if="$hasPerm(queryPerm)">
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" ref="form" :model="form" :rules="rules">
                <div v-if="showBtnQuery" class="inline-block">
                    <!-- 在此插入表单要过滤的条件-->
                    <el-form-item>
                        <el-button type="primary" @click="ok">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-if="showBtnAdd && $hasPerm(addPerm)">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <template>
                <el-table ref="datas" :data="datas" :highlight-current-row="true" @current-change="handleCurrentChange"
                    @selection-change="handleSelectionChange" border style="width: 100%;" maxHeight="400">
                    <el-table-column v-if="multipleSelect" type="selection" width="40">
                    </el-table-column>
                    <el-table-column v-for="column in displayColumns" :prop="column.prop" :label="column.label" :header-align="column['header-align']"
                        :align="column.align" :width="column.width" :formatter="column.formatter">
                    </el-table-column>
                    <el-table-column label="操作" header-align="center"
                        align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit($event, scope.$index, scope.row)" v-if="showBtnEdit && $hasPerm(editPerm)">编辑</el-button>
                            <el-button type="text" size="small" @click="handleDelete($event, scope.$index, scope.row)" v-if="showBtnDelete && $hasPerm(deletePerm)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-pagination :layout="pagerConfig.layout" :total="pagerConfig.total" :page-size="pagerConfig.pageSize"
                :page-sizes="pagerConfig.pageSizes" :style="pagerConfig.style" @size-change="pagerConfig.sizeChange"
                @current-change="pagerConfig.currentChange">
            </el-pagination>
        </el-col>
    </el-row>
</div>
