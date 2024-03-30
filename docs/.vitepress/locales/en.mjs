import { defineConfig } from 'vitepress';
import { START_YEAR, CURRENT_YEAR, LICENSE, EDIT_LINK } from '../constants.mjs';

export default defineConfig({
	lang: 'en',
	title: '@produck/compose',
	description: 'The final composer',
	themeConfig: {
		nav: [
			{ text: 'Guide', link: '/guide/what-is-this' },
			{ text: 'API Reference', link: '/guide/api' },
			{ text: 'Examples', link: '/examples/overview' },
			{ text: 'Produck', link: 'https://produckjs.com' },
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

		footer: {
			message: `Released under the ${LICENSE} License.`,
			copyright: `Copyright © ${START_YEAR}-${CURRENT_YEAR} Produck Team`,
		},

		editLink: {
			pattern: EDIT_LINK,
			text: 'Edit this page on GitHub',
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/produck' },
		],
	},
});
