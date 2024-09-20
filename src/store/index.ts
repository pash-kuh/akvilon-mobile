import {configureStore} from '@reduxjs/toolkit';
import cityReducer from '@src/store/modules/city/CityReducer';
import userReducer from '@src/store/modules/user/UserReducer';
import reviewReducer from '@src/store/modules/review/ReviewReducer';
import configReducer from '@src/store/modules/config/ConfigReducer';
import cartReducer from '@src/store/modules/cart/CartReducer';
import webviewReducer from '@src/store/modules/webview/WebviewReducer';
import MobileConfigReducer from './modules/mobileConfig/MobileConfigReducer';
import CategoryReducer from './modules/category/CategoryReducer';
import BrandsReducer from './modules/brands/BrandsReducer';
import TagsReducer from './modules/tags/TagsReducer';
import BannersReducer from './modules/banners/BannersReducer';
import SliderReducer from './modules/slider/SliderReducer';
import justForYouReducer from './modules/justForYou/justForYouReducer';
import NewProductsReducer from './modules/newProducts/NewProductsReducer';
import LiquidationReducer from './modules/liquidation/LiquidationReducer';
import SelfServiceReducer from './modules/selfServiceData/SelfServiceReducer';
import StoriesReducer from './modules/stories/StoriesReducer';
import FavoriteReducer from './modules/favorites/FavoriteReducer';
import ContactsReducer from './modules/contacts/ContactsReducer';

export const store = configureStore({
  reducer: {
    city: cityReducer,
    user: userReducer,
    review: reviewReducer,
    config: configReducer,
    cart: cartReducer,
    webview: webviewReducer,
    mobileConfig: MobileConfigReducer,
    category: CategoryReducer,
    brands: BrandsReducer,
    tags: TagsReducer,
    banners: BannersReducer,
    slider: SliderReducer,
    selfService: SelfServiceReducer,
    justForYou: justForYouReducer,
    newProducts: NewProductsReducer,
    liquidation: LiquidationReducer,
    stories: StoriesReducer,
    favorites: FavoriteReducer,
    contacts: ContactsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
