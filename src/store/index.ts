import { createStore } from 'vuex';
import {
  UserInfo
} from '@/ts-tokens/storeTokens';
import { userApi } from '@/apis/userApi';

const store = createStore({
  state () {
    return {
      userInfo: {
        column: '',
        email: '',
        nickName: '',
        _id: ''
      },
      token: ''
    };
  },
  mutations: {
    setUserInfo (state: any, userInfo: UserInfo) {
      state.userInfo = userInfo;
    },
    setToken (state: any, token: string) {
      state.token = token;
    }
  },
  actions: {
    getUserInfo (store) {
      console.log('store', store);
      return userApi.getUserInfo()
        .then(result => {
          store.commit('setUserInfo', result.data as UserInfo);
        });
    },
    logout (store) {
      store.commit('setToken', {});
      store.commit('setToken', '');
    }
  }
});

export { store };
export default store;
