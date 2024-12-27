<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_sticker_list')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button warning" @click="resetRedis()" :loading="loading" v-if="$p.permissionChecker('stickerListEdit')">{{$t('button.resetRedis')}}</el-button>
				<el-button class="custom-button danger" @click="clearRedis()" :loading="loading" v-if="$p.permissionChecker('stickerListEdit')">{{$t('button.clearRedis')}}</el-button>
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('stickerListAdd')">{{$t('menu.management_sticker_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('stickerListDelete')">{{$t('menu.management_sticker_delete')}}</el-button>
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
                        
                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.sticker_group_id" :placeholder="$t('menu.management_sticker_group')" clearable @change="initial()" size='large'>
							<el-option v-for="(item,index) in stickerGroupList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
						
                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.created_at" type="daterange" range-separator="-" :start-placeholder="$t('mix.table_start_at')" :end-placeholder="$t('mix.table_end_at')" @change="initial()" />
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
					
					<el-table-column type="selection" width="45"></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
						    </template>

                            <template v-if="title.prop == 'img_url'" #default="scope">
								<div class="d-flex align-items-center">
									<img :src="scope.row.img_url" class="w-100 h-auto"/>
									<!-- <div class="d-flex flex-column">
										<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
										<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
									</div> -->
								</div>
							</template>

                            <template v-if="title.prop == 'is_popup'" #default="scope">
								<el-switch v-model="scope.row.is_popup" active-value="1" inactive-value="0" @change="popupRow(scope.row)" :disabled="($p.permissionChecker('stickerListEdit')) ? false : true"></el-switch>
							</template>
							
							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('stickerListEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('stickerListEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>

								<!-- <el-button v-if="1" class="custom-button warning m-1" @click="getPermissionRow(scope.row.id)">{{$t('button.permission')}}</el-button> -->
								<el-button v-if="$p.permissionChecker('stickerListDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>
                
				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                </el-card>
            </div>
            
            <el-dialog v-model="modalList.addRow" :title="$t('menu.management_sticker_add')" :before-close="clearPostForm">
                <el-form label-position="top" label-width="auto" @submit.native.prevent>
                <el-row :gutter="20">
                    <el-col :sm="24" class="mb-3 d-flex flex-column">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
                        <div class="upload-frame pointer" @click="openImage()" v-if="!imagePickerFileUrl">
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
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_sticker_group')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.sticker_group_id" :placeholder="$t('menu.management_sticker_group')" size="large">
							<el-option v-for="(list,index) in stickerGroupList" :key="index" :label="list.name" :value="list.id" v-model="postForm.sticker_group_id">{{list.name}}</el-option>
						</el-select>
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
		
		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_sticker_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
                    <el-col :sm="24" class="mb-3 d-flex flex-column">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
                        <div class="upload-frame pointer" @click="openImage()">
                            <el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
                            <div class="upload-selected-name">{{imagePickerFile.name}}</div>
                            <div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
                        </div>
                        
                        <input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
                    </el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_sticker_group')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.sticker_group_id" :placeholder="$t('menu.management_sticker_group')" size="large">
							<el-option v-for="(list,index) in stickerGroupList" :key="index" :label="list.name" :value="list.name" v-model="postForm.sticker_group_id">{{list.name}}</el-option>
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
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
                        <el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
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
import Tinymce from '@/components/tinymce/index.vue'
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
            searchField: true,
			submitForm: {
				id: "",
				security:""
			},
			postData: {
				data: '',
				language: ''
			},
			searchData:Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles: [{
				prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "130",
			},{
				prop:"img_url",
				label:this.$t("mix.table_img_url"),
				width: "120",
			},{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "120",
			},{
				prop:"sticker_group_id",
				label:this.$t("menu.management_sticker_group"),
				width: "150",
			},{
				prop:"sort",
				label:this.$t("mix.table_sort"),
				width: "80",
				align:'center'
			},{
				prop:"status",
				label:this.$t("mix.table_status"),
				width: "80",
				align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "200",
				align:'center'
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
                img_url: '',
				name: '',
                sticker_group_id: '',
                imagePickerFileUrl: '',
                sort:100,
				status: 1,
				security: "",
				single_name: "",
				multiple_language: 0,
				name: [],
				selectedIds:[],
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			permissionList:[],
			postPermission:{
				id:'',
				permission:[],
			},
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
			modalList:{},
			securityCheck: 0,
            imagePickerFile: '',
			imagePickerFileUrl: '',
			imagePickerFileUpload:true,
            stickerGroupList:[],
			fileDetail:{},
		}
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('management/sticker/sticker',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.stickerGroupList = data.stickerGroupList
				}
				this.initial()
			})

		},
		initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("management/sticker/sticker/ajaxTable", this.postData);
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
		},clearPostForm(done){
			this.postForm.img_url = ''
			this.postForm.sort = 100
            this.postForm.single_name = ''
            this.postForm.sticker_group_id = ''
			this.postForm.status = 1
			this.postForm.multiple_language = 0
			this.imagePickerFileUrl = ''
			this.imagePickerFile = ''
            this.postForm.name = []
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('stickerListAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/sticker/sticker/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.stickerGroupList = data.stickerGroupList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow() {
			if(this.$p.permissionChecker('stickerListAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)
				
				var result = this.$m.postMethod("management/sticker/sticker/DBadd",formData)
				
				result.then((value) => {
					var data = value.data

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
			if(this.$p.permissionChecker('stickerListEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id;
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/sticker/sticker/edit", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.postForm = data.thisDetail
						this.imagePickerFileUrl = "http:\/\/192.168.0.108:8000\/uploads\/"+data.thisDetail.img_url
                        this.stickerGroupList = data.stickerGroupList
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.status = parseInt(data.thisDetail.status)
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},editRow() {
			if(this.$p.permissionChecker('stickerListEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)
				
				var result = this.$m.postMethod("management/sticker/sticker/DBedit", formData)

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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},statusRow(currentData){
			if(this.$p.permissionChecker('stickerListEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/sticker/sticker/DBstatus',formData)
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
		},resetRedis(){
			if(this.$p.permissionChecker('stickerListEdit') && this.loading == false){
				this.loading = true
				var result = this.$m.postMethod("management/sticker/sticker/DBresetRedis");
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.$message({
							message: data.returnMsg,
							type: "success"
						});
						this.loading = false
					}
				});
			}
		},clearRedis(){
			if(this.$p.permissionChecker('stickerListEdit') && this.loading == false){
				this.loading = true
				var result = this.$m.postMethod("management/sticker/sticker/DBclearRedis");
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.$message({
							message: data.returnMsg,
							type: "success"
						});
						this.loading = false
					}
				});
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('stickerListDelete') && this.loading == false){
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
						var result = this.$m.postMethod("management/sticker/sticker/DBdelete", this.postData);
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
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
};
</script>