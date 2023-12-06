import { defineStore } from "pinia";
import { useRoutePath } from "@/composables";

interface AuthState {
	/** 用户信息 */
	activeTab: string;
	navHeight: number;
	currTopicNumber: number;
}

export const useAppStore = defineStore("app-store", {
	state: (): AuthState => ({
		activeTab: useRoutePath(),
		navHeight: 0,
		currTopicNumber:1,
	}),
	getters: {
		/** 是否登录 */
		getActiveTab: (state) => state.activeTab,
		getNavHeight: (state) => state.navHeight,
		getCurrTopicNumber: (state) => state.currTopicNumber,
	},
	actions: {
		setActiveTab(tab: string) {
			this.activeTab = tab;
		},
		setNavHeight(val: number) {
			this.navHeight = val;
		},
		setCurrTopicNumber(val: number) {
			this.currTopicNumber = val;
		},
		/** 重置app状态 */
		resetAuthStore() {
			this.$reset();
		},
	},
});
