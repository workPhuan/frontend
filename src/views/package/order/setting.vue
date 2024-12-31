    <template>
        <div class="page-container">
            <div class="page-header">
                <label>
                    <i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.package_order_setting')}}
                </label>
                <div class="page-toolbar">  
                </div>  
            </div>
            
            <div class="page-body p-3">
                <el-tabs type="border-card">
                    <div class="ps-5 pe-5 pt-4 pb-4">
                        <div class="d-flex align-items-center mb-3">
                            <label class="text-theme font-8 fw-bold me-3">{{$t('mix.table_auto_assign')}}</label>
                            <el-switch v-model="switchState" active-value="1" inactive-value="0" @change="statusRow()" />
                        </div>
                        
                        <div v-if="switchState == true">
                            <div style="align-items: center;">
                                <div class="checkbox-container">
                                    <label class="text-theme font-8 fw-bold checkbox-label">{{$t('mix.table_sequence_assign')}}</label>
                                    <el-checkbox v-model="sequenceCheckBox" @change="onSequenceAssignChange"size="large"></el-checkbox>
                                </div>

                                <div class="checkbox-container">
                                    <label class="text-theme font-8 fw-bold checkbox-label">{{$t('mix.table_percentage_assign')}}</label>
                                    <el-checkbox v-model="percentageCheckBox" @change="onPercentageAssignChange" size="large"></el-checkbox>
                                </div>  
            
                                <div v-if="percentageCheckBox == true">
                                    <div v-for="item in agentList" :key="index" class="checkbox-container">
                                        <label class="text-theme font-8 fw-bold checkbox-label">{{ item.name }}</label>
                                        <el-input-number v-model="item.percentage" :step="1" :min="0" :max="100" label="Percentage">
                                            <template #suffix><span>%</span></template>
                                        </el-input-number>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <el-button @click="editRow()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.save_setting')}}</el-button>

                    </div>
                </el-tabs>
            </div>
        </div>
    </template>

    <script setup>
    import pagination from '@/components/pagination/index.vue'
    import { CopyDocument } from '@element-plus/icons-vue';

    </script>

    <script>
    let searchForm = {
        pagination: 1,
        limit: 10,
    }

    export default {
        components: {
            CopyDocument,
        },
        inject:['preloader'],
        data() {
            return {
                switchState: 0,
                sequenceCheckBox: 0,
                percentageCheckBox: 0,
                percentage: '',
                loading: true,
                tableData: [],
                total: 0,
                errors: [],
                submitForm: {
                    id: "",
                    status: 0
                },
                postData: {
                    data: "",
                    language: ""
                },
                searchData:Object.assign({}, searchForm),
                listQuery: {
                    page: 1,
                    limit: 10
                },
                ajaxTitles: [{
                    prop:"created_at",
                    label:this.$t("mix.table_created_at"),
                    width: "100",
                    align:'center'
                },{
                    prop:"code",
                    label:this.$t("mix.table_code"),
                    width: "150",
                    align:'center'
                },{
                    prop:"product_name",
                    label:this.$t("mix.table_product"),
                    width: "150",
                    align:'center'
                },{
                    prop:"name",
                    label:this.$t("mix.table_name"),
                    width: "100",
                },{
                    prop:"loan_amount",
                    label:this.$t("mix.table_loan_amount"),
                    width: "150",
                    align:'center'
                },{
                    prop:"status_name",
                    label:this.$t("mix.table_status"),
                    width: "150",
                    align:'center'
                },{
                    prop:"agent_name",
                    label:this.$t("mix.table_agent"),
                    width: "150",
                    align:'center'
                },{
                    prop:"action",
                    label:this.$t("mix.table_action"),
                    width: "270",
                    align:'right'
                }],
                ajaxSearch: [{
                    prop:"name",
                    label:this.$t("mix.table_name")
                },{
                    prop:"category",
                    label:this.$t("mix.table_category")
                },{
                    prop:"sort",
                    label:this.$t("mix.table_sort")
                },{
                    prop:"status",
                    label:this.$t("mix.table_status")
                }],
                postForm: {
                    status: "",
                    security: "",
                    code: "",
                    master_id: '',
                    name: '',
                    account_package_id: '',
                    selectedIds: [],
                    name: []
                },
                languageList:JSON.parse(this.$m.getItem('languageList')),
                defaultProps:{
                    id: 'id',
                    children: 'children',
                    label: 'name'
                },
                modalList:{},
                searchProductList: [],
                productList: [],
                searchAgentList: [],
                agentList: [],
                searchStatusList: [],
                statusList: [],
                securityCheck: 0,
                imagePickerFile:'',
                imagePickerFileUrl:'',
            };
        },
        methods:{
            getInitial(){
                this.searchData.pagination = 1
                this.loading = true
                this.postData.data = JSON.stringify(this.postForm)
                var result = this.$m.postMethod('package/order/setting',this.postData)
                result.then((value)=>{
                    var data = value.data
                    if(value.valid){
                        this.searchAgentList = data.agentList
                        this.agentList = data.agentList
                        this.multiActionMax = data.multiActionMax
                    }
                    this.initial()
                })
            },
            initial() {
                this.loading = true;
                this.postData.data = JSON.stringify(this.searchData);
                var result = this.$m.postMethod("package/order/setting/ajaxTable", this.postData);
                result.then((value) => {
                    var data = value.data;

                    if (value.valid) {
                        this.tableData = data.datatable.data
                        this.total = parseInt(data.datatable.total_number)
                        this.listQuery.page = parseInt(data.datatable.current_pagination)
                        this.listQuery.limit = parseInt(data.datatable.limit)
                        this.loading = false
                    }
                });
            },
            clearPostForm(done){
                this.postForm.code = []
                this.postForm.group_id = []
                this.postForm.img_url = ''
                this.postForm.id = '' 
                this.postForm.name = []
                this.postForm.selectedIds = []
                this.postForm.domain_url = ''
                this.postForm.username = ''
                this.imagePickerFile = ''
                this.imagePickerFileUrl = ''
                if(done != undefined){
                    done()
                }
            },
            editRow() {
                if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
                    this.loading = true
                    this.preloader(true)
                    var formData = new FormData()
                    formData.append('file',this.imagePickerFile)
                    formData.append('data',JSON.stringify(this.postForm))
                    var result = this.$m.postMethod("package/order/setting/DBedit", formData)

                    result.then((value) => {
                        var data = value.data

                        if (value.valid) {
                            this.$message({
                                message: data.returnMsg,
                                type: "success"
                            });
                            
                            this.modalList.editRow = false
                            this.clearPostForm()
                            this.initial()
                        } else {
                            this.$m.popupErrorMessage(data.returnMsg,this)
                        }

                        this.loading = false
                        this.preloader(false)
                    });
                }
            },statusRow(currentData){
                if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
                    this.loading = true
                    this.submitForm.id = currentData.id
                    this.submitForm.status = currentData.status
                    this.postData.data = JSON.stringify(this.submitForm)
                    
                    var formData = new FormData()
                    formData.append('data', this.postData.data)
                    formData.append('language', this.postData.language)

                    var result = this.$m.postMethod('management/chat/group/DBstatus',formData)
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
                }
            },deleteRow(id) {
                if(this.$p.permissionChecker('userChatGroupDelete') && this.loading == false){
                    var valid = true
                    if(id == 'multiple'){
                        if(this.postForm.selectedIds.length < 1){
                            valid = false
                        }
                    }
                    
                    if(valid){
                        this.loading = true
                        this.$confirm(this.$t('msg.msg_delete'), this.$t('msg.prompt'), {
                            confirmButtonText: this.$t('button.yes'),
                            cancelButtonText: this.$t('button.no'),
                            customClass: 'input-dialog',
                            showInput: (this.securityCheck == 1), 
                            inputPlaceholder: this.$t('mix.table_security'),
                            inputType: 'password',
                        }).then(({value}) => {
                            this.postForm.security = value
                            this.postForm.id = id
                            this.postData.data = JSON.stringify(this.postForm);
                            var result = this.$m.postMethod("management/chat/group/DBdelete", this.postData);
                            result.then((value) => {
                                var data = value.data
                                if (value.valid) {
                                    this.$message({
                                        type: "success",
                                        message: data.returnMsg
                                    });

                                    this.initial()
                                    this.loading = false
                                } else {
                                    this.$m.popupErrorMessage(data.returnMsg,this)
                                    this.loading = false
                                }
                            });
                        }).catch(() => {
                            this.loading = false;         
                        });
                    }else{
                        this.$message.error(this.$t('error.msg_checkbox_select'))
                    }
                }
            },onPercentageAssignChange() {
                if (this.percentageCheckBox) {
                    this.sequenceCheckBox = false;
                }
            },onSequenceAssignChange() {
                if (this.sequenceCheckBox) {
                    this.percentageCheckBox = false;
                }
                },
            },initialImage(){
                this.imagePickerFile = ''
                this.imagePickerFileUrl = ''
                document.getElementById('file').value = ''
            },openImage(){
                document.getElementById('file').click()
            },imageChange(){
                this.imagePickerFile = document.getElementById('file').files[0];
                this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
            },clearSearchForm(){
                this.searchData = Object.assign({}, searchForm)
                this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

                this.initial()
            },copyToClipboard(value) {
                navigator.clipboard.writeText(value).then(() => {
                    this.$message.success('Copied successfully!'); 
                }).catch(() => {
                    this.$message.error('Failed to copy!');
                });
            },paginationChange(value){
                if(value.page != ""){
                    this.searchData.pagination = value.page
                }

                if(value.limit != ""){
                    this.searchData.limit = value.limit
                }
                
                this.initial()
            },handleSelectionChange(selection){
                this.postForm.selectedIds = selection.map((row) => row.id)
            
        },created(){
            this.postData.language = this.$m.getItem('currentLang')??'en'
            this.securityCheck = this.$m.getItem('securityCheck')
            this.getInitial()
        }
    };
    </script>