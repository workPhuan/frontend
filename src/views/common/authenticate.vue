<template>
	<div class="login-container bg-login d-flex justify-content-center align-items-center">
		<div class="snowflakes" aria-hidden="true">
			<div v-for="index in 10" :key="index" class="snowflake">❅</div>
		</div>

		<div class="login-box d-flex justify-content-center align-items-center flex-column ps-5 pe-5">
			<img :src="appImage" class="h-r-4"/>
			
			<p class="mt-3 text-white font-12 text-shadow fw-bold">{{$t('login.table_welcome_back', {appname: appName})}}</p>
			 
			<el-form @keyup.enter.native="handleSubmit">
				<el-input :placeholder="$t('mix.table_google_code')" class="mt-4 custom-input transparent" v-model="postForm.google_2fa" size="large">
					<template #prefix>
						<i class="fa-brands fa-google ms-2"></i>
					</template>
				</el-input>
			
				<el-button class="btn-login mt-4 w-100" @click="handleSubmit()" size="large">{{$t('button.submit')}}</el-button>         
			</el-form>
		</div>
	</div>
</template>

<script setup>
import Language from '@/components/language/index.vue';
import { accountDetail,currentLanguage } from '@/system/store/state.js'
</script>

<script>
export default {
    inject:['preloader'],
	components: {

	},data() {
		return {
			passwordType: 'password',
			loading: false,
			errors: [],
			postData: {
				data: '',
				language: ''
			},
			submitForm:{
				action: ''
			},
			postForm: {
				google_2fa: '',
				username: accountDetail.value.username,
				date: '',
			},
			appImage: '',
			appName: '',
		}
    },
    methods: {
        initial(){
			this.postData.data = JSON.stringify(this.submitForm)
			var result = this.$m.postMethod('common/progress',this.postData)
			result.then((value)=>{
				if(value.valid){
					var data = value.data
                    accountDetail.value = {};
					this.$m.setItem('logoImage', data.appImage)
					this.$m.setItem('languageList', JSON.stringify(data.memberLanguageList))
					this.$m.setItem('adminLanguageList', JSON.stringify(data.adminLanguageList))
					this.appImage = data.appImage
					this.appName = data.appTitle
					this.postForm.date = data.date
					this.captchaCode = data.captcha
				}
			})
		},handleSubmit() {
			if(this.loading == false){
				var checkValid = this.checkSubmit()
				if(checkValid){
					this.loading = true
					this.preloader(true)
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod('common/progress/DBgoogle',this.postData)
					result.then((value)=>{
						var data = value.data
						if(value.valid){
							this.$m.setItem('popupNews', 1)
							this.$m.setItem('unreadNotification', data.unreadNotification)
							this.$m.setItem('authSignToken', data.token)
							this.$m.setItem('permissionList', JSON.stringify(data.permission))
							this.$m.setItem('securityCheck', data.enableSecurity)
							accountDetail.value = data.accountDetail
							this.$message({
								message: this.$t('msg.welcome', {member: data.accountDetail.name}),
								type: 'success'
							})
                            this.$router.push('/dashboard')
						}else{
							this.errors = []
							this.$m.popupErrorMessage(data.returnMsg,this)
							this.initial()
						}
						this.loading = false
						this.preloader(false)
					})
					
				}else{
					this.errors = []
					this.$m.popupErrorMessage(this.errors,this)
				}
			}
		},checkSubmit(){
			this.errors = []
			
			if(this.postForm.google_2fa == ''){
				this.errors.push(this.$t('error.error_google_authenticator_empty'))
			}

			return (this.errors.length > 0) ? false : true
			
		}
	},created(){
		if(this.$m.getItem('authSignToken')){
			this.$router.push('/dashboard')
		}else{
            if (accountDetail.value.username == undefined) {
                this.$router.go(-1)
            }
            if(this.$m.getItem('currentLang') == ''){
                this.$m.setItem('currentLang','cn')
            }
            this.postData.language = this.$m.getItem('currentLang')??'en'
			this.initial()
		}
		this.$m.setItem('securityCheck', 0)
	}
}
</script>
