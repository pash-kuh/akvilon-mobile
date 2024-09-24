import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAction(state, action: PayloadAction<string>) {
      state.action = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setRoute(state, action: PayloadAction<string>) {
      state.route = action.payload;
    },
    setRouteNow(state, action: PayloadAction<string>) {
      state.route = action.payload;
    },
    setTab(state, action: PayloadAction<string>) {
      state.tab = action.payload;
    },
    setHideTabBar(state, action: PayloadAction<boolean>) {
      state.hideTabBar = action.payload;
    },
    setFirstOpen(state, action: PayloadAction<boolean>) {
      state.firstOpen = action.payload;
    },
    setWebviewOpen(state, action: PayloadAction<boolean>) {
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
