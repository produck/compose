import { defineConfig } from 'vitepress';
import { START_YEAR, CURRENT_YEAR, LICENSE, EDIT_LINK } from '../constants.mjs';

export default defineConfig({
	lang: 'zh',
	title: '@produck/compose',
	description: '组装器的最终形态',

	themeConfig: {
		nav: [
			{ text: '指南', link: '/zh/guide/what-is-this' },
			{ text: 'API 参考', link: '/zh/guide/api' },
			{ text: '示例', link: '/zh/examples/overview' },
			{ text: 'Produck', link: 'https://produckjs.com/zh' },
		],

		sidebar: [
			{
				text: 'Examples',
				items: [
					{ text: 'Markdown Examples', link: '/markdown-examples' },
					{ text: 'Runtime API Examples', link: '/api-examples' },
				],
			},
		],

		docFooter: {
			prev: '上一章',
			next: '下一章',
		},
		outline: {
			label: '页面导航',
		},
		lastUpdated: {
			text: '最后更新于',
		},
		footer: {
			message: `基于 ${LICENSE} 协议发布`,
			copyright: `Copyright © ${START_YEAR}-${CURRENT_YEAR} Produck团队`,
		},
		editLink: {
			pattern: EDIT_LINK,
			text: '在GitHub上编辑',
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/produck' },
		],
	},
});
