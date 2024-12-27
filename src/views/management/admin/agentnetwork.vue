<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_admin_agentnetwork')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="d-flex justify-content-between">
						<div class="p-3 d-flex flex-wrap">
							<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.member" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username')" @keyup.enter.native="initial()">
								<template #prepend>
									<label>{{$t('mix.table_username')}}</label>
								</template>
							</el-input>
							
							<el-button v-if="searchData.member != 'system'" class="custom-button h-auto plain m-2" @click="upline()" :loading="loading"><i class="fa-regular fa-up-from-line me-2"></i> {{$t('button.up_level')}}</el-button>
							<el-button class="custom-button h-auto plain m-2" @click="initial()" :loading="loading"><i class="fa-regular fa-search me-2"></i> {{$t('button.search')}}</el-button>
						</div>
					</div>
				</div>

				<el-tree class="mt-3 tree-list" :data="treeList" :load="loadTree" lazy node-key="id" :expand-on-click-node="false">
					<template #default="{node, data}">
						<div class="custom-tree-node">
							<div class="vertical-middle-item line-height-1rem">
								<div class="p-0 m-0" @click="infoRow(node.data.login)"><i class="fa-light fa-file me-2"></i>{{node.data.login}}  ({{node.data.name}})</div>
							</div>
						</div>
					</template>
				</el-tree>
			</el-card>

		</div>
	</div>
</template>

<script setup>
import { accountDetail } from '@/system/store/state.js'
</script>

<script>

export default {
    inject:['preloader'],
	data(){
		return {
			loading: false,
			total: 0,
			errors: [],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			postData: {
				data: '',
				language: '',
			},
			postForm:{
				member:'',
				sponsor: ''
			},
			searchData:{
				member: (accountDetail.value.role != 6) ? 'system' : accountDetail.value.username,
				id: ''
			},
			loadData:{
				member: (accountDetail.value.role != 6) ? 'system' : accountDetail.value.username,
				id: ''
			},
            defaultProps:{
				children: 'children',
				label:'label'
			},
			userDetail:{
				created_at: '',
				login: '',
				rank_id: '',
				personal_sales: [],
				total_personal_sales: 0,
			},
			treeList:[],
			modalList:{},
			securityCheck: 0
		}
	},
	methods:{
		initial(){
			if(this.loading == false){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.searchData)
				var result = this.$m.postMethod('management/admin/agentnetwork',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.treeList = []
						this.treeList.push(data)
					}else{
						this.$m.popupErrorMessage(value.returnMsg,this)
					}
					this.loading = false
					this.preloader(false)
				})
			}
		},upline(){
            if(this.searchData.member != '' && this.searchData.member != undefined && this.loading == false){
                this.loading = true
				this.preloader(true)
                this.postData.data = JSON.stringify(this.searchData)
                var result = this.$m.postMethod('management/admin/agentnetwork/upline',this.postData)
                result.then((value) => {
                    var data = value.data
                    if(value.valid){
                        this.treeList = []
                        this.treeList.push(data.treeList)
						this.searchData.member = data.upline
                    }else{
                        this.$m.popupErrorMessage(value.returnMsg,this)
                    }
					this.loading = false
					this.preloader(false)
                })
            }else{
                this.$m.popupErrorMessage([this.$t('error.error_member_empty')],this)
            }
		},loadTree(node, resolve){
            if(node != 'undefined'){
                this.loadData.id = node.data.id
                this.loadData.member = node.data.login
                
                if(node.data.hasOwnProperty('children') && node.data.children.length <= 0){
                    this.loading = true
                    this.preloader(true)
                    this.postData.data = JSON.stringify(this.loadData)
                    var result = this.$m.postMethod('management/admin/agentnetwork/loadMore',this.postData)
                    result.then((value) => {
                        var data = value.data
                        
                        if(value.valid){
                            if(data.length >= 1){
                                resolve(data)
                            }else{
                                resolve([])
                            }
                        }else{
                            resolve([])
                        }

						this.preloader(false)
						this.loading = false
                    })
                }else{
                    resolve([])
                }
            }
		},clearPostForm(done){
			this.postForm.member = ''
			this.postForm.sponsor = ''
			this.userDetail.created_at = ''
			this.userDetail.login = ''
			this.userDetail.personal_sales = []
			this.userDetail.total_personal_sales = 0
			this.userDetail.group_sales = []
			this.userDetail.total_group_sales = 0
			if(done != undefined){
				done()
			}
		}
	},created(){
		this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>