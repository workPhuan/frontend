import axios from 'axios';
import router from '@/system/engine/router';
import {setItem,getItem,removeItem} from '@/system/store/localstorage';
const service = axios.create({
	// baseURL: process.env.BASE_API,
	timeout: 60000
});

service.interceptors.request.use(
	config =>{
		const token = getItem('authSignToken');
		
		config.headers['XSPOT'] = token;
		return config;
	}, error =>{
		router.push('/');
		Promise.reject(error);
	}

);

service.interceptors.response.use(
	response =>{
		const data = response.data;
		if(typeof data.maintenance !== 'undefined') {
			router.push('/maintenance');
			setItem('error_msg',data.error);
		}else if(data.error == 'error.invalid_token_empty' || data.error == 'error.invalid_token_expired' || data.error == 'error_token_mismatch'){
			removeItem('zegoToken');
			removeItem('authSignToken');
			router.push('/invaliduser');
			setItem('error_msg',data.error);
		}else if(typeof data.error_status !== 'undefined'){
			//if (location.hostname !== "localhost" && !location.hostname.includes('192.168.')){
				removeItem('zegoToken');
				removeItem('authSignToken');
			//}
			router.push('/nofound');
			setItem('error_msg',data.error);
		}else{
			return data;
		}
	},error =>{
		router.push('/nofound');
	}

);


export default service;