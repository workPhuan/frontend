<style>
.tox{
	z-index:9999999 !important
}
</style>

<template>
    <div class="tinymce-box">
		<Editor v-model="contentValue" :init="init" :disabled="disabled" @onClick="onClick" />
	</div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce' 
import 'tinymce/themes/silver' 
import 'tinymce/icons/default' 
import 'tinymce/plugins/advlist'  
import 'tinymce/plugins/anchor'  
import 'tinymce/plugins/autolink' 
import 'tinymce/plugins/autoresize'  
import 'tinymce/plugins/autosave'  
import 'tinymce/plugins/charmap'  
import 'tinymce/plugins/code'  
import 'tinymce/plugins/codesample'  
import 'tinymce/plugins/directionality' 
import 'tinymce/plugins/emoticons'  
import 'tinymce/plugins/fullpage'  
import 'tinymce/plugins/fullscreen'  
import 'tinymce/plugins/help'  
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'  
import 'tinymce/plugins/importcss' 
import 'tinymce/plugins/insertdatetime'  
import 'tinymce/plugins/link'  
import 'tinymce/plugins/lists' 
import 'tinymce/plugins/media' 
import 'tinymce/plugins/nonbreaking' 
import 'tinymce/plugins/pagebreak' 
import 'tinymce/plugins/paste' 
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/quickbars'  
import 'tinymce/plugins/save'  
import 'tinymce/plugins/searchreplace'  
import 'tinymce/plugins/tabfocus'  
import 'tinymce/plugins/table'  
import 'tinymce/plugins/template' 
import 'tinymce/plugins/textcolor' 
import 'tinymce/plugins/textpattern' 
import 'tinymce/plugins/toc' 
import 'tinymce/plugins/visualblocks'  
import 'tinymce/plugins/visualchars' 
import 'tinymce/plugins/wordcount'  

export default {
	name: 'TEditor',
	components: {
		Editor
	},
	props: {
		modelValue: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		plugins: {
			type: [String, Array],
			default: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave '
		},
		toolbar: {
			type: [String, Array],
			default: 'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
			styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
			table image media charmap hr pagebreak insertdatetime print preview | code selectall searchreplace visualblocks | indent2em lineheight formatpainter axupimgs'
		},
	},
	data(){
		return {
			init: {
				skin_url: '/tinymce/skins/ui/oxide', 
				plugins: this.plugins,  
				toolbar: this.toolbar,  
				fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',  
				font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',  //字体样式
				lineheight_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5", 
				height: 400,  
				placeholder: '在这里输入文字',
				branding: false,  
				resize: false,  
				elementpath: false,  
				content_style: "img {max-width:100%;}",
				content_css: '/tinymce/tinycontent.css', 
				paste_data_images: true, 
			},
			contentValue: this.modelValue,
		}
	},
	watch: {
		value(newValue) {
			this.contentValue = newValue
		},
		contentValue (newValue) {
			this.$emit('update:modelValue', newValue)
		},
	},
	created(){
		// this.tinyID = 'vue-tinymce-' + new Date() + (Math.random() * 1000).toFixed(0) + ''
	},
	mounted(){
		tinymce.init({})
	},
	methods: {
		onClick(e){
			this.$emit('onClick', e, tinymce)
		},
		clear(){
			this.contentValue = ''
		},
	},
}
</script>