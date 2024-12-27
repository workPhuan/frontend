<template>
    <div class="page-container">
        <div class="page-header">
            <label>
                <i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_user_special')}}
            </label>
            <div class="page-toolbar">
                <el-button class="custom-button plain" @click="modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('userSpecialAdd')">{{$t('menu.management_user_special_add')}}</el-button>
            </div>
        </div>

        <div class="page-body p-3">
            <el-card shadow="never">
                <div class="page-filter">
                    <legend>{{$t('mix.table_filter')}}</legend>
                    <div class="p-3 d-flex flex-wrap">
                        <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="initial()" clearable>
                            <template #prepend>
                                <label>{{$t('mix.table_username')}}</label>
                            </template>
                        </el-input>

                        <div class="fixed-width-200">
                            <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status_id" :placeholder="$t('mix.table_type')" clearable @change="initial()" size="large">
                                <el-option v-for="item in statusList" :label="item.name" :value="item.id">{{item.name}}</el-option>
                            </el-select>
                        </div>

                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
                            <el-option :label="$t('mix.table_yes')" :value="1">{{$t('mix.table_yes')}}</el-option>
                            <el-option :label="$t('mix.table_no')" :value="0">{{$t('mix.table_no')}}</el-option>
                        </el-select>

                        <el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
                    </div>
                </div>

                <el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
                    <template #empty v-if="tableData.length=='0'">
                        <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                        <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                        <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                    </template>

                    <template v-for="title in ajaxTitles" :key="title.prop">
                        <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
                            <template #header>
                                <p class="search-label">{{title.label}}</p>
                            </template>

                            <template v-if="title.prop == 'status'" #default="scope">
                                <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('userSpecialEdit')) ? false : true"></el-switch>
                            </template>

                            <template v-if="title.prop == 'action'" #default="scope">
                                <el-button v-if="$p.permissionChecker('userSpecialEdit')" class="custom-button m-1 primary" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
                                <el-button v-if="$p.permissionChecker('userSpecialDelete')" class="custom-button m-1 danger" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
            </el-card>
        </div>

        <el-dialog v-model="modalList.addRow" :title="$t('menu.management_user_special_add')" :before-close="clearPostForm" class="dialog-md">
            <el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
                <el-row :gutter="20">
                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.member" :placeholder="$t('mix.table_username')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
                        <el-select class="custom-input mt-1 w-100" v-model="postForm.status_id" :placeholder="$t('msg.msg_select')" size="large">
                            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
                        </el-select>
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_start_at')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.start_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_start_at')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_end_at')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.end_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_end_at')" />
                    </el-col>
                    
                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_value')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.value" :placeholder="$t('mix.table_value')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
                        <el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
                            <el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
                            <el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
                        </el-select>
                    </el-col>

                    <el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <div class="d-flex justify-content-center align-item-center">
                    <el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
                    <el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="modalList.editRow" :title="$t('menu.management_user_special_edit')" :before-close="clearPostForm" class="dialog-md">
            <el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
                <el-row :gutter="20">
                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.member" :placeholder="$t('mix.table_username')" :disabled="true" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
                        <el-select class="custom-input mt-1 w-100" v-model="postForm.status_id" :placeholder="$t('msg.msg_select')"  :disabled="true" size="large">
                            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
                        </el-select>
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_start_at')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.start_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_start_at')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_end_at')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.end_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_end_at')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_value')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.value" :placeholder="$t('mix.table_value')" />
                    </el-col>

                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
                        <el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
                            <el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
                            <el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
                        </el-select>
                    </el-col>

                    <el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <div class="d-flex justify-content-center align-item-center">
                    <el-button class="custom-button success font-8 pt-3 pb-3" @click="editRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
                    <el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.editRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
</script>

<script>

let searchForm = {
    pagination: 1,
    limit: 10,
}

