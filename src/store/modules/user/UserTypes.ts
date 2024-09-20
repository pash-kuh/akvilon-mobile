export interface UserItem {
  active: boolean;
  birthday: Date;
  confirmPassword: boolean;
  createAt: Date;
  email: string;
  id: string;
  iin: string;
  isSubscription: boolean;
  loyalty: LoyaltyItem;
  name: string;
  notices?: string;
  patronymic: string;
  phone: string;
  sex: 'M' | 'W';
  subscriptionChannel: {
    email: boolean;
    phone: boolean;
  };
  subscriptions: {
    actions: boolean;
    orders: boolean;
  };
  surname: string;
}

export interface LoyaltyItem {
  activated: boolean;
  activatedAt: Date;
  id: string;
  isMain: boolean;
  isPro: boolean;
  isProcessActivation: boolean;
  nextStatusName: string;
  number: string;
  points: {
    available: number;
    awaiting?: string;
    nearestWriteOff: {date: Date; amount: number};
  };
  specialization: string;
  status: {id: string; name: string};
  toNextStatus: number;
  balance: string;
  qrCodeInfo: {
    card?: string;
    code?: string;
  };
}

export interface UserState {
  token: string;
  phone: string;
  user: UserItem;
  loyalty: LoyaltyItem;
  loading: boolean;
  versionNumber: string;
  mobileOS: string;
  versionOS: string;
  currentVersionNumber: {
    vAndroid: string;
    viOS: string;
  };
  confirmation: string;
  appOpen: boolean;
  updateModalOpen: {
    vAndroid: boolean;
    viOS: boolean;
  };
}
