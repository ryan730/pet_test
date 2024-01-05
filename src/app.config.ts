export default defineAppConfig({
  pages: ['pages/home/index'],
  window: {
    backgroundColor: '#fff',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  lazyCodeLoading: 'requiredComponents',
  usingComponents: {
    'ec-canvas': './components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
  },
  subPackages: [
    {
      root: 'package',
      // pages: ['package-a/index', 'package-b/index', 'package-c/index', 'icon/index']
      pages: [
        'profile/index',
        'answer/index',
        'finally/index',
        'simple_report/index',
        'detail_report/index',
        'list_report/index',
        'intro/index'
      ]
    }
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
