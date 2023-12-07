import { defineStore } from 'pinia';

interface Info {
  describe: string;
  id: string;
  name: string;
  price: string;
  price_show: string;
  report_id: Array<string>;
  status: string;
  test_info: TestInfo;
}

interface State {
  info: Info;
}

interface TestInfo {
  process: string;
  report_id: string;
  test_id: string;
  updated_at: string;
  utid: string;
}

export const useProductInfoStore = defineStore('product-info-store', {
  state: (): State => ({
    info: {
      describe: '',
      id: '',
      name: '',
      price: '',
      price_show: '',
      report_id: [],
      status: '',
      test_info: {
        process: '',
        report_id: '',
        test_id: '',
        updated_at: '',
        utid: ''
      }
    }
  }),
  getters: {
    getInfo: state => state.info
  },
  actions: {
    /** 设置系统主题 */
    setInfo(values: State) {
      this.info = values;
    }
  }
});
