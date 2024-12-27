<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_developer_permissionagent')}}
			</label>
			
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="modalList.addRow = true, genCode()" :loading="loading" v-if="$p.permissionChecker('developerPermissionAgentAdd')">{{$t('menu.app_developer_permissionagent_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('developerPermissionAgentDelete')">{{$t('menu.app_developer_permissionagent_delete')}}</el-button>
			</div>
		</div>	
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
					
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.site" :placeholder="$t('msg.msg_select')+$t('mix.table_site')" clearable @change="initial()">
							<el-option label="agt (Agent)" value="agt"></el-option>
						</el-select>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.parent" :placeholder="$t('mix.table_please_enter')+$t('mix.table_parent')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_parent')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.file" :placeholder="$t('mix.table_please_enter')+$t('mix.table_file')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_file')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.relation" :placeholder="$t('mix.table_please_enter')+$t('mix.table_relation_path')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_relation_path')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.sort" :placeholder="$t('mix.table_please_enter')+$t('mix.table_sort')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_sort')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.type" :placeholder="$t('msg.msg_select')+$t('mix.table_type')" clearable @change="initial()">
							<el-option :label="$t('mix.table_catalog')" value="catalog">{{$t('mix.table_catalog')}}</el-option>
							<el-option :label="$t('mix.table_menu')" value="menu">{{$t('mix.table_menu')}}</el-option>
							<el-option :label="$t('mix.table_submenu')" value="submenu">{{$t('mix.table_submenu')}}</el-option>
							<el-option :label="$t('mix.table_button')" value="button">{{$t('mix.table_button')}}</el-option>
						</el-select>
						
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
							
							<template v-if="title.prop == 'name'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{$t('mix.table_name')}}: {{scope.row[title.prop]}}</p>
									<p class="p-0 m-0">{{$t('mix.table_code')}}: {{scope.row.code}}</p>
									<p class="p-0 m-0" v-if="scope.row.type">{{$t('mix.table_type')}}: {{$t('mix.table_'+scope.row.type)}}</p>
								</div>
							</template>
							
							<template v-if="title.prop == 'file'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{$t('mix.table_parent')}}: {{scope.row.parent}}</p>
									<p class="p-0 m-0">{{$t('mix.table_file')}}: {{scope.row[title.prop]}}</p>
									<p class="p-0 m-0">{{$t('mix.table_path')}}: {{scope.row.path}}</p>
								</div>
							</template>
							
							<template v-if="title.prop == 'relation'" #default="scope">
								<div v-html="formattedText(scope.row.relation)"></div>
							</template>
						
							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('developerPermissionAgentEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('developerPermissionAgentDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
		
		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_developer_permissionagent_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent >
               <el-row :gutter="20">
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" >
							<template #prepend>
								<el-button @click="genCode()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_site')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.site" :placeholder="$t('msg.msg_select')" @change="changeSite($event)">
							<el-option label="agt (Agent)" value="agt"></el-option>
						</el-select>
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_path')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.path" :placeholder="$t('mix.table_path')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_relation_path')}}</label>
						<el-input class="mt-1" rows="3" type="textarea" v-model="postForm.relation" :placeholder="$t('mix.table_relation_path')" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_mark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.file" :placeholder="$t('mix.table_mark')" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_icon')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.icon" :placeholder="$t('mix.table_icon')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>
				
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_parent')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.parent" :placeholder="$t('mix.table_parent')" />
					</el-col>

					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.type" :placeholder="$t('msg.msg_select')">
							<el-option :label="$t('mix.table_catalog')" value="catalog">{{$t('mix.table_catalog')}}</el-option>
							<el-option :label="$t('mix.table_menu')" value="menu">{{$t('mix.table_menu')}}</el-option>
							<el-option :label="$t('mix.table_submenu')" value="submenu">{{$t('mix.table_submenu')}}</el-option>
							<el-option :label="$t('mix.table_button')" value="button">{{$t('mix.table_button')}}</el-option>
						</el-select>
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
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>
		
		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_developer_permissionagent_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent >
               <el-row :gutter="20">
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" >
							<template #prepend>
								<el-button @click="genCode()" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_site')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.site" :placeholder="$t('msg.msg_select')" @change="changeSite($event)">
							<el-option label="agt (Agent)" value="agt"></el-option>
						</el-select>
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_path')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.path" :placeholder="$t('mix.table_path')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_relation_path')}}</label>
						<el-input class="mt-1" rows="3" type="textarea" v-model="postForm.relation" :placeholder="$t('mix.table_relation_path')" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_mark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.file" :placeholder="$t('mix.table_mark')" />
					</el-col>
					
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_icon')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.icon" :placeholder="$t('mix.table_icon')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>
				
					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_parent')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.parent" :placeholder="$t('mix.table_parent')" />
					</el-col>

					<el-col :xs="24" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.type" :placeholder="$t('msg.msg_select')">
							<el-option :label="$t('mix.table_catalog')" value="catalog">{{$t('mix.table_catalog')}}</el-option>
							<el-option :label="$t('mix.table_menu')" value="menu">{{$t('mix.table_menu')}}</el-option>
							<el-option :label="$t('mix.table_submenu')" value="submenu">{{$t('mix.table_submenu')}}</el-option>
							<el-option :label="$t('mix.table_button')" value="button">{{$t('mix.table_button')}}</el-option>
						</el-select>
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
</script>

