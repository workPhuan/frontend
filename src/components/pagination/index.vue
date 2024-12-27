<template>
	<div :class="{'hidden':hidden}" class="pagination-container">
		<el-pagination :background="background" :current-page.sync="currentPage" :default-page-size="defaultPageSize" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" :disabled="false" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
	</div>
</template>

<script>
import { scrollTo } from '@/system/library/ScrollTo/scroll-to.js';

export default {
	props: {
		total: {
			required: true,
			type: Number
		},page: {
			type: Number,
			default: 1
		},pageSize: {
			type: Number
		},defaultPageSize: {
			type: Number,
			default: 10
		},limit: {
			type: Number,
			default: 20
		},currentPage: {
			type: Number
		},pageSizes: {
			type: Array,
			default() {
				return [10, 20, 30, 50, 100]
			}
		},layout: {
			type: String,
			default: 'total, sizes, prev, pager, next'
		},background: {
			type: Boolean,
			default: true
		},autoScroll: {
			type: Boolean,
			default: true
		}, hidden: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		currentPage: {
			handler: function(val, oldVal) {
			},get() {
				return this.page;
			},set(val) {
				this.$emit('update:page', val)
			}
		},pageSize: {
			handler: function(val, oldVal) {
			},get() {
				return this.limit;
			},set(val) {
				this.$emit('update:limit', val)
			}
		}
	},
	methods: {
		handleSizeChange(val) {
			this.$emit('paginationChange',{page: '', limit: val})
			if (this.autoScroll) {
				scrollTo(0, 800)
			}
		},
		handleCurrentChange(val) {
			this.$emit('paginationChange',{page: val, limit: ''})
			if (this.autoScroll) {
				scrollTo(0, 800)
			}
		}
	}
}
</script>
