<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_user_trace')}}
			</label>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">

						<div class="fixed-width-200">
							<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.backup" :placeholder="$t('mix.table_date')" clearable @change="initial()">
								<el-option v-for="(item,key) in backupList" :label="item" :value="key">{{item}}</el-option>
							</el-select>
						</div>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="initial()" clearable>
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.uri" :placeholder="$t('mix.table_please_enter')+$t('mix.table_uri')" @keyup.enter.native="initial()" clearable>
							<template #prepend>
								<label>{{$t('mix.table_uri')}}</label>
							</template>
						</el-input>

						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>

            			<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.request" :placeholder="$t('mix.table_please_enter')+$t('mix.table_request')" @keyup.enter.native="initial()" clearable>
							<template #prepend>
								<label>{{$t('mix.table_request')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.response" :placeholder="$t('mix.table_please_enter')+$t('mix.table_response')" @keyup.enter.native="initial()" clearable>
							<template #prepend>
								<label>{{$t('mix.table_response')}}</label>
							</template>
						</el-input>

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

							<template v-if="title.prop == 'login'" #default="scope">
								<p class="p-0 m-0" v-if="0">{{$t('mix.table_system_id')}}: {{scope.row.system_id}}</p>
								<p class="p-0 m-0">{{$t('mix.table_phone_mobile')}}: {{scope.row.login}}</p>
								<p class="p-0 m-0">{{$t('mix.table_name')}}: {{scope.row.name}}</p>
							</template>

							<template v-if="title.prop === 'request'" #default="scope">
								<el-button-group>
								<el-button @click="toggleExpandReq(scope.row)">
									{{ scope.row.expand_req ? 'Collapse' : 'Expand' }}
								</el-button>
								</el-button-group>
								<div v-if="scope.row.expand_req">
								{{ scope.row.request }}
								</div>
							</template>
							<template v-if="title.prop === 'response'" #default="scope">
								<el-button @click="toggleExpanded(scope.row)">
									{{ scope.row.expanded ? 'Collapse' : 'Expand' }}
								</el-button>
								<div v-if="scope.row.expanded">
									{{ scope.row.response }}
								</div>
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
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
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
				prop:"created_at",
				label:this.$t('mix.table_created_at'),
				width:'120',
			},{
				prop:"login",
				label:this.$t('mix.table_username'),
				width:'200',
			},{
				prop:"ip",
				label:this.$t('mix.table_action_ip'),
				width:'100',
			},{
				prop:"uri",
				label:this.$t('mix.table_uri'),
				width:'180',
			},{
				prop:"time",
				label:this.$t('mix.table_time_second'),
				width:'80',
			},{
				prop:"request",
				label:this.$t('mix.table_request'),
				width:'150',
			},{
				prop:"response",
				label:this.$t('mix.table_response'),
				width:'200',
			}],
			postForm:{
				id:'',
			},
			backupList:{},
			modalList:{},
		}
	},
	methods:{
		initial(){
			this.loading = true

			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/user/trace/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.backupList = data.backupList
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
		},toggleExpanded(row) {
			row.expanded = !row.expanded;
		},toggleExpandReq(row) {
			row.expand_req = !row.expand_req;
		},shareCopy(){
            this.$message({
                type: 'success',
                message: this.$t('msg.msg_copy_success'),
                duration: 2000,
            })
        },
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>
