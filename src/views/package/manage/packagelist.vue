<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_package')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true, genPrivateKey(),genPrivateIv()" :loading="loading" v-if="$p.permissionChecker('packageManageListAdd')">{{$t('menu.app_tools_package_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('packageManageListDelete')">{{$t('menu.app_tools_package_delete')}}</el-button>
			</div>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_account')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_account')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.package_id" :placeholder="$t('mix.table_please_select')+$t('mix.table_package')" clearable @change="initial()">
							<el-option v-for="(item,index) in searchPackageList" :key="index" :label="item.name" :value="item.id" >{{item.name}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.sales_type" :placeholder="$t('mix.table_please_select')+$t('mix.table_sales_type')" clearable @change="initial()">
							<el-option v-for="(item,index) in searchSalesTypeList" :key="index" :label="item.name" :value="item.id" >{{item.name}}</el-option>
						</el-select>
						
                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.created_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_created_at')" @change="initial()" size="large"/>
						</div>
						
						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.completed_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_completed_at')" @change="initial()" size="large"/>
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
									<p class="p-0 m-0">{{$t('mix.table_created_at')}} : </p></br><p>{{scope.row[title.prop]}}</p>
									<p class="p-0 m-0">{{$t('mix.table_completed_at')}} : </p></br><p>{{scope.row.completed_at}}</p>
								</div>
							</template>

							<template v-if="title.prop == 'private_key'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{$t('mix.table_private_key')}} : {{scope.row[title.prop]}}</p>
									<p class="p-0 m-0">{{$t('mix.table_private_iv')}} : {{scope.row.private_iv}}</p>
								</div>
							</template>

							<template v-if="title.prop == 'last_active'" #default="scope">
								<p><small>IP: {{scope.row.last_active_ip}}</small></p>
								<p><small>{{ $t('mix.table_date') }}: {{scope.row.last_active}}</small></p>
							</template>

							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('packageManageListEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('packageManageListEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('packageManageListDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_package_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<div class="mb-3 d-flex justify-content-between">
					<el-col :sm="15" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.user')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('general.user')" :disabled="searchFieid"/>
					</el-col>
					<div class="d-flex mt-4" :sm="12">
						<el-button class="custom-button warning font-8 pt-3 pb-3" @click="searchUser(),genPrivateKey(),genPrivateIv()" :loading="loading" size="large">{{$t('button.search')}}</el-button>
						<el-button class="custom-button danger font-8 pt-3 pb-3" @click="clearPostForm(),postForm.login='',searchFieid=false" size="large">{{$t('button.reset')}}</el-button>
					</div>
				</div>
				<template v-if="userDetails.login !== ''">
						<el-row :gutter="20">

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.user')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('general.user')"  disabled/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')"  disabled/>
						</el-col>

						<el-col :xs="24" :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_private_key')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.private_key" :placeholder="$t('mix.table_private_key')" >
								<template #prepend>
									<el-button @click="genPrivateKey()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
								</template>
							</el-input>
						</el-col>

						<el-col :xs="24" :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_private_iv')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.private_iv" :placeholder="$t('mix.table_private_iv')" >
								<template #prepend>
									<el-button @click="genPrivateIv()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
								</template>
							</el-input>
						</el-col>
						
						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sales_type')}}</label>
							<el-select class="custom-input mt-1 w-100" v-model="postForm.sales_type" :placeholder="$t('mix.table_sales_type')" size="large">
								<el-option v-for="(list,index) in salesTypeList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
							</el-select>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_package')}}</label>
							<el-select class="custom-input mt-1 w-100" v-model="postForm.package_id" :placeholder="$t('mix.table_package')" size="large">
								<el-option v-for="(list,index) in packageList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
							</el-select>
						</el-col>
						
						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
							<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
								<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
								<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
							</el-select>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sales_value" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
						</el-col>

						<el-col :span="24" class="mb-3">
							<label class="text-theme font-8 fw-bold">{{$t('mix.table_remark')}}</label>
							<el-input class="custom-input mt-1" type='textarea' v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
						</el-col>

						<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
						</el-col>
						
						<div style="width: 100%;">
							<div class="d-flex justify-content-center align-item-center">
								<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
								<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
							</div>
						</div>
					</el-row>
				</template>
			</el-form>
			
		</el-dialog>

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_event_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_login')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_login')" disabled/>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" disabled/>
					</el-col>

					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_private_key')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.private_key" :placeholder="$t('mix.table_private_key')" >
							<template #prepend>
								<el-button @click="genPrivateKey()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>

					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_private_iv')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.private_iv" :placeholder="$t('mix.table_private_iv')" >
							<template #prepend>
								<el-button @click="genPrivateIv()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>
                    
                    <el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sales_type')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.sales_type" :placeholder="$t('mix.table_sales_type')" disabled/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.sales_value" :placeholder="$t('mix.table_price')" disabled/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_package')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.package_id" :placeholder="$t('mix.table_package')" disabled/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
					</el-col>

					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" type='textarea' v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
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
                prop:"created_at",
                label:this.$t('mix.table_date'),
                width:'150',
			},{
                prop:"login",
                label:this.$t('mix.table_account'),
                width:'100',
			},{
                prop:"code",
                label:this.$t('mix.table_code'),
                width:'90',
			},{
                prop:"sales_value",
                label:this.$t('mix.table_price'),
                width:'80',
			},{
                prop:"package",
                label:this.$t('mix.table_package'),
                width:'130',
			},{
                prop: "private_key",
                label: this.$t('mix.table_api'),
                width:'220',
				align:'left'
			},{
                prop:"sales_type",
                label:this.$t('mix.table_sales_type'),
                width:'120',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'100',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'200',
				align: 'center'
			}
			],
			loginAjaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'60',
			}],
			postForm: {
				attribute: "",
                code: "",
				master: "",
				login: "",
				name: "",
                created_at: "",
                completed_at: "",
				category: "",
				package_id: "",
				sales_type: "",
				private_key: "",
				private_iv: "",
				sort: 100,
				status: "",
				sales_value: 0,
				security: "",
				userDetails: "",
				name:[],
				selectedIds:[],
			},
			modalList:{},
			userDetails: {
				login: '',
				name: ''
			},
			securityCheck: 0,
			searchPackageList:[],
			attributeList: [],
			categoryList: [],
			salesTypeList: [],
			masterList: [],
			packageList: [],
			searchUserDetails:[],
			searchSalesTypeList: [],
			searchStatusList: [],
            searchAttributeList: [],
			searchCategoryList: [],
			postPermission: {},
			securityCheck: 0
		}
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('package/manage/package',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.searchPackageList = data.packageList
					this.searchSalesTypeList = data.salesTypeList
					this.searchCategoryList = data.categoryList
					this.searchAttributeList = data.attributeList
				}
				this.initial()
			})

		},initial(){

			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('package/manage/package/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
			})
		},clearPostForm(done){
			this.postForm.code = ""
			this.postForm.sort = 100
			this.postForm.userDetails = ""
			this.postForm.searchField = ""
			this.postForm.name = ""
			this.postForm.master = ""
			this.postForm.login = ""
			this.postForm.package_id = ""
			this.postForm.sales_type = ""
			this.postForm.sales_value = ""
			this.postForm.private_key = ""
			this.postForm.private_iv = ""
            this.postForm.created_at = ""
            this.postForm.completed_at = ""
			this.postForm.status = ''
			this.postPermission.permission = []
			this.userDetails.login = ''
			this.userDetails.name = ''
			this.searchFieid = false
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('packageManageListAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/manage/package/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.packageList = data.packageList
						this.searchUserDetails = data.userDetails
						this.masterList = data.masterList
						this.salesTypeList = data.salesTypeList
						this.attributeList = data.attributeList
						this.categoryList = data.categoryList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('packageManageListAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
				
                this.postData.data = JSON.stringify(this.postForm)
                var result = this.$m.postMethod('package/manage/package/DBadd',this.postData)

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
			if((this.$p.permissionChecker('packageManageListEdit')) && this.loading == false){
				this.loading = true

				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('package/manage/package/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.masterList = data.masterList
						this.salesTypeList = data.salesTypeList
						this.attributeList = data.attributeList
						this.categoryList = data.categoryList
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if((this.$p.permissionChecker('packageManageListEdit')) && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('package/manage/package/DBedit',this.postData)
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
		},deleteRow(id) {
			if(this.$p.permissionChecker('packageManageListDelete') && this.loading == false){
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
						var result = this.$m.postMethod("package/manage/package/DBdelete", this.postData);
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
		},statusRow(currentData){
			if(this.$p.permissionChecker('packageManageListEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('package/manage/package/DBstatus',formData)
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
		},searchUser(){
			if(this.$p.permissionChecker('packageManageListAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/manage/package/DBsearchUser',this.postData)
				result.then((value) => {
					var data = value.userDetails
					
					if(value.userDetails){
						this.userDetails = data
						this.postForm.login = data.login
						this.postForm.name = data.name
						this.searchFieid=true
					}
					else{
                        this.$m.popupErrorMessage(value.data.returnMsg,this)
                    }
				})
				this.userDetails.login = ''
				this.userDetails.name = ''
				this.clearPostForm()
				this.loading = false
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
		},genPrivateKey(){
			this.postForm.private_key = this.$m.genPrivateKey(16)
		},genPrivateIv(){
			this.postForm.private_iv = this.$m.genPrivateKey(16)
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
