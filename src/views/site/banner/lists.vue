<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.site_banner_lists')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('bannerListsAdd')">{{$t('menu.site_banner_lists_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('bannerListsDelete')">{{$t('menu.site_banner_lists_delete')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.category_id" :placeholder="$t('mix.table_category')" clearable @change="initial()" size="large">
							<el-option v-for="item in searchCategoryList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
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
							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('bannerListsStatus')) ? false : true"></el-switch>
							</template>
                            <template v-else-if="title.prop == 'start_at'" #default="scope">
								<p>{{ $t('mix.table_start_at') }}: {{ scope.row.start_at }}</p>
								<p>{{ $t('mix.table_end_at') }}: {{ scope.row.end_at }}</p>
							</template>
                            <template v-else-if="title.prop == 'img_url'" #default="scope">
                                <img :src="scope.row.img_url" @click="$m.openBrowser(scope.row.img_url)" class="w-r-5 h-auto me-2"/>
                            </template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('bannerListsEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('bannerListsDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
		
		<el-dialog v-model="modalList.addRow" v-if="modalList.addRow" :title="$t('menu.site_banner_lists_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<img class="upload-display-image" fit="fill" :src="defaultImg" />
                            <br>
                            <small class="text-danger">*{{ $t('msg.msg_upload_2') }}</small>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="imgFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
					</el-col>

                    <el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_display_time')}}</label>
						<div class="d-flex align-items-center justify-content-between">
                            <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.start_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_start_at')" />
                            <div class="mx-3"> - </div>
                            <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.end_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_end_at')" />
                        </div>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
						<el-select class="custom-input w-100 mt-1" size="large" v-model="postForm.category_id">
							<el-option v-for="item in categoryList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>
				
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" size="large" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
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
		
		<el-dialog v-model="modalList.editRow" :title="$t('menu.site_banner_lists_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<img class="upload-display-image" fit="fill" :src="postForm.img_url" />
                            <br>
                            <small class="text-danger">*{{ $t('msg.msg_upload_edit') }}</small>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="imgFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
					</el-col>

                    <el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_display_time')}}</label>
						<div class="d-flex align-items-center justify-content-between">
                            <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.start_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_start_at')" />
                            <div class="mx-3"> - </div>
                            <el-date-picker class="custom-input mt-1 w-100" size="large" v-model="postForm.end_at" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date":placeholder="$t('mix.table_end_at')" />
                        </div>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
						<el-select class="custom-input w-100 mt-1" size="large" v-model="postForm.category_id">
							<el-option v-for="item in categoryList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>
				
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" size="large" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')"/>
					</el-col>
					
					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
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
				security:'',
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
                width: '60',
			},{
                prop:"img_url",
                label:this.$t('mix.table_image'),
                width: '100',
			},{
                prop:"category_id",
                label:this.$t('mix.table_category'),
                width: '150',
			},{
                prop:"start_at",
                label:this.$t('mix.table_display_time'),
                width:'150',
            },{
                prop:"remark",
                label:this.$t('mix.table_remark'),
                width:'150',
			},{
                prop:"sort",
                label:this.$t('mix.table_sort'),
                width:'100',
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
				img_url:'',
				start_at:'',
				end_at: '',
				sort: 100,
				category_id: '',
				status: 1,
				remark: '',
				security: '',
				selectedIds:[],
			},
			searchCategoryList: [],
			categoryList: [],
			defaultImg: '',
			imagePickerFile: '',
			imagePickerFileUrl: '',
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			securityCheck: 0
		}
	},
	methods:{
		getInitial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('site/banner/lists',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.searchCategoryList = data.categoryList
					this.initial()
				}
			})
		},initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('site/banner/lists/ajaxTable',this.postData)
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
			this.postForm.start_at = ''
			this.postForm.end_at = ''
			this.postForm.sort = 10
			this.postForm.category_id = ''
			this.postForm.status = 0
			this.postForm.remark = ''
			this.postForm.security = ''
			this.postForm.selectedIds = []
            
            this.imagePickerFile = ''
			this.imagePickerFileUrl = ''

			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('bannerListsAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('site/banner/lists/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.defaultImg = data.defaultImg
						this.categoryList = data.categoryList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('bannerListsAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				var formData = new FormData()
				formData.append('img_url',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)
				var result = this.$m.postMethod('site/banner/lists/DBadd',formData)

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
			if(this.$p.permissionChecker('bannerListsEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('site/banner/lists/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.categoryList = data.categoryList
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.status = parseInt(data.thisDetail.status)
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('bannerListsEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				var formData = new FormData()
				formData.append('img_url',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)
				var result = this.$m.postMethod('site/banner/lists/DBedit',formData)

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
			if(this.$p.permissionChecker('bannerListsStatus') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.status = currentData.status;
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('site/banner/lists/DBstatus',formData)
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
			if(this.$p.permissionChecker('bannerListsDelete') && this.loading == false){
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
						var result = this.$m.postMethod("site/banner/lists/DBdelete", this.postData);
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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('imgFile').value = ''
		},openImage(){
			document.getElementById('imgFile').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('imgFile').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('imgFile').files[0])
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
}
</script>