<script>
let searchForm = {
	site: 'agt',
	type: '',
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
				is_admin:'',
				is_shortcode:''
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
                prop: "name",
                label: this.$t('mix.table_permission'),
                width:'200',
				align:'left'
            },{
                prop: "file",
                label: this.$t('mix.table_description'),
                width:'300',
				align:'left'
			},{
                prop: "relation",
                label: this.$t('mix.table_relation_path'),
                width:'300',
				align:'left'
			},{
                prop: "sort",
                label: this.$t('mix.table_sort'),
                width:'100',
				align:'center'
            },{
                prop: "action",
                label: this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{
				site:'agt',
				code:'',
				name:'',
				parent: 'top',
				type: 'catalog',
				path:'agt/',
				file:'',
				relation:'',
				icon:'',
				sort:100,
				selectedIds:[],
				security: ''
			},
			modalList:{},
			securityCheck: 0
		};
	},methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/developer/permissionagent/ajaxTable',this.postData)
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
			this.postForm.site = 'agt'
			this.postForm.code = ''
			this.postForm.name = ''
			this.postForm.parent = 'top'
			this.postForm.type = 'catalog'
			this.postForm.path = 'agt/'
			this.postForm.file = ''
			this.postForm.relation = ''
			this.postForm.icon = ''
			this.postForm.sort = 100
			this.postForm.selectedIds = []
			this.postForm.security = ''

			if(done != undefined){
				done()
			}
		},changeSite(event){
			this.postForm.path = event+'/'
			this.autoSetPath()
		},genCode(){
			this.postForm.code = this.$m.genRandomCode(6)
		},addRow(){
			if(this.$p.permissionChecker('developerPermissionAgentAdd')){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/developer/permissionagent/DBadd',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						
						// this.modalList.addRow = false
						// this.clearPostForm()
						this.genCode()
						this.initial()
					}else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				})
			}
		},getEditRow(id){
			if(this.$p.permissionChecker('developerPermissionAgentEdit')){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/developer/permissionagent/edit',this.postData)
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
			if(this.$p.permissionChecker('developerPermissionAgentEdit')){
				this.loading = false
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/developer/permissionagent/DBedit',this.postData)

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
		},deleteRow(id){
			if(this.$p.permissionChecker('developerPermissionAgentDelete')){
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
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod('app/developer/permissionagent/DBdelete',this.postData)
					result.then((value) => {
						var data = value.data
						if(value.valid){
							this.$message({
							type: 'success',
							message: data.returnMsg
							})
							
							this.initial()
							this.loading = false
						}else{
                        	this.$m.popupErrorMessage(data.returnMsg,this)
							this.loading = false
						}
					
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
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id)
		},formattedText(value) {
		  return value.replace(/\n/g, '<br>')
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>