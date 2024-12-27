<template>
	<div class="page-container p-3">
		<el-card shadow="never" class="mb-3 streamer-token">
            <div>
                <label class="text-theme font-8 fw-bold ps-2">{{$t('mix.table_stream_url')}}</label>
                <div class="d-flex align-items-center">
                    <el-input class="custom-input m-2" v-model="streamUrl" readonly />
                    <el-button class="custom-button primary" @click="copy(streamUrl),copyInput()">{{$t('button.copy')}}</el-button>
                </div>
            </div>
		</el-card>
	</div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
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
			streamUrl: '',
			modalList: {}
		}
	},
	methods:{
			initial(){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('common/agentdashboard',this.postData);
				result.then((value)=>{
					this.loading = false
					var data = value.data;
					if(value.valid){
						this.streamUrl = data.streamUrl

					}
				});
			},
			clearPostForm(done){
				this.initial()
				if(done != undefined){
					done()
				}
			},
            copyInput(){
                try {
                    this.$message({showClose: true,message: this.$t('msg.msg_copy_success'),type: 'success'});
                } catch (err) {
                    // alert('Oops, unable to copy');
                }
            },
			redirectPage(path){
				this.$router.push(path)
			},
	},created(){
		this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
	}
}
</script>
