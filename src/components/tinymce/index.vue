<template>
	<div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
		<textarea :id="tinymceId" class="tinymce-textarea" />
	</div>
</template>

<script>
import plugins from './plugins';
import toolbar from './toolbar';
import load from './dynamicLoadScript';

const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js';

export default {
	name: 'Tinymce',
	props: {
		id: {
			type: String,
			default: function() {
				return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
			}
		},modelValue: {
			type: String,
			default: ''
		},toolbar: {
			type: Array,
			required: false,
			default() {
				return []
			}
		},menubar: {
			type: String,
			default: 'file edit insert view format table'
		},height: {
			type: [Number, String],
			required: false,
			default: 360
		},
		width: {
			type: [Number, String],
			required: false,
			default: 'auto'
		}
	},
	data() {
		return {
			hasChange: false,
			hasInit: false,
			tinymceId: this.id,
			fullscreen: false,
			languageTypeList: {
				'en': 'en',
				'zh': 'zh_CN',
				'cn': 'zh_CN',
				'es': 'es_MX',
				'ja': 'ja'
			}
		}
	},computed: {
		containerWidth() {
			const width = this.width;
			if (/^[\d]+(\.[\d]+)?$/.test(width)) {
				return `${width}px`;
			}
			
			return width;
		}
	},watch: {
		modelValue(val) {
		if (!this.hasChange && this.hasInit) {
			this.$nextTick(() =>
				window.tinymce.get(this.tinymceId).setContent(val || ''));
			}
		}
	},mounted() {
		this.init();
	},activated() {
		if (window.tinymce) {
			this.initTinymce();
		}
	},deactivated() {
		this.destroyTinymce();
	},destroyed() {
		this.destroyTinymce();
	},methods: {
		init() {
			load(tinymceCDN, (err) => {
				if (err) {
					this.$message.error(err.message);
					return;
				}
				this.initTinymce();
			});
		},initTinymce() {
			const _this = this;
			window.tinymce.init({
				selector: `#${this.tinymceId}`,
				language: this.languageTypeList['en'],
				height: this.height,
				body_class: 'panel-body ',
				object_resizing: false,
				toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
				menubar: this.menubar,
				plugins: plugins,
				end_container_on_empty_block: true,
				powerpaste_word_import: 'clean',
				code_dialog_height: 450,
				code_dialog_width: 400,
				advlist_bullet_styles: 'square',
				advlist_number_styles: 'default',
				imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
				default_link_target: '_blank',
				link_title: false,
				nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
				init_instance_callback: editor => {
					if (_this.modelValue) {
						editor.setContent(_this.modelValue);
					}
					_this.hasInit = true
					editor.on('NodeChange Change KeyUp SetContent', () => {
						this.hasChange = true
						this.$emit('update:modelValue', editor.getContent());
					})
				},setup(editor) {
					editor.on('FullscreenStateChanged', (e) => {
						_this.fullscreen = e.state;
					})
				}
	
			})
		},destroyTinymce() {
			const tinymce = window.tinymce.get(this.tinymceId);
			if (this.fullscreen) {
				tinymce.execCommand('mceFullScreen');
			}

			if (tinymce) {
				tinymce.destroy();
			}
		},setContent(value) {
			window.tinymce.get(this.tinymceId).setContent(value);
		},getContent() {
			window.tinymce.get(this.tinymceId).getContent();
		},imageSuccessCBK(arr) {
			const _this = this;
			arr.forEach(v => {
				window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`);
			});
		}
	}
}
</script>