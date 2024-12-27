<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_merchant')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true, genPrivateKey(),genPrivateIv()" :loading="loading" v-if="$p.permissionChecker('merchantMerchantAdd')">{{$t('menu.management_merchant_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('merchantMerchantDelete')">{{$t('menu.management_merchant_delete')}}</el-button>
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

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.type" :placeholder="$t('mix.table_please_select')+$t('mix.table_type')" clearable @change="initial()">
							<el-option v-for="(item,index) in searchAttributeList" :key="index" :label="item.name" :value="item.id" >{{item.name}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.status" :placeholder="$t('mix.table_please_select')+$t('mix.table_status')" clearable @change="initial()">
							<el-option v-for="(item,index) in searchStatusList" :key="index" :label="item.name" :value="item.id" >{{item.name}}</el-option>
						</el-select>

						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.start_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_start_at')" @change="initial()" size="large"/>
						</div>
						
						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.expired_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_expired_at')" @change="initial()" size="large"/>
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

							<template v-if="title.prop == 'start_at'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{$t('mix.table_created_at')}} : </p></br><p>{{scope.row.created_at}}</p>
									<p class="p-0 m-0">{{$t('mix.table_expired_at')}} : </p></br><p>{{scope.row.expired_at}}</p>
									<!-- <p class="p-0 m-0">{{$t('mix.table_start_at')}} : </p></br><p>{{scope.row[title.prop]}}</p> -->
									<!-- <p class="p-0 m-0">{{$t('mix.table_updated_at')}} : </p></br><p>{{scope.row.updated_at}}</p> -->
								</div>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('merchantMerchantEdit'),scope.row.isEdit" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('merchantMerchantDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_merchant_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
                <el-row :gutter="20">

                <el-col :sm="24" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
                    <el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
                </el-col>

                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_start_at')}}</label>
                    <el-date-picker class="custom-input mt-1" v-model="postForm.start_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_start_at')" @change="initial()" size="large"/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_expired_at')}}</label>
                    <el-date-picker class="custom-input mt-1" v-model="postForm.expired_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_expired_at')" @change="initial()" size="large"/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
                    <el-select class="custom-input mt-1 w-100" v-model="postForm.type" :placeholder="$t('mix.table_type')" size="large">
                        <el-option v-for="(list,index) in attributeList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
                    </el-select>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
                    <el-select class="custom-input mt-1 w-100" v-model="postForm.status" :placeholder="$t('mix.table_status')" size="large">
                        <el-option v-for="(list,index) in statusList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
                    </el-select>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
                    <el-input-number class="custom-input mt-1 w-100" v-model="postForm.subscription_fee" :min="0"/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
                    <el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
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
			</el-form>
			
		</el-dialog>

		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_merchant_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">

				<el-col :sm="24" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
                    <el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
                </el-col>

                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_start_at')}}</label>
                    <el-date-picker class="custom-input mt-1" v-model="postForm.start_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_start_at')" @change="initial()" size="large" disabled/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_expired_at')}}</label>
                    <el-date-picker class="custom-input mt-1" v-model="postForm.expired_at" type="datetime" range-separator="-" :placeholder="$t('mix.table_expired_at')" @change="initial()" size="large"/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
                    <el-input class="custom-input mt-1 w-100" v-model="postForm.subscription_fee" :min="0" disabled/>
                </el-col>

                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
                    <el-select class="custom-input mt-1 w-100" v-model="postForm.status" :placeholder="$t('mix.table_status')" size="large">
                        <el-option v-for="(list,index) in statusList" :key="index" :label="list.name" :value="list.name">{{list.name}}</el-option>
                    </el-select>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
                    <el-input class="custom-input mt-1 w-100" v-model="postForm.type" :min="0" disabled/>
                </el-col>
                
                <el-col :sm="12" class="mb-3">
                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
                    <el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
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
                prop:"start_at",
                label:this.$t('mix.table_date'),
                width:'150',
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'100',
			},{
                prop:"subscription_fee",
                label:this.$t('mix.table_price'),
                width:'90',
			},{
                prop:"attribute",
                label:this.$t('mix.table_type'),
                width:'90',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'90',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'120',
				align: 'center'
			}
			],
			loginAjaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'60',
			}],
			postForm: {
				name: "",
                start_at: "",
                expired_at: "",
				subscription_fee: 0,
				sort: 100,
				status: "",
				type: "",
				security: "",
				userDetails: "",
				name:[],
				selectedIds:[],
			},
			modalList:{},
			securityCheck: 0,
            statusList:[],
			attributeList: [],
			searchStatusList: [],
            searchAttributeList: [],
			postPermission: {},
			securityCheck: 0
		}
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('management/merchant/merchant',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.searchStatusList = data.statusList
					this.searchAttributeList = data.attributeList
				}
				this.initial()
			})

		},initial(){

			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/merchant/merchant/ajaxTable',this.postData)
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
			this.postForm.sort = 100
			this.postForm.searchField = ""
            this.postForm.subscription_fee = 0
			this.postForm.name = ""
            this.postForm.type = ""
            this.postForm.start_at = ""
            this.postForm.expired_at = ""
			this.postForm.status = ""
			this.postPermission.permission = []
			this.searchFieid = false
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('merchantMerchantAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/merchant/merchant/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
                        this.statusList = data.statusList
						this.attributeList = data.attributeList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('merchantMerchantAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
				
                this.postData.data = JSON.stringify(this.postForm)
                var result = this.$m.postMethod('management/merchant/merchant/DBadd',this.postData)

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
			if((this.$p.permissionChecker('merchantMerchantEdit')) && this.loading == false){
				this.loading = true

				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/merchant/merchant/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.attributeList = data.attributeList
                        this.statusList = data.statusList
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if((this.$p.permissionChecker('merchantMerchantEdit')) && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('management/merchant/merchant/DBedit',this.postData)
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
			if(this.$p.permissionChecker('merchantMerchantDelete') && this.loading == false){
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
						var result = this.$m.postMethod("management/merchant/merchant/DBdelete", this.postData);
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
