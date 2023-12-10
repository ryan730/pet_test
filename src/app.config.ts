export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profile/index',
    'pages/answer/index',
    'pages/finally/index',
    'pages/simply_report/index'
  ],
  window: {
    backgroundColor: '#fff',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  usingComponents: {
    'ec-canvas': './components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
  },
  subPackages: [
    // {
    // 	root: "package",
    // 	pages: [
    // 		"package-a/index",
    // 		"package-b/index",
    // 		"package-c/index",
    // 		"icon/index",
    // 	],
    // },
  ]
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
