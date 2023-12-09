import { defineStore } from 'pinia';
import { useRoutePath } from '@/composables';

interface AuthState {
  /** 用户信息 */
  activeTab: string;
  navHeight: number;
  currTopicProcess: number;
}

export const useAppStore = defineStore('app-store', {
  state: (): AuthState => ({
    activeTab: useRoutePath(),
    navHeight: 0,
    currTopicProcess: 0
  }),
  getters: {
    /** 是否登录 */
    getActiveTab: state => state.activeTab,
    getNavHeight: state => state.navHeight,
    getCurrTopicProcess: state => state.currTopicProcess
  },
  actions: {
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
    setNavHeight(val: number) {
      this.navHeight = val;
    },
    setCurrTopicProcess(val: number) {
      this.currTopicProcess = val;
    },
    /** 重置app状态 */
    resetAuthStore() {
      this.$reset();
    }
  }
});
