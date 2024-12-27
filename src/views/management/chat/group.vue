<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_chat_group')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true, genCode()" :loading="loading" v-if="$p.permissionChecker('userChatLogAdd')">{{$t('menu.management_chat_group_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('userChatGroupDelete')">{{$t('menu.management_chat_group_delete')}}</el-button>
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
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.username" :placeholder="$t('mix.table_please_enter')+$t('mix.table_user')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_user')}}</label>
							</template>
						</el-input>
						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.account_package_id" :placeholder="$t('mix.table_account_package')" clearable filterable @change="initial()">
							<el-option v-for="item in searchPackageList" :label="item.code" :value="item.id">{{item.code}}</el-option>
						</el-select>
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.group_id" :placeholder="$t('mix.table_please_enter')+$t('mix.table_chat_group_id')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_chat_group_id')}}</label>
							</template>
						</el-input>
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
						
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="clearSearchForm()" :loading="loading"><i class="fa-light fa-brush me-2"></i>{{$t('button.clear')}}</el-button>

					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<el-table-column type="selection" width="55" ></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type" >
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>
							
							
							<template v-if="title.prop == 'img_url'" #default="scope">
								<div class="d-flex align-items-center">
								<img :src="scope.row.img_url" class="w-r-5 h-auto"/>
								</div>
							</template>

							<template v-if="title.prop == 'created_at'" #default="scope">
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{$t('mix.table_created_at')}}: {{scope.row.created_at}}</p>
										<p class="p-0 m-0">{{$t('mix.table_updated_at')}}: {{scope.row.updated_at}}</p>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('userChatGroupEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatGroupEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatGroupDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
		
		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_chat_group_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code"  :placeholder="$t('mix.table_code')">
							<template #prepend>
									<el-button @click="genCode('code')" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_chat_group_id')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.group_id"  :placeholder="$t('mix.table_chat_group_id')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name"  :placeholder="$t('mix.table_name')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_user')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username"  :placeholder="$t('mix.table_user')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account_package')}}</label>
						<el-select size="large" class="custom-input mt-1 w-100" v-model="postForm.account_package_id" :placeholder="$t('msg.msg_select')" filterable>
							<el-option v-for="(list,index) in packageList" :key="index" :label="list.code" :value="list.id">{{list.code}}</el-option>
						</el-select>
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					<el-col :span="24" class="mb-3">
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
						
						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
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
		
		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_chat_group_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code"  :placeholder="$t('mix.table_code')">
							<template #prepend>
									<el-button @click="genCode('code')" class="m-1"><i class="fa-regular fa-circle-plus"></i></el-button>
							</template>
						</el-input>
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_chat_group_id')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.group_id"  :placeholder="$t('mix.table_chat_group_id')" disabled />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name"  :placeholder="$t('mix.table_name')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username"  :placeholder="$t('mix.table_name')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account_package')}}</label>
						<el-select size="large" class="custom-input mt-1 w-100" v-model="postForm.account_package_id" :placeholder="$t('msg.msg_select')" filterable>
							<el-option v-for="(list,index) in packageList" :key="index" :label="list.code" :value="list.id">{{list.code}}</el-option>
						</el-select>
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					<el-col :span="24" class="mb-3">
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
						
						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
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
	pagination: 1,
	limit: 10,
}

export default {
    inject:['preloader'],
	data() {
		return {
			loading: true,
			tableData: [],
			total: 0,
			errors: [],
			submitForm: {
				id: "",
				status: 0
			},
			postData: {
				data: "",
				language: ""
			},
			searchData:Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles: [{
				prop:"no",
				label:this.$t("mix.table_id"),
				width: "100",
				align:'center'
			},{
				prop:"img_url",
				label:this.$t("mix.table_image"),
				width: "100",
				align:'center'
			},{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "150",
				align:'center'
			},{
				prop:"username",
				label:this.$t("mix.table_user"),
				width: "150",
				align:'center'
			},{
				prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "250",
			},{
				prop:"code",
				label:this.$t("mix.table_code"),
				width: "150",
				align:'center'
			},{
				prop:"package_code",
				label:this.$t("mix.table_account_package"),
				width: "150",
				align:'center'
			},{
				prop:"group_id",
				label:this.$t("mix.table_chat_group_id"),
				width: "150",
				align:'center'
			},{
				prop:"status",
				label:this.$t("mix.table_status"),
				width: "100",
				align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "270",
				align:'right'
			}],
			ajaxSearch: [{
				prop:"name",
				label:this.$t("mix.table_name")
			},{
				prop:"category",
				label:this.$t("mix.table_category")
			},{
				prop:"sort",
				label:this.$t("mix.table_sort")
			},{
				prop:"status",
				label:this.$t("mix.table_status")
			}],
			postForm: {
				status: 1,
				security: "",
				code: "",
				domain_url: '',
				master_id: '',
				img_url: '',
				username: '',
				account_package_id: '',
				selectedIds: [],
				name: []
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
			modalList:{},
			searchPackageList: [],
			packageList: [],
			securityCheck: 0,
			imagePickerFile:'',
			imagePickerFileUrl:'',
		};
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('management/chat/group',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.searchPackageList = data.packageList
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("management/chat/group/ajaxTable", this.postData);
			result.then((value) => {
				var data = value.data;

				if (value.valid) {
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
			});
		},
		clearPostForm(done){
			this.postForm.code = []
			this.postForm.group_id = []
			this.postForm.img_url = ''
			this.postForm.id = ''
			this.postForm.name = []
			this.postForm.selectedIds = []
			this.postForm.domain_url = ''
			this.postForm.username = ''
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('userChatLogAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/chat/group/add',this.postData)
				result.then((value)=>{
					var data = value.data
			
					if(value.valid){
						this.packageList = data.packageList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },genCode(field) {
			const randomCode = this.$m.genRandomCode(16);

				if (field === 'code') {
				this.postForm.code = randomCode;
			}
		},addRow() {
			if(this.$p.permissionChecker('userChatGroupAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				var result = this.$m.postMethod("management/chat/group/DBadd", formData)

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
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/chat/group/edit", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						
						this.postForm = data.thisDetail
						this.packageList = data.packageList
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},
		editRow() {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				var result = this.$m.postMethod("management/chat/group/DBedit", formData)

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
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/chat/group/DBstatus',formData)
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
		},deleteRow(id) {
			if(this.$p.permissionChecker('userChatGroupDelete') && this.loading == false){
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
						var result = this.$m.postMethod("management/chat/group/DBdelete", this.postData);
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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},clearSearchForm(){
			this.searchData = Object.assign({}, searchForm)
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.initial()
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
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
};
</script>