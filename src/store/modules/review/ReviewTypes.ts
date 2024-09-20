export type ReviewStatusType = 'success' | 'error' | 'refused' | 'wait' | '';

export interface ReviewState {
  loading: boolean;
  status: 'pending' | 'fulfilled' | 'rejected' | undefined;
  reviewStatus: ReviewStatusType;
}
