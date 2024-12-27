<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<span @click="$router.push('/management/admin/admin')" class="pointer pe-3"><i class="fa-solid fa-arrow-left pe-2"></i> {{$t('button.back')}} </span>|
                <span class="ps-3">{{$t('menu.management_admin_admin_room')}}</span>
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('adminAdminRoomAdd')">{{$t('menu.management_admin_admin_room_add')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
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

                            <template v-if="title.prop == 'img_url'" #default="scope">
                                <img :src="scope.row.img_url" @click="$m.openBrowser(scope.row.img_url)" class="w-r-2 h-auto me-2"/>
                            </template>

                            <template v-if="title.prop == 'stream_url'" #default="scope">
                                <small class='pointer text-primary' @click="$m.openBrowser(scope.row.stream_url)"> {{ scope.row.stream_url }}</small>
                            </template>

                            <template v-if="title.prop == 'status'" #default="scope">
                                <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('adminAdminRoomStatus')) ? false : true"></el-switch>
                            </template>
                            
                            <template v-if="title.prop == 'action'" #default="scope">
                                <el-button v-if="$p.permissionChecker('adminAdminRoomEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
                                <el-button v-if="$p.permissionChecker('adminAdminRoomDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" v-if="modalList.addRow" :title="$t('menu.management_admin_admin_room_add')" :before-close="clearPostForm" class="dialog-xl">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_start_at')}}</label>
						<el-time-picker class="w-100 mt-1" size="large" v-model="postForm.start_at" format="HH:mm:ss" value-format="HH:mm:ss" arrow-control :placeholder="$t('mix.table_start_at')" />
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<img class="upload-display-image" fit="fill" :src="defaultImg" />
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="imgFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_cover_image')}}</label>
						<div class="upload-frame pointer" @click="openCover()">
							<img class="upload-display-image" fit="fill" :src="defaultImg" />
						</div>
						<div class="upload-selected" v-if="coverPickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="coverPickerFileUrl"></el-image>
							<div class="upload-selected-name">{{coverPickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialCover()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="coverFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="coverChange(index)"/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.title" :placeholder="$t('mix.table_title')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
						<Tinymce class="mt-1 my_editor" v-if="modalList.addRow" v-model="postForm.description" :disabled="loading"/>
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

		<el-dialog v-model="modalList.editRow" v-if="modalList.editRow" :title="$t('menu.management_admin_admin_room_edit')" :before-close="clearPostForm" class="dialog-xl">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_start_at')}}</label>
						<el-time-picker class="w-100 mt-1" size="large" v-model="postForm.start_at" format="HH:mm:ss" value-format="HH:mm:ss" arrow-control :placeholder="$t('mix.table_start_at')" />
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<img class="upload-display-image" fit="fill" :src="postForm.img_url" />
							<!-- <i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
							<small class="text-danger">* {{$t('msg.msg_upload_edit')}}</small> -->
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="imgFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_cover_image')}}</label>
						<div class="upload-frame pointer" @click="openCover()">
							<img class="upload-display-image" fit="fill" :src="postForm.cover_img_url" />
							<!-- <i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
							<small class="text-danger">* {{$t('msg.msg_upload_edit')}}</small> -->
						</div>
						<div class="upload-selected" v-if="coverPickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="coverPickerFileUrl"></el-image>
							<div class="upload-selected-name">{{coverPickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialCover()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="coverFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="coverChange(index)"/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.title" :placeholder="$t('mix.table_title')" />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
						<Tinymce class="mt-1 my_editor" v-if="modalList.editRow" v-model="postForm.description" :disabled="loading"/>
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
import Tinymce from '@/components/tinymce/index.vue'
import { storeTempID } from '@/system/store/state.js'
</script>

<script>

let searchForm = {
	pagination: 1,
	limit: 10,
}
			
export default{
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
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'180',
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'150',
			},{
                prop:"stream_url",
                label:this.$t('mix.table_stream_url'),
                width:'320',
			},{
                prop:"img_url",
                label:this.$t('mix.table_image'),
                width:'100',
			},{
                prop:"title",
                label:this.$t('mix.table_title'),
                width:'180',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'100',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align: 'right'
			}],
			postForm:{
				name:'',
				start_at:'',
				title:'',
				description:'',
				status:0,
				security:''
			},
			modalList:{},
			defaultImg: '',
			imagePickerFile: '',
			imagePickerFileUrl: '',
			coverPickerFile: '',
			coverPickerFileUrl: '',
			securityCheck: 0,
		}
	},
	methods:{
		initial(){
            this.searchData.master_id = storeTempID.value
			this.loading = true
            this.postData.data = JSON.stringify(this.searchData)
            var result = this.$m.postMethod('management/admin/admin/roomAjaxTable',this.postData)
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
			this.postForm.master_id=''
			this.postForm.name=''
			this.postForm.start_at=''
			this.postForm.title=''
			this.postForm.description=''
			this.postForm.status=0
			this.postForm.security=''

			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			
			this.coverPickerFile = ''
			this.coverPickerFileUrl = ''

			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('adminAdminRoomAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/admin/admin/addRoom',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.defaultImg = data.defaultImg
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('adminAdminRoomAdd') && this.loading == false){
				this.loading = true
				this.preloader(true)
				this.postForm.master_id = this.searchData.master_id
				var formData = new FormData()
				formData.append('img_url',this.imagePickerFile)
				formData.append('cover_img_url',this.coverPickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('management/admin/admin/DBaddRoom',formData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						this.loading = false
						this.clearPostForm()
						this.initial()
						this.modalList.addRow = false
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				})
			}
		},getEditRow(id){
			if(this.$p.permissionChecker('adminAdminRoomEdit') && this.loading == false){
				this.loading = true

				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/admin/admin/editRoom',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						var description = '';
						description = this.decoder(JSON.stringify(this.postForm.description))
						this.postForm.description = JSON.parse(description)
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('adminAdminRoomEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('img_url',this.imagePickerFile)
				formData.append('cover_img_url',this.coverPickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('management/admin/admin/DBeditRoom',formData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						this.loading = false
						this.clearPostForm()
						this.initial()
						this.modalList.editRow = false
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				})
			}
		},statusRow(currentData){
			if(this.$p.permissionChecker('adminAdminRoomStatus') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/admin/admin/DBstatusRoom',formData)
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
					this.initial()
					this.loading = false
				})
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('adminAdminRoomDelete') && this.loading == false){
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
					var result = this.$m.postMethod("management/admin/admin/DBdeleteRoom", this.postData);
					result.then((value) => {
						var data = value.data;
						if (value.valid) {
							this.$message({
								type: "success",
								message: data.returnMsg
							});
							this.loading = false;
							this.initial();
						} else {
							this.$m.popupErrorMessage(data.returnMsg,this)
							this.loading = false;
						}
					});
				}).catch(() => {
					this.loading = false
				});
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
        if(storeTempID.value != '' && storeTempID.value != undefined){
            this.initial()
        }else{
            this.$router.push('/management/admin/admin')
        }
		
	}
}
</script>