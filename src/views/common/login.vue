<template>
	<div class="login-container bg-login d-flex justify-content-center align-items-center">
		<div class="snowflakes" aria-hidden="true">
			<div v-for="index in 10" :key="index" class="snowflake">❅</div>
		</div>

		<div class="login-box d-flex justify-content-center align-items-center flex-column ps-5 pe-5">
			<img :src="appImage" class="h-r-5"/>

			<p class="mt-3 text-white font-12 text-shadow fw-bold">{{$t('login.table_welcome_back', {appname: appName})}}</p>

			<el-form @keyup.enter.native="handleLogin">
				<el-input :placeholder="$t('login.table_username')" class="mt-4 custom-input transparent" v-model="postForm.username" size="large">
					<template #prefix>
						<i class="fa-light fa-user ms-2"></i>
					</template>
				</el-input>

				<el-input :placeholder="$t('login.table_password')" class="mt-3 custom-input transparent" v-model="postForm.password" show-password size="large">
					<template #prefix>
						<i class="fa-light fa-lock-keyhole ms-2"></i>
					</template>
				</el-input>

				<div class="d-flex gap-2 justify-content-between align-items-content mt-4">
					<el-input :placeholder="$t('mix.table_captcha')" class="custom-input h-auto transparent" v-model="postForm.captcha" size="large" />

					<div class="position-relative" v-if="captchaCode && captchaCode.length">
						<div class="d-flex align-items-center w-100">
							<div class="flex-grow-1 captcha-container">
								<div v-for="(item, index) in captchaCodeList" :key="'captcha_'+index" :style="{
									fontSize: item.style + 'px',
									fontWeight: 800,
									transform: 'rotate(' + item.rotate + 'deg)',
									}"
									class="np-captcha-character">
									{{ item.label }}
								</div>
							</div>

							<div class="pointer ms-3 text-theme" @click="initial()">
								<i class="fa-solid fa-refresh fa-lg"></i>
							</div>
						</div>
					</div>
				</div>

				<el-button class="btn-login mt-4 w-100" @click="handleLogin()" size="large">{{$t('button.login')}}</el-button>
			</el-form>
			<div class="d-flex change-language">
				<div class="text-white pointer change-language-item" v-for="item in languageList" @click="switchLanguage(item.code)">
					{{ item.name }}
				</div>
				<div class="text-white pointer change-language-item" @click="switchLanguage('zh')" v-if="0">
					{{ '繁體' }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Language from '@/components/language/index.vue';
import { accountDetail,currentLanguage } from '@/system/store/state.js'
</script>

<script>
export default {
    inject:['preloader','reload'],
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
				username: '',
				password: '',
				date: '',
				captcha: '',
			},
			captchaCode:'',
			captchaCodeList: [],
			languageList: [],
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
					this.languageList = data.adminLanguageList
					this.appImage = data.appImage
					this.appName = data.appTitle
					this.postForm.date = data.date
					this.captchaCode = data.captcha
					this.setCaptchaPattern();
				}
			})
		},handleLogin() {
			if(this.loading == false){
				var checkValid = this.checkLogin()
				if(checkValid){
					this.loading = true
					this.preloader(true)
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod('common/progress/login',this.postData)
					result.then((value)=>{
						var data = value.data
						if(value.valid){
							accountDetail.value = data.accountDetail
							if(accountDetail.value.is_google){
								this.$router.push('/authenticate')
							}else{
								this.$m.setItem('popupNews', 1)
								this.$m.setItem('unreadNotification', data.unreadNotification)
								this.$m.setItem('authSignToken', data.token)
								this.$m.setItem('permissionList', JSON.stringify(data.permission))
								this.$m.setItem('securityCheck', data.enableSecurity)
								this.$m.setItem('zegoUserName', data.zegoUserName)
								this.$m.setItem('zegoUserID', data.zegoUserID)
								this.$message({
									message: this.$t('msg.welcome', {member: data.accountDetail.name}),
									type: 'success'
								})
								if(accountDetail.value.role == 6 || accountDetail.value.role == 7){
									this.$router.push('/chat')
								}else{
									this.$router.push('/dashboard')
								}
							}
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
		},checkLogin(){
			this.errors = []

			if(this.postForm.username == ''){
				this.errors.push(this.$t('error.error_username_empty'))
			}

			if(this.postForm.password == ''){
				this.errors.push(this.$t('error.error_password_empty'))
			}

			return (this.errors.length > 0) ? false : true

		},getFontSize() {
			const fontVariations = [14, 20, 30, 36, 40];
			return fontVariations[Math.floor(Math.random() * 5)];
		},getRotationAngle() {
			const rotationVariations = [5, 10, 20, 25, -5, -10, -20, -25];
			return rotationVariations[Math.floor(Math.random() * 8)];
		},setCaptchaPattern(){
			this.captchaCodeList = [];
			for(let index in this.captchaCode){
				var chars = []
				chars['label'] = this.captchaCode[index]
				chars['style'] = this.getFontSize()
				chars['rotate'] = this.getRotationAngle()

				this.captchaCodeList.push(chars);
			}
		},switchLanguage(value){
			this.locale = value
			this.$i18n.locale = value
			this.$m.setItem('currentLang',value)
			this.reload()
		}
	},created(){
		if(this.$m.getItem('authSignToken')){
			this.$router.push('/dashboard')
		}else{
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
