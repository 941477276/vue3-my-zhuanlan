import { createStore } from 'vuex';
import {
  UserInfo
} from '@/ts-tokens/storeTokens';

const store = createStore({
  state () {
    return {
      userInfo: {
        id: null,
        username: null
      } as UserInfo
    };
  },
  mutations: {
    setUserInfo (state: any, userInfo: UserInfo) {
      state.userInfo = userInfo;
    }
  }
});

export { store };
export default store;
