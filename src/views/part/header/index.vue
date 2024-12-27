<template>
	<div class="header theme">
		<div class="h-100 d-flex justify-content-between align-items-center font-10">
			<div class="d-flex align-items-center justify-content-center h-100 text-white desktop-header">
				<div class="sidebar-logo text-center">
				 <router-link to="/dashboard">
      				<img class="ms-3 me-3 h-r-4 logo-small" :src="logo" alt="Logo" style="width: 50px; height: auto;"/>
   				 </router-link>
				</div>
				<div v-if="!$route.path.includes('/dashboard')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center" @click="openSideBar()">
					<i class="fa-solid fa-keyboard-left"></i>
				</div>
				<div v-if="$p.permissionChecker('dashboard')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center header-item" :class="$route.path.includes('/dashboard/') ? 'tab-active' : '' " @click="$router.push({ path: '/dashboard' }), sidebarPanel = 'close'">
					{{$t('menu.dashboard')}}
				</div>
				<div v-if="$p.permissionChecker('app')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center header-item" :class="$route.path.includes('/app/') ? 'tab-active' : '' " @click="$router.push({ path: '/app' })">
					{{$t('menu.app')}}
				</div>
				<div v-if="$p.permissionChecker('management')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center header-item" :class="$route.path.includes('/management/') ? 'tab-active' : '' " @click="$router.push({ path: '/management' })">
					{{$t('menu.management')}}
				</div>
				<div v-if="$p.permissionChecker('site')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center header-item" :class="$route.path.includes('/site/') ? 'tab-active' : '' " @click="$router.push({ path: '/site' })">
					{{$t('menu.site')}}
				</div>
				<div v-if="$p.permissionChecker('package')" class="h-100 ps-3 pe-3 pointer d-flex align-items-center justify-content-center header-item" :class="$route.path.includes('/package/') ? 'tab-active' : '' " @click="$router.push({ path: '/package' })">
					{{$t('menu.package_management')}}
				</div>
			</div>
			<div class="d-flex align-items-center justify-content-center h-100 text-white">
				<div v-if="$p.permissionChecker('chat')" class="ps-3 pe-3 pointer" @click="$m.openOriginBrowser('/chat')">
					<i class="fa-solid fa-headset"></i>
				</div>
				
				<div class="ps-3 pe-3 pointer" @click="pageReload();">
					<i class="fa-solid fa-refresh"></i>
				</div>

				<div class="ps-3 pe-3 pointer" @click="languagePanel='languages'">
					<!-- <div class="bg-white border-round-10 p-1"> -->
						<img :src="$m.getImageUrl('flag/'+$m.getItem('currentLang')+'.svg')" class="header-langauge-image">
					<!-- </div> -->
				</div>

				<div class="ps-3 pe-3 pointer">
					<el-dropdown>
						<span class="el-dropdown-link text-white" style="padding-top: 0.35rem;">
						    {{accountDetail.username}}
							<i class="ps-2 fa-solid fa-caret-down text-white"></i>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item v-if="$p.permissionChecker('accountPassword')" @click="modalList.passwordRow = true"><i class="fa-solid fa-shield pe-2"></i>{{$t('menu.common_account_password')}}</el-dropdown-item>
								<el-dropdown-item v-if="$p.permissionChecker('accountSecurity')" @click="modalList.securityRow = true"><i class="fa-solid fa-lock pe-2 py-1"></i>{{$t('menu.common_account_security')}}</el-dropdown-item>
								<el-dropdown-item v-if="$p.permissionChecker('accountGoogle')" @click="getGoogleRow()"><i class="fa-brands fa-google pe-2 py-1"></i>{{$t('menu.common_account_google')}}</el-dropdown-item>
								<el-dropdown-item divided @click="logout()"><i class="fa-solid fa-person-running pe-2"></i>{{$t('button.logout')}}</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
		</div>
		<div class="d-flex justify-content-between align-items-center font-10 mobile-header-bar d-none">
			<div class="d-flex align-items-center justify-content-center h-100 text-white">
				<div v-if="$p.permissionChecker('dashboard')" class="ps-3 pe-3 pointer d-flex align-items-center justify-content-center mobile-header-item" :class="$route.path.includes('/dashboard/') ? 'tab-active' : '' " @click="$router.push({ path: '/dashboard' }), sidebarPanel = 'close'">
					{{$t('menu.dashboard')}}
				</div>
				<div v-if="$p.permissionChecker('app')" class="ps-3 pe-3 pointer d-flex align-items-center justify-content-center mobile-header-item" :class="$route.path.includes('/app/') ? 'tab-active' : '' " @click="$router.push({ path: '/app' })">
					{{$t('menu.app')}}
				</div>
				<div v-if="$p.permissionChecker('management')" class="ps-3 pe-3 pointer d-flex align-items-center justify-content-center mobile-header-item" :class="$route.path.includes('/management/') ? 'tab-active' : '' " @click="$router.push({ path: '/management' })">
					{{$t('menu.management')}}
				</div>
				<div v-if="$p.permissionChecker('site')" class="ps-3 pe-3 pointer d-flex align-items-center justify-content-center mobile-header-item" :class="$route.path.includes('/site/') ? 'tab-active' : '' " @click="$router.push({ path: '/site' })">
					{{$t('menu.site')}}
				</div>
				<div v-if="$p.permissionChecker('package')" class="ps-3 pe-3 pointer d-flex align-items-center justify-content-center mobile-header-item" :class="$route.path.includes('/package/') ? 'tab-active' : '' " @click="$router.push({ path: '/package' })">
					{{$t('menu.package_management')}}
				</div>
			</div>
		</div>

		<el-dialog v-model="modalList.passwordRow" :title="$t('menu.common_account_password')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="accountDetail.username" :placeholder="$t('mix.table_username')" disabled/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_current_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.current_password" :placeholder="$t('mix.table_current_password')" show-password />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_password" :placeholder="$t('mix.table_new_password')" show-password/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password_confirm')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_password_confirm" :placeholder="$t('mix.table_new_password_confirm')" show-password />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="passwordRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.passwordRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.securityRow" :title="$t('menu.common_account_security')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>	
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="accountDetail.username" :placeholder="$t('mix.table_username')" disabled/>
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_current_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" :placeholder="$t('mix.table_current_security')" show-password />
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_security" :placeholder="$t('mix.table_new_security')" show-password/>
					</el-col>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_security_confirm')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_security_confirm" :placeholder="$t('mix.table_new_security_confirm')" show-password />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="securityRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.securityRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.googleRow" :title="(postForm.is_google) ? $t('menu.common_account_unbind_google') : $t('menu.common_account_google')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<template v-if="!postForm.is_google">
						<el-col :sm="24" class="mb-3 d-flex justify-content-center">
							<div>
								<img :src="postForm.google_qr"/>
								<p class="text-center">{{postForm.secret}} <el-button type="primary" size="small" @click="copy(postForm.secret),shareCopy()"><i class="fa-regular fa-copy"></i></el-button></p>
							</div>
						</el-col>
					</template>
					
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_google_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.google_2fa" :placeholder="$t('mix.table_google_code')"/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" :placeholder="$t('mix.table_security')" show-password />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="(postForm.is_google) ? unbindGoogleRow() : googleRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.googleRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<Language/>
	</div>
