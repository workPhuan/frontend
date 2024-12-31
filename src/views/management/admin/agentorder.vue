<template>
	<div class="page-container">
		<div class="page-header">
			<el-button style="cursor: pointer;" class="custom-button" type="info" @click="toAgentPage()">
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{"Back to " + $t('menu.management_admin_agent')}}
			</el-button>
		</div>
		
		<div class="page-body p-3">
            <el-card shadow="never">
                <div>
                    <h5>{{$t('mix.table_agent_info')}}</h5>
                    <el-descriptions>
                        <el-descriptions-item :label="$t('mix.table_account')">{{ agentDetail.master_id }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_order')">{{ agentDetail.total_order }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_loan')">{{ agentDetail.total_loan }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_name')">{{ agentDetail.login }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_client')">{{ agentDetail.total_client }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_repay')">{{ agentDetail.total_repay }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_status')">{{ agentDetail.status }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('menu.management_agent_is_view_other')">{{ agentDetail.is_view_other_agent }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_total_overdue')">{{ agentDetail.total_overdue }}</el-descriptions-item>
                    </el-descriptions>
                </div>
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
                                    <div class="status-label text-center" :style="'border: 1px solid '+scope.row.status_color+';color:'+scope.row.status_color">
                                    {{scope.row.status}}
                                    </div>
                                </template>
                                
                                <template v-if="title.prop == 'action'" #default="scope">
                                    <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.id)">{{$t('button.info')}}</el-button>
                                    <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.id)">{{$t('button.client_info')}}</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                    <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                    </el-tab-pane>
                    <el-tab-pane key="client" :label="$t('menu.management_client_client')">
                        
                    </el-tab-pane>
                    <el-tab-pane key="system" :label="$t('menu.app')">
                        
                    </el-tab-pane>
                    <el-tab-pane key="expense" :label="$t('menu.agent_expense')">
                        
                    </el-tab-pane>
                </el-tabs>
            </el-card>
		</div>
		
		
	</div>
</template>

<script setup>
import Tinymce from '@/components/tinymce/index.vue'
import { storeTempID } from '@/system/store/state.js'
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
			errors: [],
            tableData: [],
            total: 0,
            searchData:Object.assign({}, searchForm),
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
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'120',
			},{
                prop:"no",
                label:this.$t('mix.table_product_no'),
                width:'80',
			},{
                prop:"product_id",
                label:this.$t('mix.table_product'),
                width:'120',
			},{
                prop:"master_id",
                label:this.$t('mix.table_client'),
                width:'100',
			},{
                prop:"loan_amount",
                label:this.$t('mix.table_loan_amount'),
                width:'90',
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'90',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
			postForm:{},
			modalList:{},
            agentDetail:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			categoryList: [],
			securityCheck: 0
		};
	},
	methods:{
        getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.searchData.agent_id = storeTempID.agent_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/agentorder',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.agentDetail = data.agentDetails
				}
				this.initial()
			})

		},
		initial(){
            this.loading = true
			this.searchData.agent_id = storeTempID.agent_id
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
		},toAgentPage(){
			this.$router.push('/management/admin/agent');
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
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
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
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
        if(storeTempID.agent_id == "" || storeTempID.agent_id == undefined){
			this.$router.push('/management/admin/agent');
		}else{
            this.getInitial()
        }
	}
}
</script>