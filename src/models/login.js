import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, fakeAuthenticateLogin, getAccountLogin } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import axios from 'axios';
// import { Storage } from 'react-jhipster';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {

      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(fakeAuthenticateLogin, payload);

      const bearerToken = response.id_token;
      if (bearerToken) {
        const jwt = bearerToken;
        // if (payload.rememberMe) {
          sessionStorage.setItem('AUTH_TOKEN_KEY', jwt);
          // Storage.local.set(AUTH_TOKEN_KEY, jwt);
        // } else {
        //   sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
        //   console.log(sessionStorage.getItem(AUTH_TOKEN_KEY),'8888')
        //   // Storage.session.set(AUTH_TOKEN_KEY, jwt);
        // }
      }

      const account = yield call(getAccountLogin)
      const authoritiesArr =  account.authorities || [];
      const isAdmin = "ROLE_ADMIN";
      let role = 'isUser';
      if(authoritiesArr.includes(isAdmin)){
        role = 'isAdmin'
      }else{
        role = 'isUser'
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: role,
        },
      });
      // Login successfully
      // if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      // }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
