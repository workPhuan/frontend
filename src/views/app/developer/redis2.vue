<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_developer_redis2')}}
			</label>
		</div>

		<div class="page-body p-3">
			<el-tabs type="border-card">
				<el-tab-pane key="redis2get" :label="$t('menu.app_developer_redis2')">
					<div class="p-3">

						<el-row :gutter="20">
							<el-col :sm="12" class="my-3">
								<label class="text-theme fw-bold"><span class="text-danger">*</span> Normal Key</label>
								<el-input class="custom-input mt-1" v-model="postForm.action" :placeholder="$t('mix.table_action')" />
							</el-col>

							<el-col :sm="12" class="my-3">
								<label class="text-theme fw-bold"><span class="text-danger">*</span> Key In Task</label>
								<el-input class="custom-input mt-1" v-model="postForm.actionTask" />
							</el-col>
						</el-row>

						<hr class="border-dotted mt-4" />

						<div class="d-flex justify-content-center align-items-content p-3 pt-2 pb-0">
							<el-button v-if="$p.permissionChecker('developerRedisData')" @click="onSubmit()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.search')}}</el-button>
						</div>

						<div v-if="getList!=''" class="d-flex flex-column">
							<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_result')}}</label>
							<div class="table-responsive mt-3">
								<table class="table table-bordered text-mode" style="font-size:14px;">
									<tbody>
										<tr v-for="(row, index) in getList">
											<td width="30%">{{index}}<b></b></td>
											<td width="70%">{{row}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</el-tab-pane>
					<el-tab-pane key="redis2edit" :label="'Redis '+$t('button.edit')">
						<div class="p-3">

							<el-row :gutter="20">
								<el-col :sm="12" class="my-3">
									<label class="text-theme fw-bold"><span class="text-danger">*</span> Normal Key</label>
									<el-input class="custom-input mt-1" v-model="postForm.action" :placeholder="$t('mix.table_action')" />
								</el-col>

								<el-col :sm="12" class="my-3">
									<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_value')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.value" :placeholder="$t('mix.table_value')" />
								</el-col>
							</el-row>

							<hr class="border-dotted mt-4" />

							<el-row :gutter="20">
								<el-col :sm="8" class="my-3">
									<label class="text-theme fw-bold"><span class="text-danger">*</span> Key In Task</label>
									<el-input class="custom-input mt-1" v-model="postForm.actionTask" />
								</el-col>

								<el-col :sm="8" class="my-3">
									<label class="text-theme fw-bold"><span class="text-danger">*</span> Field</label>
									<el-input class="custom-input mt-1" v-model="postForm.field" />
								</el-col>

								<el-col :sm="8" class="my-3">
									<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_value')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.value2" :placeholder="$t('mix.table_value')" />
								</el-col>
							</el-row>

							<hr class="border-dotted mt-4" />

							<div class="d-flex justify-content-center align-items-content p-3 pt-2 pb-0">
								<el-button v-if="$p.permissionChecker('developerRedisData')" @click="onEdit()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.submit')}}</el-button>
							</div>
						</div>
					</el-tab-pane>
				<el-tab-pane key="redis2delete" :label="'Redis '+$t('button.delete')">
					<div class="p-3">
						<label class="text-theme fw-bold"><span class="text-danger">*</span> {{$t('mix.table_action')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.action" :placeholder="$t('mix.table_action')" />

						<hr class="border-dotted mt-4" />

						<div class="d-flex justify-content-center align-items-content p-3 pt-2 pb-0">
							<el-button v-if="$p.permissionChecker('developerRedisData')" @click="onDelete()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.submit')}}</el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane key="redis2task" label="Reset Redis With Task">
					<div class="p-3">
						<el-table :data="taskList" v-loading="loading" class="custom-table mt-3 mb-5" ref="tableTest" :show-header="true">
						  	<template #empty v-if="taskList.length=='0'">
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
										<el-button v-if="$p.permissionChecker('developerRedisData')"  @click="taskRow(scope.row.name)" class="custom-button success m-1">{{$t('button.submit')}}</el-button>
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
			getList: {},
			result: '',
			submitForm: {
				id: ''
			},postData: {
				data: '',
				language: ''
			},postForm: {
                action: '',
                value: '',

                actionTask: '',
                field: '',
                value2: '',

				security: ''
			},ajaxTitles:[{
                prop:"name",
                label:this.$t('mix.table_name'),
                width: '200',
			},{
                prop:"sample",
                label:this.$t('mix.table_value'),
                width:'180',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			taskList:[],
			redisList:[],
			modalList:{},
		};
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.submitForm)
			var result = this.$m.postMethod('app/developer/redis2',this.postData)

			result.then((value)=>{
				var data = value.data

				if(value.valid){
					this.taskList = data.taskList;
					this.redisList = data.redisList;
				}
				this.loading = false
			})
		},clearPostForm(done){
            this.postForm.action = ''
            this.postForm.value = ''

            this.postForm.actionTask = ''
            this.postForm.field = ''
            this.postForm.value2 = ''

            this.postForm.security = ''
			if(done != undefined){
				done()
			}
		},onSubmit(){
			if(this.$p.permissionChecker('developerRedisData')){
				this.loading = true
				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_action'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value;
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod("app/developer/redis2/DBdata", this.postData)
					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							});

							this.getList = data.getList
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
		},onEdit(){
			if(this.$p.permissionChecker('developerRedisData')){
				this.loading = true
				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_action'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value;
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod("app/developer/redis2/DBedit", this.postData)
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

						this.clearPostForm()
						this.loading = false
					});
				}).catch(() => {
					this.loading = false
				});
			}
		},onDelete(){
			if(this.$p.permissionChecker('developerRedisData')){
				this.loading = true
				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_action')+' '+this.postForm.action, {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value;
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod("app/developer/redis2/DBdelete", this.postData)
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

						this.clearPostForm()
						this.loading = false
					});
				}).catch(() => {
					this.loading = false
				});
			}
		},taskRow(id){
			if(this.$p.permissionChecker('developerRedisData')){
				this.loading = true;

				this.$prompt(this.$t('msg.msg_security_password'), this.$t('msg.msg_action')+' '+id, {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					inputType: 'password'
				}).then(({ value }) => {
					this.postForm.security = value
                    this.postForm.task = id
					this.postData.data = JSON.stringify(this.postForm);
					var result = this.$m.postMethod("app/developer/redis2/DBreset", this.postData);
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
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>
