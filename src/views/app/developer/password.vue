<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_developer_password')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="p-3">
					<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_user')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.member" :placeholder="$t('mix.table_user')" />
					
					<hr class="border-dotted mt-4" />
			
					<div class="d-flex justify-content-center align-items-content p-3 pt-2 pb-0">
						<el-button v-if="$p.permissionChecker('developerPasswordSearch')" @click="onSubmit()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.search')}}</el-button>
					</div>
				</div>
				
				<div v-if="memberDetail.login != ''" class="p-3 d-flex flex-column">
					<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_result')}}</label>
					<div class="table-responsive mt-3">
						<table class="table table-bordered text-mode" style="font-size:14px;">
							<tbody>
								<tr>
									<td width="30%"><b>{{$t('mix.table_user')}}</b></td>
									<td width="70%">{{memberDetail.login}}</td>
								</tr>
								<tr>
									<td width="30%"><b>{{$t('mix.table_name')}}</b></td>
									<td width="70%">{{memberDetail.name}}</td>
								</tr>
								<tr>
									<td width="30%"><b>{{$t('mix.table_password')}}</b></td>
									<td width="70%">{{memberDetail.password}}</td>
								</tr>
								<tr>
									<td width="30%"><b>{{$t('mix.table_security')}}</b></td>
									<td width="70%">{{memberDetail.security}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
export default{
    inject:['preloader'],
	data(){
		return {
			loading: true,
			permissionList: [],
			cronList: [],
			accountList: [],
			result: '',
			submitForm: {
				id: ''
			},postData: {
				data: '',
				language: ''
			},postForm: {
				member: '',
				security: ''
			},
			memberDetail: {
				login: '',
				icpass: '',
				name: '',
				password: '',
				security: ''
			},
			modalList:{},
		};
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('app/developer/password',this.postData)
			
			result.then((value)=>{
				var data = value.data

				if(value.valid){
					this.accountList = data.accountList
				}
				this.loading = false
			})
		},onSubmit(){
			if(this.$p.permissionChecker('developerPasswordSearch')){
				this.loading = true
				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_run_task'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value;
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod("app/developer/password/DBsubmit", this.postData)
					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							});
							
							this.memberDetail = data.memberDetail
							this.postForm.security = ''
						}else{
							this.$m.popupErrorMessage(data.returnMsg,this)
						}
						
						this.loading = false
					});
				}).catch(() => {
					this.loading = false
				});       
			}
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>