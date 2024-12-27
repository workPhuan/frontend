<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_custservice')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('toolCustServiceAdd')">{{$t('menu.app_tools_custservice_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolCustServiceDelete')">{{$t('menu.app_tools_custservice_delete')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()">
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
							<template v-if="title.prop == 'deposit_address'" #default="scope">
								<p>{{$t('mix.table_bep20_address')}}: {{scope.row.bep20_address}}</p>
								<p>{{$t('mix.table_trc20_address')}}: {{scope.row.trc20_address}}</p>
							</template>
							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolCustServiceStatus')) ? false : true"></el-switch>
							</template>
							<template v-else-if="title.prop == 'name'" #default="scope">
								<div class="d-flex align-items-center">
									<img :src="scope.row.img_url" class="w-r-2 h-auto me-2"/>
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
										<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
									</div>
								</div>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolCustServiceEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolCustServiceDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>
				
				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		
		<el-dialog v-model="modalList.addRow" v-if="modalList.addRow" :title="$t('menu.app_tools_custservice_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_url')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.url" :placeholder="$t('mix.table_url')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.type" :placeholder="$t('mix.table_type')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_redirect')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_redirect">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_app_chat')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_app_chat">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3 d-flex flex-column">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>
						
						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
				
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
			</el-form>
			
			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>
		
		<el-dialog v-model="modalList.editRow" v-if="modalList.editRow" :title="$t('menu.app_tools_custservice_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_url')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.url" :placeholder="$t('mix.table_url')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.type" :placeholder="$t('mix.table_type')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_redirect')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_redirect">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_app_chat')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_app_chat">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3 d-flex flex-column">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
							<small class="text-danger">* {{$t('msg.msg_upload_edit')}}</small>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>
						
						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
				
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
			openImageDialog: false,
			errors: [],
			submitForm: {
				id:''
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
				align:'left'
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'120',
				align:'left'
			},{
                prop:"url",
                label:this.$t('mix.table_url'),
                width:'150',
				align:'center'
			},{
                prop:"type",
                label:this.$t('mix.table_type'),
                width:'150',
				align:'center'
			},{
                prop:"sort",
                label:this.$t('mix.table_sort'),
                width:'80',
				align:'center'
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'80',
				align:'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{
				code:'',
				img_url:'',
				url:'',
				type:'',
				sort:100,
				status: 0,
				multiple_language: 1,
				security: '',
				single_name: '',
				name:[],
				selectedIds:[],
			},
			imagePickerFile:'',
			imagePickerFileUrl:'',
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			securityCheck: 0
		}
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/custservice/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.postForm.img_url = this.defaultImage = data.defaultImage
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
			})
		},clearPostForm(done){
			this.postForm.code = ''
			this.postForm.url = ''
			this.postForm.type = ''
			this.postForm.status = 0
			this.postForm.multiple_language = 1
			this.postForm.sort = 100
			this.postForm.security = ''
			this.postForm.single_name = ''
			this.postForm.name = []
			this.postForm.selectedIds = []
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			if(done != undefined){
				done()
			}
		},addRow(){
			if(this.$p.permissionChecker('toolCustServiceAdd') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/custservice/DBadd',formData)

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
			if(this.$p.permissionChecker('toolCustServiceEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/custservice/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.status = parseInt(data.thisDetail.status)
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)

						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolCustServiceEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/custservice/DBedit',formData)

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
			if(this.$p.permissionChecker('toolCustServiceStatus') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('app/tools/custservice/DBstatus',formData)
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
				})
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('toolCustServiceDelete') && this.loading == false){
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
						var result = this.$m.postMethod("app/tools/custservice/DBdelete", this.postData);
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
						this.loading = false   
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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.mask = this.$m.getSecurityMask()
		this.initial()
	}
}
</script>