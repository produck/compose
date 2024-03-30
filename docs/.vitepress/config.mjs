import { defineConfig } from 'vitepress';
import * as Locale from './locales/index.mjs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	locales: {
		root: {
			label: 'English',
			...Locale.EN,
		},
		zh: {
			label: '简体中文',
			link: '/zh/',
			...Locale.ZH,
		},
	},
});
