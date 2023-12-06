export default defineAppConfig({
	///pages: ["pages/index/index", "pages/my/index","pages/home/index"],
	pages: ["pages/home/index","pages/profile/index"],
	window: {
		backgroundColor: "#fff",
		backgroundTextStyle: "light",
		navigationBarBackgroundColor: "#fff",
		navigationBarTitleText: "Taro3",
		navigationBarTextStyle: "black",
		navigationStyle: "custom",
	},
	subPackages: [
		{
			root: "package",
			pages: [
				"package-a/index",
				"package-b/index",
				"package-c/index",
				"icon/index",

			],
		},
	],
	// tabBar: {
	// 	custom: false,
	// 	color: "#000000",
	// 	selectedColor: "#FF0000",
	// 	list: [
			// {
			// 	pagePath: "pages/index/index",
			// 	text: "首页",
			// },
			// {
			// 	pagePath: "pages/my/index",
			// 	text: "个人中心",
			// },
			// {
			// 	pagePath: "pages/home/index",
			// 	text: "主页",
			// },
	// 	],
	// },
});
