<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_admin_agent')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('userChatRoleEdit')">{{$t('menu.management_admin_agent_add')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" value="normal">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" value="suspended">{{$t('mix.table_disabled')}}</el-option>
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
								<el-tag v-if="scope.row.status == 'normal'" type="success">{{$t('mix.table_normal')}}</el-tag>
								<el-tag v-else type="danger">{{$t('mix.table_suspended')}}</el-tag>
							</template>
							
							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.agent_id,scope.row.master_id)">{{$t('button.info')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_admin_agent_add')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.agent_id" :placeholder="$t('mix.table_account')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.password" :placeholder="$t('mix.table_password')"  />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password_confirm')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.confirm_password" :placeholder="$t('mix.table_new_password_confirm')"  />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.package_setting_product')}}</label>
						<div v-for="(list,index) in productList" :key="index" :label="list.name" :value="list.id">
							<el-checkbox v-model="checked3" :label="list.name" />
						</div>
						
						<template #footer>
							<div class="d-flex justify-content-center align-item-center">
								<el-button class="custom-button success font-8 pt-3 pb-3" @click="permissionRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
								<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.permissionRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
							</div>
						</template>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_agent_payment_method')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.payment_method" :placeholder="$t('menu.management_agent_payment_method')" size="large">
							<el-option v-for="(list,index) in paymentList" :key="index" :label="list.name" :value="list.value">{{list.name}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mt-4">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_agent_is_view_other')}}</label>
						<div>
							<el-switch v-model="postForm.is_view_other" active-value="1" inactive-value="0"></el-switch>
						</div>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_agent_repayment_method')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.repayment_method" :placeholder="$t('menu.management_agent_repayment_method')" size="large">
							<el-option v-for="(list,index) in paymentList" :key="index" :label="list.name" :value="list.value">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mt-4">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<div>
							<el-switch v-model="postForm.status" active-value="1" inactive-value="0"></el-switch>
						</div>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_your_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_your_security')" />
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_admin_agent_edit')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_username')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_service_text')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.service_text" :placeholder="$t('mix.table_service_text')"  />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="$p.permissionChecker('adminAgentStatus')">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.status" :placeholder="$t('msg.msg_select')" filterable>
							<el-option :label="$t('mix.table_normal')" :value="'normal'">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="'suspended'">{{$t('mix.table_suspended')}}</el-option>
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
		
		<el-dialog v-model="modalList.passwordRow" :title="$t('menu.management_admin_agent_password')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>	
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username" :placeholder="$t('mix.table_username')" disabled="disabled" />
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_password" :placeholder="$t('mix.table_new_password')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="passwordRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.passwordRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.securityRow" :title="$t('menu.management_admin_agent_security')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>	
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username" :placeholder="$t('mix.table_username')" disabled="disabled" />
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_security" :placeholder="$t('mix.table_new_security')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_your_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_your_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="securityRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.securityRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>
		
		<el-dialog v-model="modalList.permissionRow" :title="$t('menu.management_admin_agent_permission')" class='dialog-md' :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username" :placeholder="$t('mix.table_username')" disabled="disabled" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
					
				<el-tree ref="permissionTree" :data="permissionList" :default-expand-all="true" :check-strictly="true" show-checkbox node-key="id" :default-checked-keys="postPermission.permission" :props="defaultProps" @check-change="handleCheckChange"/>
			</el-form>
			
			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="permissionRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.permissionRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import Tinymce from '@/components/tinymce/index.vue'
import { storeTempID } from '@/system/store/state.js'
</script>

<script>

let searchForm = {
	pagination: 1,
	limit: 10,
}
			
export default{
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
                width:'50',
			},{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'90',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'80',
			},{
                prop:"total_order",
                label:this.$t('mix.table_total_order'),
                width:'90',
				align: 'center',
			},{
                prop:"total_client",
                label:this.$t('mix.table_total_client'),
                width:'90',
				align: 'center'
			},{
                prop:"total_loan",
                label:this.$t('mix.table_total_loan')+' NT$',
                width:'100',
				align: 'center'
			},{
                prop:"total_repay",
                label:this.$t('mix.table_total_repay')+' NT$',
                width:'130',
				align: 'center'
			},{
                prop:"total_overdue",
                label:this.$t('mix.table_total_overdue'),
                width:'100',
				align: 'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
			postForm:{
				sponsor:'',
				member:'',
				remark:'',
				username:'',
				name:'',
				manage:[],
				status:'normal',
				new_password:'',
				new_security:''
			},
			permissionList:[],
			postPermission:{
				master_id:'',
				permission:[],
			},
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
            defaultRole: '',
			productList: [],
            agentList: [],
            searchAgentList: [],
            streamerList: [],
			modalList:{},
			securityCheck: 0,
		}
	},
	methods:{
		getInitial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agent',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.searchAgentList = data.agentList
					this.initial()
				}
				this.loading = false
			})
		},initial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agent/ajaxTable',this.postData)
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
			this.postForm.sponsor=''
			this.postForm.login=''
			this.postForm.name=''
			this.postForm.username=''
			this.postForm.service_url=''
			this.postForm.service_text=''
			this.postForm.password=''
			this.postForm.security=''
			this.postForm.room_id=''
			this.postForm.is_live=1
			this.postForm.manage=[]
			this.postForm.status='normal'
			
			this.postForm.new_password=''
			this.postForm.new_security=''

			this.postPermission.master_id = ''
			this.postPermission.permission = []
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('userChatRoleEdit') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/agent/agent/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.productList = data.productList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('userChatRoleEdit') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/agent/agent/DBadd',this.postData)

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

					var result = this.$m.postMethod('management/agent/agent/DBstatus',this.postData)

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
			
		},getPermissionRow(id, login) {
			if(this.$p.permissionChecker('adminAgentPermission') && this.loading == false){
				this.loading = true;
				this.submitForm.master_id = id
				this.postForm.username = login
				this.postPermission.master_id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/agent/agent/permission", this.postData)
				result.then((value) => {
					var data = value.data

					if (value.valid) {
						this.postPermission.permission = data.permission
						this.permissionList = data.permissionList
						
						this.modalList.permissionRow = true
					}
					
					this.loading = false
				});
			}
		},permissionRow() {
			if(this.$p.permissionChecker('adminAgentPermission') && this.loading == false){
				this.loading = true;
				this.$confirm(this.$t('msg.msg_confirmation'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.yes'),
					cancelButtonText: this.$t('button.no'),
					customClass: 'input-dialog',
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({value}) => {
					this.preloader(true);
					this.postPermission.security = value
					this.postData.data = JSON.stringify(this.postPermission)
					var result = this.$m.postMethod("management/agent/agent/DBpermission", this.postData)

					result.then((value) => {
						var data = value.data

						if (value.valid) {
							this.$message({
								message: data.returnMsg,
								type: "success"
							});
							
							this.clearPostForm()
							this.modalList.permissionRow = false
							this.initial()
						} else {
							this.$m.popupErrorMessage(data.returnMsg,this)
						}

						this.loading = false
						this.preloader(false)
					})
				})
				.catch(() => {
					this.loading = false
				});
			}
		},handleCheckChange(node, checked){
			if(checked){
				this.postPermission.permission.push(node.id)
			}else{
				const index = this.postPermission.permission.indexOf(node.id)
				if(index !== -1){
					this.postPermission.permission.splice(index, 1)
				}
			}
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
		},getAgentRow(agent,master) {
			this.$router.push('/management/admin/agentorder');
			// this.$m.setItem('group_id',id)
			storeTempID.agent_id = agent
			storeTempID.master_id = master
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
}
</script>