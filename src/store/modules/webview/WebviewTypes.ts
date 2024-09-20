export interface WebviewState {
  loading: boolean;
  startLoading: number;
  action: string;
  webviewRoute: {
    catalogCategory: string;
  };
  webviewTitle: {
    catalogCategory: string;
    static: string;
  };
  backToCamera: boolean;
}
