<template>
	<div class="page-container">
		<div class="page-header">
			<el-button style="cursor: pointer;" class="custom-button" type="info" @click="toAgentPage()">
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{"Back to " + $t('menu.management_admin_agent')}}
			</el-button>
		</div>
		
		<div class="page-body p-3">
            <el-card shadow="never">
                <div>
                    <h5 class="mb-3">{{$t('mix.table_agent_info')}}</h5>
                    <el-descriptions>
                        <el-descriptions-item :label="$t('mix.table_account')">{{ agentDetail.name }}    <el-button type="info" size="small"  @click="resetPasswordRow(agentDetail.master_id),modalList.editRow = true" >{{$t('general.forgetpasswordchange')}}</el-button></el-descriptions-item> 
                        <el-descriptions-item :label="$t('mix.table_total_order')">{{ agentDetail.total_order }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_loan')">{{ agentDetail.total_loan }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_name')">{{ agentDetail.login }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_client')">{{ agentDetail.total_client }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_repay')">{{ agentDetail.total_repay }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_status')">
                            {{ agentDetail.status }}
                            <el-switch v-model="agentDetail.status" active-value='normal' inactive-value="suspended" @change="userStatusRow(agentDetail.master_id,agentDetail.status)"></el-switch>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('menu.management_agent_is_view_other')">
                            <el-switch v-model="agentDetail.is_view_other" active-value="1" inactive-value="0" @click="viewOtherRow(agentDetail.master_id,agentDetail.is_view_other)"></el-switch>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_overdue')">{{ agentDetail.total_overdue }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <el-tabs type="border-card" @tab-click="loadTable">
                    <el-tab-pane key="order" :label="$t('menu.agent_order')">
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
                                        <el-tag :type="scope.row.status_color">{{scope.row.status}}</el-tag>
                                    </template>
                                    
                                    <template v-if="title.prop == 'action'" #default="scope">
                                        <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getOrderRow(scope.row.code)">{{$t('button.order_info')}}</el-button>
                                        <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getClientPage(scope.row.master_id)">{{$t('button.client_info')}}</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                        <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                    </el-tab-pane>
                        
                    <el-tab-pane key="client" :label="$t('menu.management_client_client')">
                        <el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
                            <template #empty v-if="tableData.length=='0'">
                                <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                                <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                                <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                            </template>
                            
                            <template v-for="title in ajaxTitles1" :key="title.prop">
                                <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
                                    <template #header>
                                        <p class="search-label">{{title.label}}</p>
                                    </template>

                                    <template v-if="title.prop == 'status'" #default="scope">
                                        <div class="status-label text-center" :style="'border: 1px solid '+scope.row.status_color+';color:'+scope.row.status_color">
                                        {{scope.row.status}}
                                        </div>
                                    </template>
                                    
                                    <template v-if="title.prop == 'action'" #default="scope">
                                        <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getClientPage(scope.row.master_id)">{{$t('button.client_info')}}</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-tab-pane>

                    <el-tab-pane key="system" :label="$t('menu.app')">
                        <div class="page-toolbar">
                            <el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('adminAdminAdd')">{{$t('menu.management_admin_admin_add')}}</el-button>
                        </div>
                        
                        <div class="page-body p-3">
                            <el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
                                <template #empty v-if="tableData.length=='0'">
                                    <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                                    <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                                    <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                                </template>
                                
                            <template v-for="title in ajaxTitles2" :key="title.prop">
                                    <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
                                        <template #header>
                                            <p class="search-label">{{title.label}}</p>
                                        </template>

                                        <template v-if="title.prop == 'status'" #default="scope">
                                            <!-- <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)"></el-switch> -->
                                        </template>

                                        <template v-if="title.prop == 'action'" #default="scope">
                                            <el-button v-if="$p.permissionChecker('adminAdminEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.master_id)">{{$t('menu.management_admin_admin_edit')}}</el-button>
                                        </template>
                                    </el-table-column>
                                </template>
                            </el-table>

                            <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                        </div>

                        <el-dialog v-model="modalList.addRow" :title="$t('menu.management_admin_admin_add')" :before-close="clearPostForm" class="dialog-md">
                            <el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
                                <el-row :gutter="20">
                                    <el-col :sm="24" class="mt-4">
                                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
                                        <el-input v-model="postForm.code" :placeholder="$t('mix.table_code')" />
                                    </el-col>
                                    <el-col :sm="12" class="mt-4">
                                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_loan_period')}}</label>
                                        <el-input-number class="w-100" v-model="postForm.period" :step="1" :min="0"/>
                                    </el-col>
                                    <el-col :sm="12" class="mt-4">
                                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
                                        <div>
                                            <el-switch v-model="postForm.status" :active-value="1" :inactive-value="0" :loading="loading"></el-switch>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" class="mt-4">
                                    <el-col :sm="24" :md="12" class="mb-3" v-for="item in postForm.attribute_list" :key="item.id">
                                        <label class="text-theme font-8 fw-bold"><span class="text-danger"> * </span>{{ item.name }}</label>
                                        <el-input-number class="w-100" v-model="item.value" :step="1" :min="0"/>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :sm="12" class="mt-2">
                                        <el-checkbox v-model="postForm.is_all_agent">{{$t('mix.table_is_all_agent')}}</el-checkbox>
                                    </el-col>
                                    <el-col :sm="12" class="mt-2">
                                        <el-checkbox v-model="postForm.is_eligible">{{$t('mix.table_is_eligible')}}</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :xs="24" :sm="24">
                                        <template v-if="postForm.multiple_language === 0">
                                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
                                            <el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />
                                        </template>
                                        
                                        <template v-else>
                                            <el-tabs type="border-card" class="mt-3 mb-4">
                                                <el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
                                                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
                                                    <el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />
                                                </el-tab-pane>
                                            </el-tabs>
                                        </template>
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
                    </el-tab-pane>

                    <el-tab-pane key="expense" :label="$t('menu.agent_expense')">
                        <el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
                            <template #empty v-if="tableData.length=='0'">
                                <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                                <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                                <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                            </template>
                            
                            <template v-for="title in ajaxTitles3" :key="title.prop">
                                <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
                                    <template #header>
                                        <p class="search-label">{{title.label}}</p>
                                    </template>
                                    
                                    <template v-if="title.prop == 'action'" #default="scope">
                                        <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getClientPage(scope.row.master_id)">{{$t('button.client_info')}}</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
		</div>
		<el-dialog v-model="modalList.editRow" :title="$t('general.forgetpasswordchange')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.password"  :placeholder="$t('mix.table_new_password')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password_confirm')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.confirm_password"  :placeholder="$t('mix.table_new_password_confirm')" />
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
import Tinymce from '@/components/tinymce/index.vue'
import { storeTempID } from '@/system/store/state.js'
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
			errors: [],
            tableData: [],
            tableData1: [],
            tableData2: [],
            tableData3: [],
            total: 0,
            searchData:Object.assign({}, searchForm),
			submitForm: {
				id:'',
				master_id:'',
                status:'',
                is_view_other:''
			},
			postData: {
				data: '',
				language: '',
			},
            listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'100',
			},{
                prop:"code",
                label:this.$t('mix.table_product_no'),
                width:'100',
			},{
                prop:"product_id",
                label:this.$t('mix.table_product'),
                width:'100',
                align:'center'
			},{
                prop:"name",
                label:this.$t('mix.table_client'),
                width:'100',
			},{
                prop:"loan_amount",
                label:this.$t('mix.table_loan_amount'),
                width:'90',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'90',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
			ajaxTitles1:[{
                prop:"login",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"phone_mobile",
                label:this.$t('mix.table_phone'),
                width:'120',
			},{
                prop:"icpass",
                label:this.$t('mix.table_icpass'),
                width:'120',
			},{
                prop:"loan_time",
                label:this.$t('mix.table_loan_time'),
                width:'120',
			},{
                prop:"total_overdue",
                label:this.$t('mix.table_total_overdue'),
                width:'120',
			},{
                prop:"total_loan",
                label:this.$t('mix.table_total_loan'),
                width:'120',
			},{
                prop:"total_repay",
                label:this.$t('mix.table_total_repay'),
                width:'120',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
            ajaxTitles2:[{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'100',
			},{
                prop:"period",
                label:this.$t('mix.table_period'),
                width:'100',
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
                width:'150',
			}],
            ajaxTitles3:[{
                prop:"created_at",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"status",
                label:this.$t('mix.table_consumption_type'),
                width:'120',
			},{
                prop:"master_id",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"value",
                label:this.$t('mix.table_expense'),
                width:'120',
			},{
                prop:"after_amount",
                label:this.$t('mix.table_expense'),
                width:'120',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'120',
			}],
            postForm:{
				password: "",
                confirm_password: "",
                is_view_other: '',
                status: '',
				security: "",
				userDetails: "",
				name:[],
				selectedIds:[],
			},
			postForm:{},
			modalList:{},
            agentDetail:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			categoryList: [],
			securityCheck: 0
		};
	},
	methods:{
        getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.searchData.agent_id = storeTempID.agent_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agentinfo',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.agentDetail = data.agentDetails
				}
				this.initial()
			})

		},
		initial(){
            this.loading = true
			this.searchData.agent_id = storeTempID.agent_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agentinfo/ajaxTableOrder',this.postData)
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
			this.postForm.code = ""
			this.postForm.group_id = ""
			this.postForm.group_name = ""
			this.postForm.username = ""
			this.postForm.account_package_id = ""
			this.postForm.status = 1
			this.postForm.img_url = ''
			this.imagePickerFileUrl = ''
			this.imagePickerFile = ''
			this.postForm.security = ""
			this.postForm.userDetails = ""
			
			if(done != undefined){
				done()
			}
		},resetPasswordRow(id) {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.master_id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/agent/agentinfo/resetPassword", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},editRow() {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
                this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/agent/agentinfo/DBresetPassword",this.postData)

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
		},loadTable(tab){
            this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
            this.searchData.agent_id = storeTempID.agent_id
            this.searchData.master_id = storeTempID.master_id
            let table;
            let data;
            if(tab.index == 0){
                table = 'management/agent/agentinfo/ajaxTableOrder';
            }else if(tab.index == 1){
                table = 'management/agent/agentinfo/ajaxTableClient';
            }else if(tab.index == 2){
                table = 'management/agent/agentinfo/ajaxTableSetting';
            }else if(tab.index == 3){
                table = 'management/agent/agentinfo/ajaxTableExpense';
            }
            var result = this.$m.postMethod(table,this.postData)
            
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
        },ajaxTableOrder(){
            this.loading = true
			this.searchData.agent_id = storeTempID.agent_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agentinfo/ajaxTableOrder',this.postData)
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
        },toAgentPage(){
			this.$router.push('/management/admin/agent');
		},getOrderRow(){
            
        },getClientPage(master_id){
            this.$router.push('/management/admin/clientinfo');
			storeTempID.master_id = master_id
        },getAddRow(){
			if(this.$p.permissionChecker('adminAdminAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/product/item/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.attributeList = data.attributeList
						this.postForm.attribute_list = this.attributeList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('adminAdminAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('package/product/item/DBadd',this.postData)

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
		},userStatusRow(id,status){
			if(this.$p.permissionChecker('toolAttributeEdit') && this.loading == false){
                this.loading = true
                if(status == 'suspended'){this.$confirm(this.$t('msg.msg_suspend_account'), this.$t('msg.suspended'), {
						confirmButtonText: this.$t('button.yes'),
						cancelButtonText: this.$t('button.no'),
						customClass: 'input-dialog',
						showInput: (this.securityCheck == 1), 
						inputPlaceholder: this.$t('mix.table_security'),
						inputType: 'password',
					}).then(({value}) => {
                        this.loading = true
                        this.submitForm.master_id = id;
                        this.submitForm.status = status;
                        this.postData.data = JSON.stringify(this.submitForm)
                        
                        var formData = new FormData();
                        formData.append('data', this.postData.data);
                        formData.append('language', this.postData.language);
        
                        
                        var result = this.$m.postMethod('management/agent/agentinfo/DBstatus',formData)
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
                        this.getInitial()
                        this.loading = false
                        });

                    })
                }else{
                    this.submitForm.master_id = id;
                    this.submitForm.status = status;
                    this.postData.data = JSON.stringify(this.submitForm)
                    
                    var formData = new FormData()
                    formData.append('data', this.postData.data)
                    formData.append('language', this.postData.language)

                    var result = this.$m.postMethod('management/agent/agentinfo/DBstatus',formData)
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
                        this.getInitial()
                        this.loading = false
                    });
                }
			};
		},viewOtherRow(id,is_view_other){
			if(this.$p.permissionChecker('toolAttributeEdit') && this.loading == false){
                this.loading = true
				this.submitForm.master_id = id
				this.submitForm.is_view_other = is_view_other
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/agent/agentinfo/DBviewOther',formData)
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
		},statusRow(masterID){
			if(this.$p.permissionChecker('userMemberStatus') && this.loading == false){
				this.loading = true
				this.$confirm(this.$t('msg.msg_confirmation'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.yes'),
					cancelButtonText: this.$t('button.no'),
					customClass: 'input-dialog',
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({value}) => {
					this.preloader(true)
					this.postForm.security = value
					this.postForm.master_id = masterID
					this.postData.data = JSON.stringify(this.postForm)

					var result = this.$m.postMethod('management/admin/admin/DBstatus',this.postData)

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
		},pageRow(){
			if(this.$p.permissionChecker('toolSystemPage')){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postPageForm)
				var result = this.$m.postMethod('app/tools/systems/DBpage',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						
						this.modalList.pageRow = false
						this.clearPostForm()
						this.clearPageForm()
						this.initial()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				})
			}
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
        if(storeTempID.agent_id == "" || storeTempID.agent_id == undefined){
			this.$router.push('/management/admin/agent');
		}else{
            this.getInitial()
        }
	}
}
</script>