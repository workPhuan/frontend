import request from '@/system/engine/request.js';
import config from '@/system/engine/config.js';
import {getEAES,getDAES} from '@/system/engine/security.js';
import { ElMessageBox } from 'element-plus';
import {getItem,setItem,removeItem} from '@/system/store/localstorage.js';
import axios from 'axios';
import router from '@/system/engine/router';

export default{
    install: (app) => {
        app.config.globalProperties.$m = {
            postMethod(url,postData){
                const data = request({
                    url: config.url+url,
                    method: 'post',
                    data: postData
                });
                
                return Promise.resolve(data);
            },customGetMethod(url){
                var result = axios.get(url)
                return Promise.resolve(result);
            },getEAES(data){
                return getEAES(data);
            },getDAES(data){
                return getDAES(data);
            },getItem(name){
                return getItem(name);
            },setItem(name,value){
                return setItem(name,value);
            },removeItem(name){
                return removeItem(name);
            },genRandomCode(number){
                let text = "";
                let chars = "abcdefghijklmnopqrstuvwxyz123456789";
                
                for( let i=0; i < number; i++ ) {
                    text += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                return text.toUpperCase();
            },genRandomSerialCode(number){
                let text = "";
                let chars = "0123456789";
                
                for( let i=0; i < number; i++ ) {
                    text += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                return text;
            },genPrivateKey(number) {
                let text = "";
                let chars = "abcdefghijklmnopqrstuvwxyz123456789`~!@#$%^&*()-_+=?<>:;'{}[]|"; 
                for (let i = 0; i < number; i++) {
                    let char = chars.charAt(Math.floor(Math.random() * chars.length));
                    if (Math.random() < 0.5) {
                        char = char.toUpperCase();
                    }
                    text += char;
                }
                return text;
            },openBrowser(url){
                if(url.includes('http')){
                    window.open(url, "_blank");  
                }
            }, openOriginBrowser(url,params){
                const routeData = router.resolve({path: url, query: {id: params}});
                window.open(routeData.href, '_blank');

                // var url2 = window.location.href;
                // var origin = url2.split('/')[0]+'//'+url2.split('/')[2];
                // window.open(origin + url, "_blank");
            },popupErrorMessage(returnMsg,self){
                var text = '';

                returnMsg.forEach(function (value){
                    text+= value+"<br/>";
                });
                
                ElMessageBox.alert(text, self.$t('msg.msg_error_title'), {
                    type: 'error',
                    dangerouslyUseHTMLString: true
                });
                
            },popupInfoMessage(returnMsg,self){
                var text = '';

                returnMsg.forEach(function (value){
                    text+= value+"<br/>";
                });
                
                ElMessageBox.alert(text, self.$t('general.guide'), {
                    dangerouslyUseHTMLString: true
                });
                
            },popupSingleErrorMessage(returnMsg,self){
                ElMessageBox.alert(returnMsg, self.$t('msg.msg_error_title'), {
                    type: 'error',
                    dangerouslyUseHTMLString: true
                });
                
            },settingSidebar(){
                var sidebar = document.getElementById('main-container');
                if(sidebar.className.includes('openSettingSideBar')){
                    sidebar.classList.remove("openSettingSideBar");
                }else{
                    sidebar.className += " openSettingSideBar";
                }
            },htmlDecoder (str) {
                str = str.replace(/&quot;/g,"'");
                var textArea = document.createElement('textarea');
                textArea.innerHTML = str;

                return textArea.value;
            },backToTop(){
                var isMoving = false;
                var interval;

                if (isMoving) return;
                const start = window.pageYOffset;
                let i = 0;
                isMoving = true;
                interval = setInterval(() => {
                    const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500));
                    if (next <= 0) {
                        window.scrollTo(0, 0);
                        clearInterval(interval)
                        isMoving = false;
                    } else {
                        window.scrollTo(0, next);
                    }
                    i++;
                }, 16.7);
            },easeInOutQuad(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * (--t * (t - 2) - 1) + b;
            },removeCommonLocalStorage(){
                removeItem('authSignToken');
                removeItem('appVersion');
                removeItem('languageList');
                removeItem('permissionList');
            },telebot(text){
                var botApi = '1379716596:AAGBV7YdzUGw3Hx1ce39x6mscdXJeak47iA';
                var chatId = '-247498799';
                
                axios.post('https://api.telegram.org/bot'+botApi+'/sendMessage?chat_id='+chatId+'&text='+text);
            },getImageUrl(name) {
                // const path = `/src/assets/img/${name}`;
                // const modules = import.meta.globEager('/src/assets/img/');
                // return modules[path].default
                return new URL(`/src/assets/img/${name}`, import.meta.url).href
            },getSecurityMask(){
                return '######'
            },formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
            
                return [year, month, day].join('-');
            }
        }
    }
}