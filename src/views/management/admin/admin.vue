<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_admin_admin')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('adminAdminAdd')">{{$t('menu.management_admin_admin_add')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" value="normal">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" value="suspended">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.role_id" :placeholder="$t('mix.table_role')" clearable @change="initial()" size="large">
							<el-option v-for="item in searchRoleList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
						
						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>
						
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
								<p class="p-0 m-0 mb-2">{{$t('mix.table_account_status')}}: 
									<el-tag v-if="scope.row.status == 'normal'" type="success">{{$t('mix.table_normal')}}</el-tag>
									<el-tag v-else type="danger">{{$t('mix.table_suspended')}}</el-tag>
								</p>
							</template>

							<template v-if="title.prop == 'streamer_login'" #default="scope">
								<p class="p-0 m-0">{{$t('mix.table_username')}}: {{scope.row.streamer_login}}</p>
								<p class="p-0 m-0">{{$t('mix.table_name')}}: {{scope.row.streamer_name}}</p>
							</template>

							<template v-if="title.prop == 'last_login'" #default="scope">
								<p><small>IP: {{scope.row.last_ip}}</small></p>
								<p><small>{{ $t('mix.table_date') }}: {{scope.row.last_login}}</small></p>
							</template>
							
							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('adminAdminEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.master_id)">{{$t('menu.management_admin_admin_edit')}}</el-button>
								<!-- <el-button v-if="$p.permissionChecker('adminAdminRoom') && scope.row.is_streamer == true" class="custom-button success m-1" @click="storeTempID = scope.row.master_id,$router.push('/management/admin/room')">{{$t('menu.management_admin_admin_room')}}</el-button> -->
								<el-button v-if="$p.permissionChecker('adminAdminPassword')" class="custom-button primary m-1" @click="getPasswordRow(scope.row.master_id, scope.row.login)">{{$t('menu.management_admin_admin_password')}}</el-button>
								<el-button v-if="$p.permissionChecker('adminAdminSecurity') && securityCheck == 1" class="custom-button primary m-1" @click="getSecurityRow(scope.row.master_id, scope.row.login)">{{$t('menu.management_admin_admin_security')}}</el-button>
								<el-button v-if="$p.permissionChecker('adminAdminPermission')" class="custom-button warning m-1" @click="getPermissionRow(scope.row.master_id, scope.row.login)">{{$t('menu.management_admin_admin_permission')}}</el-button>
								<el-button v-if="$p.permissionChecker('adminAdminStatus')" class="custom-button m-1 " :class="(scope.row.status == 'normal') ? 'danger' : 'success'" @click="statusRow(scope.row.master_id)">
									<template v-if="scope.row.status == 'normal'">
										{{$t('menu.management_user_member_suspended')}}
									</template>
									
									<template v-else>
										{{$t('menu.management_user_member_normal')}}
									</template>
								</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_admin_admin_add')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username" :placeholder="$t('mix.table_username')" />
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')"  />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_phone_mobile')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.phone_mobile" :placeholder="$t('mix.table_phone_mobile')"  />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_email')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.email" :placeholder="$t('mix.table_email')"  />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.password" :placeholder="$t('mix.table_password')"  />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_security" :placeholder="$t('mix.table_security')"  />
					</el-col>

					<el-col :sm="24" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.status" :placeholder="$t('msg.msg_select')" filterable>
							<el-option :label="$t('mix.table_normal')" :value="'normal'">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="'suspended'">{{$t('mix.table_suspended')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_role')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.role_id" :placeholder="$t('msg.msg_select')" filterable>
							<el-option v-for="(list,index) in roleList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
						</el-select>
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_admin_admin_edit')" :before-close="clearPostForm" class="dialog-md">
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
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_phone_mobile')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.phone_mobile" :placeholder="$t('mix.table_phone_mobile')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_email')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.email" :placeholder="$t('mix.table_email')" />
					</el-col>

					<el-col :sm="24" class="mb-3" >
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
		
		<el-dialog v-model="modalList.passwordRow" :title="$t('menu.management_admin_admin_password')" :before-close="clearPostForm">
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

		<el-dialog v-model="modalList.securityRow" :title="$t('menu.management_admin_admin_security')" :before-close="clearPostForm">
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
		
		<el-dialog v-model="modalList.permissionRow" :title="$t('menu.management_admin_admin_permission')" class='dialog-md' :before-close="clearPostForm">
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
                width:'100',
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'100',
			},{
                prop:"role_id",
                label:this.$t('mix.table_role'),
                width:'180',
			},{
                prop:"last_login",
                label:this.$t('mix.table_last_login'),
                width:'250',
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
                width:'150',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'250',
				align: 'right'
			}],
			postForm:{
				member:'',
				remark:'',
				username:'',
				name:'',
				phone_mobile:'',
				email:'',
				role_id:'',
				room_id:'',
				is_live:1,
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
            superAdmin: '',
            roomList: [],
            roleList: [],
            searchRoleList: [],
            streamerList: [],
			modalList:{},
			securityCheck: 0,
		}
	},
	methods:{
		getInitial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/admin/admin',this.postData)
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
			var result = this.$m.postMethod('management/admin/admin/ajaxTable',this.postData)
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
			this.postForm.login=''
			this.postForm.name=''
			this.postForm.username=''
			this.postForm.phone_mobile=''
			this.postForm.email=''
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
			if(this.$p.permissionChecker('adminAdminAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/admin/admin/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.streamerList = data.streamerList
						this.roleList = data.roleList
						this.roomList = data.roomList
						this.postForm.role_id = data.defaultRole
						this.defaultRole = data.defaultRole
						this.superAdmin = data.superAdmin
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

                var result = this.$m.postMethod('management/admin/admin/DBadd',this.postData)

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
		},getEditRow(masterID){
			if(this.$p.permissionChecker('adminAdminEdit') && this.loading == false){
				this.loading = true

				this.submitForm.master_id = masterID
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/admin/admin/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.defaultRole = data.defaultRole
						this.superAdmin = data.superAdmin
						this.streamerList = data.streamerList
						this.roomList = data.roomList
						
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('adminAdminEdit') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/admin/admin/DBedit',this.postData)

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
		},getPasswordRow(masterID, username){
			if(this.$p.permissionChecker('adminAdminPassword')){
				this.modalList.passwordRow = true
				this.postForm.username = username
				this.postForm.master_id = masterID
			}
		},passwordRow(){
			if(this.$p.permissionChecker('adminAdminPassword') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/admin/admin/DBpassword',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.passwordRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    
                    this.loading = false
                    this.preloader(false)
                })
			}
		},getSecurityRow(masterID, username){
			if(this.$p.permissionChecker('adminAdminSecurity')){
				this.modalList.securityRow = true
				this.postForm.username = username
				this.postForm.master_id = masterID
			}
		},securityRow(){
			if(this.$p.permissionChecker('adminAdminSecurity') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/admin/admin/DBsecurity',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.securityRow = false
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
			
		},getPermissionRow(id, login) {
			if(this.$p.permissionChecker('adminAdminPermission') && this.loading == false){
				this.loading = true;
				this.submitForm.master_id = id
				this.postForm.username = login
				this.postPermission.master_id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/admin/admin/permission", this.postData)
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
			if(this.$p.permissionChecker('adminAdminPermission') && this.loading == false){
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
					var result = this.$m.postMethod("management/admin/admin/DBpermission", this.postData)

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
		},roomPaginationChange(value){
			if(value.page != ""){
				this.roomSearchData.pagination = value.page
			}

			if(value.limit != ""){
				this.roomSearchData.limit = value.limit
			}
			
			this.initial()
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")	
			}
			
			return value
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('imgFile').value = ''
		},openImage(){
			document.getElementById('imgFile').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('imgFile').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('imgFile').files[0])
		},initialCover(){
			this.coverPickerFile = ''
			this.coverPickerFileUrl = ''
			document.getElementById('coverFile').value = ''
		},openCover(){
			document.getElementById('coverFile').click()
		},coverChange(){
			this.coverPickerFile = document.getElementById('coverFile').files[0];
			this.coverPickerFileUrl = URL.createObjectURL(document.getElementById('coverFile').files[0])
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
}
</script>