export default {
    inject:['preloader'],
    data(){
        return {
            loading: true,
            tableData: [],
            total: 0,
            errors: [],
            submitForm: {
                id:'',
            },
            postData: {
                data: '',
                language: '',
            },
            searchData:Object.assign({}, searchForm),
            listQuery: {
                page: 1,
                limit: 10
            },
            ajaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'60',
            },{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'200',
            },{
                prop:"status_id",
                label:this.$t('mix.table_type'),
                width:'150',
            },{
                prop:"value",
                label:this.$t('mix.table_value'),
                width:'150',
            },{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'100',
            },{
                prop:"start_at",
                label:this.$t('mix.table_start_at'),
                width:'150',
            },{
                prop:"end_at",
                label:this.$t('mix.table_end_at'),
                width:'150',
            },{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'150',
            },{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'200',
                align: 'right'
            }],
            postForm:{
                id:'',
                member:'',
                status_id:'',
                value:'',
                status:1,
                security:''
            },
            statusList:[],
            modalList:{},
            securityCheck: 0
        }
    },
    methods:{
        getInitial(){
            this.loading = true

            this.postData.data = JSON.stringify(this.submitForm)
            var result = this.$m.postMethod('management/user/special',this.postData)
            result.then((value) => {
                var data = value.data
                if(value.valid){
                    this.statusList = data.statusList
                    this.searchData.pagination = 1
                    this.initial()
                }
                this.loading = false
            })
        },initial(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)
            var result = this.$m.postMethod('management/user/special/ajaxTable',this.postData)
            result.then((value) => {
                var data = value.data

                if(value.valid){
                    this.tableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.listQuery.page = parseInt(data.datatable.current_pagination)
                    this.listQuery.limit = parseInt(data.datatable.limit)
                }
                this.loading = false
            })
        },clearPostForm(done){
            this.postForm.member = ''
            this.postForm.status_id = ''
            this.postForm.value = ''
            this.postForm.status = 1
            this.postForm.security = ''
            if(done != undefined){
                done()
            }
        },addRow(){
            if(this.$p.permissionChecker('userSpecialAdd') && this.loading == false){
                this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
                var result = this.$m.postMethod('management/user/special/DBadd',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.addRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
            }
        },getEditRow(id){
            if(this.$p.permissionChecker('userSpecialEdit')){
                this.loading = true
                this.submitForm.id = id
                this.postData.data = JSON.stringify(this.submitForm)
                var result = this.$m.postMethod('management/user/special/edit',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.postForm = data.thisDetail
                        this.modalList.editRow = true
                    }
                    this.loading = false
                })
            }
        },editRow(){
            if(this.$p.permissionChecker('userSpecialEdit')){
                this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/user/special/DBedit',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.editRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
            }
        },statusRow(currentData){
            if(this.$p.permissionChecker('userSpecialEdit') && this.loading == false){
                this.loading = true
                this.submitForm.id = currentData.id;
                this.submitForm.status = currentData.status;
                this.postData.data = JSON.stringify(this.submitForm)

                var formData = new FormData();
                formData.append('data', this.postData.data);
                formData.append('language', this.postData.language);

                var result = this.$m.postMethod('management/user/special/DBstatus',formData)
                result.then((value) => {
                    var data = value.data
                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        });
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    this.clearPostForm()
                    this.initial()
                    this.loading = false
                });
            };
        },deleteRow(id){
            if(this.$p.permissionChecker('userSpecialDelete')){
                this.loading = true
                this.loading = true
                this.$confirm(this.$t('msg.msg_action'), this.$t('msg.prompt'), {
                    confirmButtonText: this.$t('button.yes'),
                    cancelButtonText: this.$t('button.no'),
                    customClass: 'input-dialog',
                    showInput: (this.securityCheck == 1),
                    inputPlaceholder: this.$t('mix.table_security'),
                    inputType: 'password',
                }).then(({value}) => {
                    this.preloader(true)
                    this.submitForm.security = value
                    this.submitForm.id = id
                    this.postData.data = JSON.stringify(this.submitForm)

                    var result = this.$m.postMethod('management/user/special/DBdelete',this.postData)

                    result.then((value) => {
                        var data = value.data

                        if(value.valid){
                            this.$message({
                                message: data.returnMsg,
                                type: 'success'
                            })

                            this.initial()
                        }else{
                            this.$m.popupErrorMessage(data.returnMsg,this)
                        }

                        this.loading = false
                        this.preloader(false)
                    })
                }).catch(() => {
                    this.loading = false
                })
            }
        },paginationChange(value){
            if(value.page != ""){
                this.searchData.pagination = value.page
            }

            if(value.limit != ""){
                this.searchData.limit = value.limit
            }

            this.initial()
        }
    },created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
        this.securityCheck = this.$m.getItem('securityCheck')
        this.getInitial()
    }
}
</script>