<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_admin_login')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username')" @keyup.enter.native="initial()" clearable>
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>
						
						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>
						
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					</div>
				</div>

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
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
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
			searchData:Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"id",
                label:this.$t('mix.table_id'),
                width:'60',
			},{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'120',
			},{
                prop:"ip",
                label:this.$t('mix.table_action_ip'),
                width:'200',
			},{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'140',
			},{
                prop:"user_agent",
                label:this.$t('mix.table_action_device'),
                width:'500',
			}],
			postForm:{
				id:'',
			},
			modalList:{},
		}
	},
	methods:{
		initial(){
			this.loading = true
			
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/admin/login/ajaxTable',this.postData)
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
			
			if(done != undefined){
				done()
			}
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>