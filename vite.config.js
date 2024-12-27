import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteFonts from 'vite-plugin-fonts'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: '3333',
		host: true
	},
	resolve: {
		alias: [
			{
				find: '/~/',
				replacement: `/src/assets/`,
			},
			{
				find: '@/',
				replacement: `/src/`,
			},
		],
	},
	plugins: [
		vue({
			refTransform: true,
			refSugar:true
		}),
		ViteFonts({
			google: {
				families: [
					{
						name: 'Fira Code',
						styles: 'wght@400;600',
					},
					{
						name: 'Montserrat',
						styles: 'wght@500;600;700;800;900',
					},
					{
						name: 'Roboto',
						styles: 'wght@300;400;500;600;700',
					},
				],
			},
		}),
	],
	// vue({
	// 	script: {
	// 		refSugar: any,
	// 		refTransform: any,
	// 	},
	// })
})
