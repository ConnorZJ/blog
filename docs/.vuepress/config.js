module.exports = {
    title: 'Connor的博客',
    description: '个人博客',
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }]
    ],
	base: '/',
	markdown: {
		lineNumbers:true
	},
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
}