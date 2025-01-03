<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_admin_admin')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('adminAdminAdd')">{{$t('menu.management_product_item_add')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" value="0">{{$t('mix.table_disabled')}}</el-option>
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
					
					<el-table-column v-for="title in ajaxTitles" :prop="title.prop" :label="title.label" :key="title.prop" :min-width="title.width" :align="title.align" :type="title.type">
						<template #header>
							<div>
								{{title.label}}
								<el-tooltip>
									<template #content>
										<div v-html="amountHoverDesc"></div>
									</template>
									<i style="margin-left: 5px;" v-if="title.prop === 'amount'" class="far fa-exclamation-circle"></i>
								</el-tooltip>
							</div>
						</template>
						<template v-if="title.prop == 'status'" #default="scope">
							<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" :disabled="scope.row.is_edit === false"  @change="statusRow(scope.row.id,scope.row.status)"></el-switch>
						</template>

						<template v-if="title.prop == 'action'" #default="scope">
							<el-button v-if="$p.permissionChecker('adminAdminEdit')" class="custom-button primary" @click="getEditRow(scope.row.id)">{{$t('menu.management_product_item_edit')}}</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_product_item_add')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-row :gutter="20">
						<el-col :sm="12" class="mt-2">
							<el-checkbox v-model="postForm.is_all_agent">{{$t('mix.table_is_all_agent')}}</el-checkbox>
						</el-col>
						<el-col :sm="12" class="mt-2">
							<el-checkbox v-model="postForm.is_eligible">{{$t('mix.table_is_eligible')}}</el-checkbox>
						</el-col>
					</el-row>
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_product_item_edit')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="12" class="mt-2">
						<el-checkbox v-model="postForm.is_all_agent">{{$t('mix.table_is_all_agent')}}</el-checkbox>
					</el-col>
					<el-col :sm="12" class="mt-2">
						<el-checkbox v-model="postForm.is_eligible">{{$t('mix.table_is_eligible')}}</el-checkbox>
					</el-col>
				</el-row>
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
                prop:"name",
                label:this.$t('mix.table_name'),
				align:'center',
                width:'100',
			},{
                prop:"period",
                label:this.$t('mix.table_period'),
				align:'center',
                width:'100',
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
				align:'center',
                width:'150',
			}],
			postForm:{
				status:'',
				name:'',
				attribute_list:[],
				period:0,
				multiple_language:1,
				name:[],
				single_name:'',
				status:'',
				is_all_agent:0,
				is_eligible:0,
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
            searchProductList: [],
            streamerList: [],
			modalList:{},
			securityCheck: 0,
			attributeList:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			amountHoverDesc:'',
		}
	},
	methods:{
		getInitial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('package/product/item',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.searchProductList = data.productList
					this.amountHoverDesc = data.content
					this.initial()
				}
				this.loading = false
			})
		},initial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('package/product/item/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)

					this.ajaxTitles = [{
						prop: "name",
						label: this.$t('mix.table_name'),
						width:'105',
						align:'center',
					},{
						prop:"period",
						label:this.$t('mix.table_period'),
						width:'100',
						align:'center',
					},{
						prop:"amount",
						label:this.$t('mix.table_amount'),
						width:'150',
						align:'center',
					}]
					
					data.attributeList.forEach((element) => {
						this.tempTitle = {}
						this.tempTitle.prop = element.name
						this.tempTitle.label = element.name
						this.tempTitle.width = element.width
						this.tempTitle.align = 'center'
						this.ajaxTitles.push(this.tempTitle)
					})
					this.tempTitle = {}
					this.tempTitle.prop = "status",
					this.tempTitle.label = this.$t('mix.table_status'),
					this.tempTitle.width = 100
					this.tempTitle.align = 'center'
					this.ajaxTitles.push(this.tempTitle)

					this.tempTitle = {}
					this.tempTitle.prop = "action",
					this.tempTitle.label = this.$t('mix.table_action'),
					this.tempTitle.width = 130
					this.tempTitle.align = 'center'
					this.ajaxTitles.push(this.tempTitle)
				}
				this.loading = false
			})
		},clearPostForm(done){
			this.postForm.name=''
			this.postForm.status='',
			this.postForm.attribute_list=[],
			this.postForm.period=0,
			this.postForm.multiple_language=1,
			this.postForm.period=[],
			this.postForm.single_name='',
			this.postForm.is_all_agent=0,
			this.postForm.is_eligible=0,
			
			this.postPermission.master_id = ''
			this.postPermission.permission = []
			
			if(done != undefined){
				done()
			}
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
		},getEditRow(id){
			if(this.$p.permissionChecker('adminAdminEdit') && this.loading == false){
				this.loading = true

				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('package/product/item/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						// this.postForm.is_all_agent = parseInt(data.thisDetail.is_all_agent)
						// this.postForm.is_eligible = parseInt(data.thisDetail.is_eligible)
						
						if(this.postForm.is_all_agent == 1){
							this.postForm.is_all_agent = true
						}else{
							this.postForm.is_all_agent = false
						}

						if(this.postForm.is_eligible == 1){
							this.postForm.is_eligible = true
						}else{
							this.postForm.is_eligible = false
						}

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

                var result = this.$m.postMethod('package/product/item/DBedit',this.postData)

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
		},statusRow(id, status){
			if(this.$p.permissionChecker('userMemberStatus') && this.loading == false){
				this.loading = true
				let confirmationTitle = '';
				let confirmationMessage = '';
				let confirmButtonName = '';
				let cancelButtonName = '';

				if (status == 1) {
					confirmationTitle = this.$t('msg.prompt');
					confirmationMessage = this.$t('msg.msg_confirmation');
					confirmButtonName = this.$t('button.yes');
					cancelButtonName = this.$t('button.no');
				} else if (status == 0) {
					confirmationTitle = this.$t('msg.stop_using');
					confirmationMessage = `${this.$t('msg.msg_status_off_desc_1')} <br><br> ${this.$t('msg.msg_status_off_desc_2')}`;
					confirmButtonName = this.$t('button.confirm');
					cancelButtonName = this.$t('button.cancel');
				}

				this.$confirm(confirmationMessage, confirmationTitle, {
					confirmButtonText: confirmButtonName,
					cancelButtonText: cancelButtonName,
					dangerouslyUseHTMLString: true,
					customClass: 'input-dialog',
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({value}) => {
					this.preloader(true)
					this.postForm.security = value
					this.postForm.id = id
					this.postForm.status = status
					this.postData.data = JSON.stringify(this.postForm)

					var result = this.$m.postMethod('package/product/item/DBstatus',this.postData)

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
					this.initial()        
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