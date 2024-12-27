<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_developer_restore')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-tabs type="border-card">
				<el-tab-pane key="database" :label="$t('menu.app_developer_restore_data')" v-if="$p.permissionChecker('developerRestoreData')">
					<div class="ps-5 pe-5 pt-4 pb-4">
						<div class="d-flex align-items-center mb-3">
							<label class="text-theme font-8 fw-bold me-3"><span class="text-danger">*</span> {{$t('msg.msg_restore_system')}}</label>
							<el-button class="custom-button success font-8 pt-3 pb-3" v-if="$p.permissionChecker('developerRestoreData')" @click="dataRow()" :loading="loading">{{$t('button.confirm')}}</el-button>
						</div>
						
						<el-row :gutter="20">
							<el-col :xs="24" :sm="12">
								<label class="text-mode font-8 mb-3">{{$t('mix.table_command')}}</label>
								<ul class="text-mode ps-3">
									<li class="font-7 pb-2" v-for="(item,index) in cleanSql" :key="index">{{item}}</li>
								</ul>
							</el-col>
							
							<el-col :xs="24" :sm="12">
								<label class="text-mode font-8 mb-3">{{$t('mix.table_affected_table')}}</label>
								<ul class="text-mode ps-3">
									<li class="font-7 pb-2" v-for="(item,index) in cleanTable" :key="index">{{item}}</li>
								</ul>
							</el-col>
						</el-row>
					</div>
				</el-tab-pane>
				
				<el-tab-pane key="permission" :label="$t('menu.app_developer_restore_permission')" v-if="$p.permissionChecker('developerRestorePermission')">
					<div class="p-3">
						<lable>{{$t('mix.table_admin')}}</lable>
						<el-table :data="roleList" v-loading="loading" class="custom-table mt-3 mb-5" ref="tableTest" :show-header="true">
							<template #empty v-if="roleList.length=='0'">
								<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
								<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
								<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
							</template>

							<template v-for="title in ajaxTitles" :key="title.prop">
								<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
									<template #header>
										<p class="search-label">{{title.label}}</p>
									</template>
									
									<template v-if="title.prop == 'action'" #default="scope">
										<el-button v-if="$p.permissionChecker('developerRestorePermission')" @click="permissionRow(scope.row.id)" class="custom-button success m-1">{{$t('menu.app_developer_restore_permission')}}</el-button>
									</template>
								</el-table-column>
							</template>
						</el-table>
						
						<lable v-if="0" class="mt-5">{{$t('mix.table_agent')}}</lable>
						<el-table v-if="0" :data="roleAgentList" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
							<template #empty v-if="roleAgentList.length=='0'">
								<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
								<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
								<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
							</template>

							<template v-for="title in ajaxTitles" :key="title.prop">
								<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
									<template #header>
										<p class="search-label">{{title.label}}</p>
									</template>
									
									<template v-if="title.prop == 'action'" #default="scope">
										<el-button v-if="$p.permissionChecker('developerRestorePermission')" @click="permissionAgentRow(scope.row.id)" class="custom-button success m-1">{{$t('menu.app_developer_restore_permission')}}</el-button>
									</template>
								</el-table-column>
							</template>
						</el-table>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
export default{
    inject:['preloader'],
	data(){
		return {
			loading: true,
			currentJob: '',
			permissionList: [],
			errors: [],
			cleanSql: [],
			cleanTable: [],
			roleList: [],
			roleAgentList: [],
			submitForm: {
				id: ''
			},postData: {
				data: '',
				language: ''
			},postForm: {
				security: ''
			},ajaxTitles:[{
                prop:"name",
                label:this.$t('mix.table_name'),
                width: '200',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
		};
	},
	methods:{
		initial(){
			this.loading = true;
			this.postData.data = JSON.stringify(this.submitForm);
			var result = this.$m.postMethod('app/developer/restore',this.postData);
			result.then((value)=>{
				var data = value.data;
				if(value.valid){
					this.cleanSql = data.clean_sql;
					this.cleanTable = data.clean_table;
					this.roleList = data.roleList;
					this.roleAgentList = data.roleAgentList;
				}
				
				this.loading = false;
			});
				
		},dataRow(){
			if(this.$p.permissionChecker('developerRestoreData')){
				this.loading = true;
				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_restore_system'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value;
					this.postData.data = JSON.stringify(this.postForm);
					var result = this.$m.postMethod("app/developer/restore/DBdata", this.postData);
					result.then((value)=>{
						var data = value.data;

						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							});
							
							this.postForm.security = '';
						}else{
							this.$m.popupErrorMessage(data.returnMsg,this);
						}
						
						this.loading = false;
					});
				}).catch(() => {
					this.loading = false;
				});       
			}
		},permissionRow(id){
			if(this.$p.permissionChecker('developerRestorePermission')){
				this.loading = true;

				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_reset_permission'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value
                    this.postForm.role_id = id
					this.postData.data = JSON.stringify(this.postForm);
					var result = this.$m.postMethod("app/developer/restore/DBpermission", this.postData);
					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							});
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
		},permissionAgentRow(id){
			if(this.$p.permissionChecker('developerRestorePermission')){
				this.loading = true;

				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_reset_permission'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value
                    this.postForm.role_id = id
					this.postData.data = JSON.stringify(this.postForm);
					var result = this.$m.postMethod("app/developer/restore/DBpermissionagent", this.postData);
					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							});
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
	}, created(){
		this.preloader(false)
        this.postData.language = this.$m.getItem('currentLang')??'en';
		this.initial();
	}
}
</script>