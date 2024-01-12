import { defineStore } from 'pinia';
import { useRoutePath } from '@/composables';

interface AuthState {
  /** 用户信息 */
  activeTab: string;
  navHeight: number;
  currTopicProcess: number;
  bottomArea: any;
}

export const useAppStore = defineStore('app-store', {
  state: (): AuthState => ({
    activeTab: useRoutePath(),
    navHeight: 0,
    currTopicProcess: 0,
    bottomArea: {
      bottomH: 0
    }
  }),
  getters: {
    /** 是否登录 */
    getActiveTab: state => state.activeTab,
    getNavHeight: state => state.navHeight,
    getBottomArea: state => state.bottomArea,
    getCurrTopicProcess: state => state.currTopicProcess
  },
  actions: {
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
    setNavHeight(val: number) {
      this.navHeight = val;
    },
    setBottomArea(val: any) {
      this.bottomArea = val;
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
