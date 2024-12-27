<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_chat_groupmember')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('menu.management_chat_groupmember_add')}}</el-button>
				<!-- <el-button class="custom-button plain" @click="kickUserRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolSettingAdd')">{{$t('menu.management_chat_groupmember_kick')}}</el-button> -->
			</div>
		</div>

		<div class="page-body p-3">	
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_group_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.username" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.group_name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_group_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_group_name')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.role" :placeholder="$t('mix.table_please_select')+$t('mix.table_role')" clearable @change="initial()">
							<el-option v-for="(item,index) in searchRoleList" :key="index" :label="item.code" :value="item.id" >{{item.code}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_account_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_active')" :value="1">{{$t('mix.table_active')}}</el-option>
							<el-option :label="$t('mix.table_leave_group')" :value="0">{{$t('mix.table_leave_group')}}</el-option>
						</el-select>

						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.join_at" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>
						
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>

					<el-table-column type="selection" width="55"></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>

							<template v-if="title.prop == 'created_at'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{$t('mix.table_join_at')}} : </p></br><p>{{scope.row.created_at}}</p>
								</div>
							</template>
 						
							<template v-if="title.prop == 'is_ban'" #default="scope">
								<el-switch v-model="scope.row.is_ban" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('userChatRoleEdit')) ? false : true"></el-switch>
							</template>	

							<template v-if="title.prop == 'is_chat'" #default="scope">
								<el-switch v-model="scope.row.is_chat" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('userChatRoleEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolSettingAdd'),scope.row.status == 'Active'&& scope.row.role_id == 'member'" class="custom-button danger m-1" @click="kickUserRow(scope.row.id)">{{$t('button.kickuser')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_role_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_chat_group')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.chat_group" :placeholder="$t('menu.management_chat_group')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_chat_groupmember')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.chat_group_member" :placeholder="$t('menu.management_chat_groupmember')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_chat_role')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.chat_role" :placeholder="$t('menu.management_chat_role')" size="large">
							<el-option v-for="(list,index) in searchRoleList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_chat') + ' ' + $t('mix.table_permission')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_chat" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_chat_is_ban')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_ban" size="large">
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_role_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_chat') + ' ' + $t('mix.table_permission')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_chat" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_call') + ' ' + $t('mix.table_permission')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_call" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_upload') + ' ' + $t('mix.table_permission')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_upload" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language" size="large">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
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
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="editRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.editRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import { accountDetail } from '@/system/store/state.js'
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
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
			searchFieid: false,
			submitForm: {
				id:'',
				security:""
			},
			postData: {
				data: '',
				language: '',
			},
			searchData: Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'80',
				align: 'center'
			},{
                prop:"created_at",
                label:this.$t('mix.table_date'),
                width:'120',
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'100',
				align: 'center'
			},{
                prop:"username",
                label:this.$t('mix.table_username'),
                width:'110',
				align: 'center'
			},{
                prop:"chat_group_id",
                label:this.$t('mix.table_group_name'),
                width:'120',
				align: 'center'
			},{
                prop:"role_id",
                label:this.$t('mix.table_role'),
                width:'80',
				align: 'center'
			},{
                prop:"is_chat",
                label:this.$t('mix.table_is_chat'),
                width:'80',
				align: 'center'
			},{
                prop:"is_ban",
                label:this.$t('mix.table_is_ban'),
                width:'80',
				align: 'center'
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
                width:'100',
				align: 'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'200',
				align: 'center'
			}],
			loginAjaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'60',
			}],
			postForm: {
				chat_group: "",
				chat_group_member: "",
				chat_role: "",
				is_chat: "",
				is_ban: "",
				status: "",
				security: "",
				userDetails: "",
				name:[],
				selectedIds:[],
			},
			modalList:{},
			securityCheck: 0,
            statusList:[],
			attributeList: [],
			searchRoleList: [],
			searchStatusList: [],
            searchAttributeList: [],
			postPermission: {},
			securityCheck: 0
		}
	},
	methods:{
		getInitial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/chat/member',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.searchRoleList = data.roleList
					this.initial()
				}
				this.loading = false
			})
		},initial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/chat/member/ajaxTable',this.postData)
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
			this.postForm.chat_group = ""
			this.postForm.chat_group_member = ""
			this.postForm.chat_role = ""
			this.postForm.is_chat = ""
			this.postForm.is_ban = ""
			this.postForm.status = ""
			this.postForm.security = ""
			this.postForm.userDetails = ""
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('toolAttributeAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/chat/member/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.searchRoleList = data.roleList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow() {
			if(this.$p.permissionChecker('userChatRoleAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/chat/member/DBadd", this.postData)

				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.$message({
							message: data.returnMsg,
							type: "success"
						});
						
						this.modalList.addRow = false
						this.clearPostForm()
						this.initial()
					} else {
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				});
			}
		},getEditRow(id) {
			if(this.$p.permissionChecker('userChatRoleEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id;
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/chat/member/edit", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.postForm = data.thisDetail
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.status = parseInt(data.thisDetail.status)
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},
		editRow() {
			if(this.$p.permissionChecker('userChatRoleEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/chat/member/DBedit", this.postData)

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
			if(this.$p.permissionChecker('userChatRoleEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.submitForm.is_chat = currentData.is_chat
				this.submitForm.is_ban = currentData.is_ban
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/chat/member/DBstatus',formData)
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
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}

			this.initial()
		},paginationLoginChange(value){
			if(value.page != ""){
				this.searchLoginForm.pagination = value.page
			}

			if(value.limit != ""){
				this.searchLoginForm.limit = value.limit
			}

			this.loginInitial()
		},clearSearchForm(){
			this.searchData = Object.assign({}, searchForm)
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.initial()
		},handleCheckChange(node, checked){
			if(checked){
				this.postPermission.permission.push(node.id)
			}else{
				const index = this.postPermission.permission.indexOf(node.id)
				if(index !== -1){
					this.postPermission.permission.splice(index, 1)
				}
			}
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id)
			console.log(selection.map((row) => row.id));
			
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
}
</script>
