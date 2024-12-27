<template>
	<div class="page-container p-3">
		<el-card shadow="never" class="mb-3">
			
		</el-card>
	</div>
</template>

<script setup>
import { accountDetail } from '@/system/store/state.js'
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
				data: '',
				agent: ''
			},
			dataList: [],
		}
	},
	methods:{
			initial(){
				
			},

			redirectPage(path){
				this.$router.push(path)
			}
	},created(){
		this.postData.language = this.$m.getItem('currentLang')??'en'
		// this.initial()
	}
}
</script>
