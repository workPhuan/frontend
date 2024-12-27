<template>
	<div class="page-container p-3">
		<!-- <agentdashboard v-if="accountDetail.role == 6"/> -->
		<!-- <admindashboard v-else /> -->
		<admindashboard />
	</div>
</template>

<script setup>
import { accountDetail } from '@/system/store/state.js'
import admindashboard from '@/views/dashboard/admin.vue'
import agentdashboard from '@/views/dashboard/agent.vue'
</script>

<script>
export default{
	inject:['preloader'],
	data(){
		return{
			loading: false,
			postData: {
				data: '',
				language: ''
			},
			postForm:{
				data: ''
			},
			dataList: [],
			ajaxTitles:[],
			statisticDay: 0,
			registerChartSeries: [{
				data: []
			}],
		}
	},
	methods:{

	},created(){
		if(accountDetail.value.role == 6 || accountDetail.value.role == 7){
			this.$router.push('/chat')
		}
		this.postData.language = this.$m.getItem('currentLang')??'en'
	}
}
</script>
