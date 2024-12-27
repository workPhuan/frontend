<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_page')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('toolPageAdd')">{{$t('menu.app_tools_page_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolPageDelete')">{{$t('menu.app_tools_page_delete')}}</el-button>
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
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.sort" :placeholder="$t('mix.table_please_enter')+$t('mix.table_sort')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_sort')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
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
									<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
									<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
								</div>
							</template>
							
							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolPageEdit')) ? false : true"></el-switch>
							</template>
						
							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolPageEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolPageDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
		
		<el-dialog v-if="modalList.addRow" v-model="modalList.addRow" :title="$t('menu.app_tools_page_add')" class="dialog-md" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.category" :placeholder="$t('mix.table_category')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
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
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.single_title" :placeholder="$t('mix.table_title')" />
							
							<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
							<Tinymce class="mt-1 my_editor" v-model="postForm.single_content" :disabled="loading"/>
						</template>
						
						<template v-else>
							<el-tabs type="border-card">
								<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
									<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.title[item.id]" :placeholder="$t('mix.table_title')" />
									
									<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
									<Tinymce class="mt-1 my_editor" v-model="postForm.content[item.id]" :disabled="loading"/>
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
		
		<el-dialog v-if="modalList.editRow" v-model="modalList.editRow" :title="$t('menu.app_tools_page_edit')" class="dialog-md" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.category" :placeholder="$t('mix.table_category')" />
                    </el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
                        <el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
                    </el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
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
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.single_title" :placeholder="$t('mix.table_title')" />
							
							<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
							<Tinymce class="mt-1 my_editor" v-model="postForm.single_content" :disabled="loading"/>
						</template>
						
						<template v-else>
							<el-tabs type="border-card">
								<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
									<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.title[item.id]" :placeholder="$t('mix.table_title')" />
									
									<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
									<Tinymce class="mt-1 my_editor" v-model="postForm.content[item.id]" :disabled="loading"/>
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
import Tinymce from '@/components/tinymce/index.vue'
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
                width:'300',
				align:'left'
            },{
                prop:"category",
                label:this.$t('mix.table_category'),
                width:'100',
                align:'left'
            },{
                prop:"sort",
                label:this.$t('mix.table_sort'),
                width:'100',
				align:'left'
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'100',
				align:'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{
				code: '',
				name: '',
				sort: 100,
				status: 1,
				multiple_language: 0,
				category: '',
				security: '',
				single_title: '',
				single_content: '',
				title:[],
				content:[],
				selectedIds: [],
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			securityCheck: 0
		}
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/page/ajaxTable',this.postData)
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
			this.postForm.code = ''
			this.postForm.name = ''
			this.postForm.sort = 100
			this.postForm.status = 1
			this.postForm.multiple_language = 0
			this.postForm.category = 0
			this.postForm.security = ''
			this.postForm.single_title = ''
			this.postForm.single_content = ''
			this.postForm.title = []
			this.postForm.content = []
			this.postForm.selectedIds = []
			if(done != undefined){
				done()
			}
		},addRow(){
			if(this.$p.permissionChecker('toolPageAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/page/DBadd',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						
						this.modalList.addRow = false,
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
			if(this.$p.permissionChecker('toolPageEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/page/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						this.postForm.status = parseInt(data.thisDetail.status)
						
						var content = '';
						content = this.decoder(JSON.stringify(this.postForm.content))
						this.postForm.content = JSON.parse(content)
						
						this.postForm.single_content = this.decoder(this.postForm.single_content)
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolPageEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/page/DBedit',this.postData)

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
			if(this.$p.permissionChecker('toolPageEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.status = currentData.status;
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/page/DBstatus',formData)
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
		},deleteRow(id) {
			if(this.$p.permissionChecker('toolPageDelete') && this.loading == false){
				var valid = true
				if(id == 'multiple'){
					if(this.postForm.selectedIds.length < 1){
						valid = false
					}
				}
				
				if(valid){
					this.loading = true;
					
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
						var result = this.$m.postMethod("app/tools/page/DBdelete", this.postData);
						result.then((value) => {
							var data = value.data;
							if (value.valid) {
								this.$message({
									type: "success",
									message: data.returnMsg
								});

								this.initial();
								this.loading = false;
							} else {
								this.$m.popupErrorMessage(data.returnMsg,this)
								this.loading = false;
							}
						});
					}).catch(() => {
						this.loading = false;          
					});
				}else{
					this.$message.error(this.$t('error.msg_checkbox_select'));
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
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")	
			}
			
			return value
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>