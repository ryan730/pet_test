import { defineStore } from 'pinia';
import { useRoutePath } from '@/composables';

interface AuthState {
  /** 用户信息 */
  activeTab: string;
	navHeight: number;
}

export const useAppStore = defineStore('app-store', {
  state: (): AuthState => ({
    activeTab: useRoutePath(),
		navHeight: 0,
  }),
  getters: {
    /** 是否登录 */
    getActiveTab: state => state.activeTab,
    getNavHeight: state => state.navHeight,
  },
  actions: {
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
    setNavHeight(val: number) {
      this.navHeight = val;
    },
    /** 重置app状态 */
    resetAuthStore() {
      this.$reset();
    }
  }
});