</template>

<script setup>
import logo from '@/assets/img/common/logo.png';
import Language from '@/components/language/index.vue'
import { sidebarPanel,accountDetail,pendingWithdraw,currentLanguage,languagePanel } from '@/system/store/state.js'
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
</script>

<script>
export default{
	inject:['preloader'],
	data(){
		return{
            postData: {
				logo,
				data: '',
				language: ''
			},
            postForm: {
				security: '',
				new_security: '',
				new_security_confirm: '',
				new_password: '',
				new_password_confirm: '',
				current_password: '',
				google_2fa: '',
				google_qr: '',
				secret: ''
			},
			modalList: {},
			loading: false,
			logoImage: this.$m.getItem('logoImage'),
		}
	},
	methods:{
		initial(){
			this.postData.data = JSON.stringify(this.postForm);
			var result = this.$m.postMethod('common/progress',this.postData)

			result.then((value)=>{
				 var data = value.data

				if(value.valid){
					pendingWithdraw.value = data.totalWithdraw
				}
			});
		},logout(){
			this.postData.data = JSON.stringify(this.postForm);
			var result = this.$m.postMethod('common/progress/logout',this.postData)

			result.then((value)=>{
				this.$m.removeItem('zegoToken');
				this.$m.removeItem('authSignToken');
				this.$m.removeItem('languageList');
				this.$m.removeItem('adminLanguageList');
				this.$m.removeItem('permissionList');
				this.$m.removeItem('shortcut');
				this.$m.removeItem('popupNews');
				this.$m.removeItem('error_msg');
				this.$m.removeItem('unreadNotification');
				this.$router.push('/');
			});
		},pageReload(){
			location.reload();
		},openSideBar(){
			if(sidebarPanel.value == 'open'){
				sidebarPanel.value = 'close'
			}else{
				sidebarPanel.value = 'open'
			}
		},clearPostForm(done){
			this.postForm.security = ''
			this.postForm.new_security = ''
			this.postForm.new_security_confirm = ''
			this.postForm.new_password = ''
			this.postForm.new_password_confirm = ''
			this.postForm.current_password = ''
			this.postForm.google_qr = ''
			this.postForm.google_2fa = ''
			this.postForm.secret = ''

			if(done != undefined){
				done()
			}
		},passwordRow(){
			if(this.$p.permissionChecker('accountPassword')){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('common/account/DBpassword',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.passwordRow = false
                        this.clearPostForm()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},securityRow(){
			if(this.$p.permissionChecker('accountSecurity')){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('common/account/DBsecurity',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.securityRow = false
                        this.clearPostForm()
                    }else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    
                    this.loading = false
                    this.preloader(false)
                })
			}
		},getGoogleRow(){
			if(this.$p.permissionChecker('accountGoogle') && this.loading == false){
				this.loading = true
				
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('common/account/google',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data
						this.modalList.googleRow = true
					}
					this.loading = false
				})
			}
		},googleRow(){
			if(this.$p.permissionChecker('accountGoogle')){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('common/account/DBgoogle',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.googleRow = false
                        this.clearPostForm()
                    }else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    
                    this.loading = false
                    this.preloader(false)
                })
			}
		},unbindGoogleRow(){
			if(this.$p.permissionChecker('accountGoogle')){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('common/account/DBunbind_google',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.googleRow = false
                        this.clearPostForm()
                    }else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    
                    this.loading = false
                    this.preloader(false)
                })
			}
		},shareCopy(){
            this.$message({
                type: 'success',
                message: this.$t('msg.msg_copy_success'),
                duration: 2000,
            })
        },
	},
	created(){
		this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>
