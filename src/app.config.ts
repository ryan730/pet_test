export default defineAppConfig({
  pages: ['pages/home/index'],
  window: {
    backgroundColor: '#fff',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '宠物性格测试',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom' // 给全局的导航栏隐藏
  },
  lazyCodeLoading: 'requiredComponents',
  usingComponents: {
    'ec-canvas': './components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
  },
  subPackages: [
    {
      root: 'package',
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
});
