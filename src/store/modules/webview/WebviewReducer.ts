import {createSlice} from '@reduxjs/toolkit';

export const webviewSlice = createSlice({
  name: 'webview',
  initialState: {
    loading: false,
    action: '',
    route: '/',
    routeNow: '/',
    tab: 'MainPage',
    title: '',
    backToCamera: false,
    hideTabBar: false,
    firstOpen: false,
    webviewOpen: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAction(state, action) {
      state.action = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setRoute(state, action) {
      state.route = action.payload;
    },
    setRouteNow(state, action) {
      state.route = action.payload;
    },
    setTab(state, action) {
      state.tab = action.payload;
    },
    setHideTabBar(state, action: {payload: boolean}) {
      state.hideTabBar = action.payload;
    },
    setFirstOpen(state, action) {
      state.firstOpen = action.payload;
    },
    setWebviewOpen(state, action) {
      state.webviewOpen = action.payload;
    },
  },
});
export const {
  setAction,
  setTitle,
  setRoute,
  setLoading,
  setRouteNow,
  setTab,
  setHideTabBar,
  setFirstOpen,
  setWebviewOpen,
} = webviewSlice.actions;
export default webviewSlice.reducer;
