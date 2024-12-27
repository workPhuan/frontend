<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_profile_information_edit')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button primary" @click="editRow()" :loading="loading" v-if="$p.permissionChecker('profileInformationEdit')">{{$t('button.save')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
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

                            <input type="file" id="imgFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
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

                            <input type="file" id="coverFile" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="coverChange(index)"/>
                        </el-col>
                        
                        <el-col :sm="24" class="mb-3">
                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
                            <el-input class="custom-input mt-1" v-model="postForm.title" :placeholder="$t('mix.table_title')" />
                        </el-col>

                        <el-col :sm="24" class="mb-3">
                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
                            <Tinymce class="mt-1 my_editor" v-model="postForm.description" :disabled="loading"/>
                        </el-col>

                        <el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
                            <el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
                        </el-col>
                    </el-row>
                </el-form>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import Tinymce from '@/components/tinymce/index.vue'
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
			postForm:{
				name:'',
				start_at:'',
				title:'',
				description:'',
				security:''
			},
			modalList:{},
			imagePickerFile: '',
			imagePickerFileUrl: '',
			coverPickerFile: '',
			coverPickerFileUrl: '',
			securityCheck: 0,
		}
	},
	methods:{
		initial(){
			if(this.$p.permissionChecker('profileInformationEdit')){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/profile/information',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						var description = '';
						description = this.decoder(JSON.stringify(this.postForm.description))
						this.postForm.description = JSON.parse(description)
					}
					this.loading = false
				})
			}
		},clearPostForm(done){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			
			this.coverPickerFile = ''
			this.coverPickerFileUrl = ''

			if(done != undefined){
				done()
			}
		},editRow(){
			if(this.$p.permissionChecker('profileInformationEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('img_url',this.imagePickerFile)
				formData.append('cover_img_url',this.coverPickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('management/profile/information/DBedit',formData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})

						this.clearPostForm()
						this.initial()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				})
			}
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
		this.initial()
	}
}
</script>