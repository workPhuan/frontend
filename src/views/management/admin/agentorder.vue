<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_system')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-tabs type="border-card">
				<el-tab-pane key="order" :label="$t('menu.agent_order')">
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

							<template v-if="title.prop == 'status'" #default="scope">
								<p class="p-0 m-0 mb-2">{{$t('mix.table_account_status')}}: 
									<el-tag v-if="scope.row.status == 'normal'" type="success">{{$t('mix.table_normal')}}</el-tag>
									<el-tag v-else type="danger">{{$t('mix.table_suspended')}}</el-tag>
								</p>
							</template>
							
							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.id)">{{$t('button.info')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.id)">{{$t('button.client_info')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>
				</el-tab-pane>
				<el-tab-pane key="client" :label="$t('menu.management_client_client')">
					
				</el-tab-pane>
                <el-tab-pane key="system" :label="$t('menu.app')">
					
				</el-tab-pane>
                <el-tab-pane key="expense" :label="$t('menu.agent_expense')">
					
				</el-tab-pane>
			</el-tabs>
		</div>
		
		
	</div>
</template>

<script setup>
import Tinymce from '@/components/tinymce/index.vue'
</script>

<script>

export default {
    inject:['preloader'],
	data(){
		return {
			loading: true,
			errors: [],
            tableData: [],
			submitForm: {
				id:''
			},
			postData: {
				data: '',
				language: '',
			},
            listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'50',
			},{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'100',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'120',
			},{
                prop:"total_order",
                label:this.$t('mix.table_total_order'),
                width:'100',
			},{
                prop:"total_client",
                label:this.$t('mix.table_total_client'),
                width:'100',
			},{
                prop:"total_loan",
                label:this.$t('mix.table_total_loan'),
                width:'100',
			},{
                prop:"total_repay",
                label:this.$t('mix.table_total_repay'),
                width:'120',
			},{
                prop:"total_overdue",
                label:this.$t('mix.table_total_overdue'),
                width:'100',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
			postForm:{},
			modalList:{},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			categoryList: [],
			securityCheck: 0
		};
	},
	methods:{
		initial(){
            this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agentorder/ajaxTable',this.postData)
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
			this.postForm = {}
			this.postEditForm = {}
			this.postOriginalForm = {}
			this.currentImageID = ''
			
			this.postPageForm.id = ''
			this.postPageForm.multiple_language = 0
			this.postPageForm.single_title = ''
			this.postPageForm.single_content = ''
			this.postPageForm.title = []
			this.postPageForm.content = []
			
			if(done != undefined){
				done()
			}
		},clearPageForm(done){
			this.postPageForm.id = ''
			this.postPageForm.multiple_language = 0
			this.postPageForm.single_title = ''
			this.postPageForm.single_content = ''
			this.postPageForm.title = []
			this.postPageForm.content = []
			
			if(done != undefined){
				done()
			}
		},editRow(){
			if(this.$p.permissionChecker('toolSystemEdit')){
				this.postEditForm = {}
				const keys = Object.keys(this.postOriginalForm);
				keys.forEach((key) => {
					if(this.postOriginalForm[key] != this.postForm[key]){
						this.postEditForm[key] = this.postForm[key]
					}
				});

				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postEditForm)
				var result = this.$m.postMethod('app/tools/systems/DBedit',this.postData)

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
		},getPageRow(id){
			if(this.$p.permissionChecker('toolSystemPage')){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/systems/page',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postPageForm = data.thisDetail
						this.postPageForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						
						var content = '';
						content = this.decoder(JSON.stringify(this.postPageForm.content))
						this.postPageForm.content = JSON.parse(content)
						
						this.postPageForm.single_content = this.decoder(this.postPageForm.single_content)
						this.modalList.pageRow = true
					}
					this.loading = false
				})
			}
		},pageRow(){
			if(this.$p.permissionChecker('toolSystemPage')){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postPageForm)
				var result = this.$m.postMethod('app/tools/systems/DBpage',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						
						this.modalList.pageRow = false
						this.clearPostForm()
						this.clearPageForm()
						this.initial()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				})
			}
		},openImage(id){
			this.currentImageID = id
			this.openImageDialog = true
		},closeImageDialog(data) {
			this.openImageDialog = data
		},getImageDialog(data){
			this.postForm[this.currentImageID] = data.path
			this.openImageDialog = false
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")	
			}
			
			return value
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>