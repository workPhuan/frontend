<template>
	<Preloader v-if="perload"></Preloader>
	<RouterView v-slot="{ Component }" v-if="isRouterAlive">
		<transition name="fade-slow" mode="out-in">
			<component :is="Component" />
		</transition>
 	</RouterView>
	<el-backtop />
</template>

<script setup>
import { currentLanguage } from '@/system/store/state.js'
import Preloader from '@/components/preloader/index.vue'
import { nextTick,provide } from 'vue'
import {ZIM} from 'zego-zim-web'
import { useSound } from '@vueuse/sound'
import notificationSound from '@/assets/sound/notification.mp3'
import { ElNotification } from 'element-plus'
const { play } = useSound(notificationSound)

let isRouterAlive = true
let perload = false
let notification = false

const onRefresh = ()=>{
	isRouterAlive = false
	nextTick(() => {
		isRouterAlive = true
    })
}

const onPreload = (value)=>{
	perload = value
}

const onNotification = (message)=>{
	play()

	ElNotification({
		title: 'Latest Message',
		message: message,
	})
	
}

provide('reload', onRefresh)
provide('preloader', onPreload)
provide('notification', onNotification)
</script>

<script>
import { appConfig } from '@/components/zego-chat/utils.js'

export default{
	methods:{
		async initial(){
			ZIM.create(appConfig.appID)
		}
	},created(){
		if(currentLanguage.value == 'none'){
			currentLanguage.value = 'en'
            this.$m.setItem('currentLang','en')
            this.$i18n.locale = 'en'
		}else{
            this.$m.setItem('currentLang',currentLanguage.value)
            this.$i18n.locale = currentLanguage.value
		}
		this.initial();
	}
}
</script>

<style>
</style>
