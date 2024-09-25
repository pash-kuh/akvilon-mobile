import { BRAND_RED_50, GREY_3 } from '@src/assets/style/variable.style';
import BonusCard from '@src/components/general/BonusCard';
import Brands from '@src/components/general/Brands';
import CityHeader from '@src/components/general/CityHeader';
import HelpFind from '@src/components/general/HelpFind';
import JusForYou from '@src/components/general/JustForYou';
import PopularCategory from '@src/components/general/PopularCategory';
import Searchinput from '@src/components/general/SearchInput';
import Slider from '@src/components/general/Slider';
import { AppDispatch, RootState } from '@src/store';
import { fetchBrands } from '@src/store/modules/brands/BrandsActions';
import { setBrands } from '@src/store/modules/brands/BrandsReducer';
import { Brand } from '@src/store/modules/brands/BrandsTypes';
import { fetchCategories } from '@src/store/modules/category/CategoryActions';
import { setPopularCategories } from '@src/store/modules/category/CategoryReducer';
import { fetchImageSliderInfo } from '@src/store/modules/slider/SliderActions';
import { fetchTags } from '@src/store/modules/tags/TagsActions';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '@src/store/modules/banners/BannersActions';
import { setSlider } from '@src/store/modules/slider/SliderReducer';
import { getCookie, getFavsCookie, setCookie } from '@src/helpers/webview/cookie';
import { fetchJustForYou } from '@src/store/modules/justForYou/JustForYouActions';
import { fetchNewProducts } from '@src/store/modules/newProducts/NewProductsActions';
import Stories from '@src/components/general/Stories';
import { setTags } from '@src/store/modules/tags/TagsReducer';
import { setJustForYou } from '@src/store/modules/justForYou/justForYouReducer';
import { setNewProducts } from '@src/store/modules/newProducts/NewProductsReducer';
import { setBanners } from '@src/store/modules/banners/BannersReducer';
import { fetchLiquidationInfo } from '@src/store/modules/liquidation/LiquidationActions';
import { setLiquidation } from '@src/store/modules/liquidation/LiquidationReducer';
import { fetchFavorites } from '@src/store/modules/favorites/FavoriteActions';
import { setFavorite } from '@src/store/modules/favorites/FavoriteReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Support from '@src/components/general/Support';
import { useNavigation } from '@react-navigation/native';
import {
  setFirstOpen,
  setRoute,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import CustomLoader from '@src/components/general/CustomLoader';
import { fetchContacts } from '@src/store/modules/contacts/ContactsActions';
import {
  setContacts,
  setCurrentContact,
} from '@src/store/modules/contacts/ContactsReducer';
import CallComponent from '@src/components/general/CallComponent';
import MakeCallDrawer from '@src/components/drawers/makeCallDrawer';
import analytics from '@react-native-firebase/analytics';
import SliderBanner from '@src/components/general/Slider-banner';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '@src/types/route';

const { height } = Dimensions.get('window');
function MainPageScreen() {
  const { webview } = useSelector((s: RootState) => s);
  const { active, list } = useSelector((s: RootState) => s.city);
  const {
    config,
    category,
    user,
    tags,
    slider,
    justForYou,
    liquidation,
    newProducts,
    banners,
    favorites,
    contacts,
  } = useSelector((s: RootState) => s);
  const [brandsArray, setBrandsArray] = useState<Brand[][]>([]);
  const [loading, setLoading] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const dispatch: AppDispatch = useDispatch();

  //Берём id установленного города
  const cityId = list?.find((item) => item?.code === active)?.id || '';

  const getContacts = async () => {
    const { payload } = await dispatch(
      fetchContacts({ url: config.apiUrl }),
    ).unwrap();
    dispatch(setContacts(payload));
  };

  //Функция для установки номера для свзяи по выбранному городу
  const setCurrentContactHandler = () => {
    if (contacts?.contactsArray) {
      const currentContact = contacts.contactsArray?.find(
        (item) => item.mainOffice && active === item?.city?.code,
      );
      if (currentContact) {
        dispatch(setCurrentContact(currentContact.phones[0]));
      } else {
        dispatch(setCurrentContact('+7 (771) 043-40-63'));
      }
    } else {
      dispatch(setCurrentContact('+7 (771) 043-40-63'));
    }
  };

  const getCategory = async () => {
    const { payload } = await dispatch(
      fetchCategories({ url: config.apiUrl, id: cityId }),
    );
    dispatch(setPopularCategories(payload));
  };
  const getBanners = async () => {
    const { payload } = await dispatch(fetchBanners(config.apiUrl));
    if (payload.length !== 0) {
      dispatch(setBanners(payload));
    }
  };

  const getLiquidation = async () => {
    const { payload } = await dispatch(
      fetchLiquidationInfo({ url: config.apiUrl, id: cityId }),
    );
    dispatch(setLiquidation(payload));
  };

  const getImageSliderInfo = async () => {
    const { payload } = await dispatch(
      fetchImageSliderInfo({ url: config.apiUrl, id: cityId }),
    );
    dispatch(setSlider(payload));
  };

  const getTags = async () => {
    const { payload } = await dispatch(fetchTags(config.apiUrl));
    dispatch(setTags(payload));
  };

  const modifyBrends = (arr) => {
    const newArr = [];
    const devideLength = Math.ceil(arr.length / 4);
    for (let i = 0; i < devideLength; i++) {
      if (newArr.length < 3) {
        const item = arr.splice(0, 4);
        newArr.push(item);
      } else {
        newArr.push(arr);
      }
    }
    return newArr;
  };
  const getBrands = useCallback(async () => {
    const { payload } = await dispatch(fetchBrands(config.apiUrl));
    dispatch(setBrands(payload));
    setBrandsArray(payload);
    setBrandsArray(modifyBrends);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getJustFroYou = async () => {
    const cook = await getCookie(config.url);
    const { payload } = await dispatch(
      fetchJustForYou({
        url: config.apiUrl,
        id: cityId,
        ucCookie: cook?.value ? cook.value : '',
      }),
    );
    dispatch(setJustForYou(payload));
  };

  const getNewProducts = useCallback(async () => {
    const { payload } = await dispatch(
      fetchNewProducts({
        url: config.apiUrl,
        id: cityId,
      }),
    );
    await dispatch(setNewProducts(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newProducts.length]);

  //Если пользователь авторизован, то делаем запросы, если не авторизован,
  //То используем куки и локал сторедж
  const getFavorites = async () => {
    const favsArray = await AsyncStorage.getItem('favoritesArray');
    if (user?.token) {
      const { payload } = await dispatch(
        fetchFavorites({ url: config.apiUrl, token: user?.token }),
      );
      if (payload && favsArray) {
        const favsArr = payload.products.map((item) => (item.id = item));
        dispatch(setFavorite([...favsArr, ...JSON.parse(favsArray)]));
      }
      if (payload) {
        const favsArr = payload.products.map((item) => ({ id: item, code: '' }));
        // console.log(favsArr)
        dispatch(setFavorite(favsArr));
      }
      await setCookie(config.url, {
        name: 'favoritesArray',
        value: JSON.stringify([]),
      });
    } else {
      if (favsArray) {
        dispatch(setFavorite(JSON.parse(favsArray)));
      }
    }
  };

  const updateFavorites = async () => {
    await AsyncStorage.setItem('favoritesArray', JSON.stringify(favorites));
    const mappedForLocalArray = favorites.map((item) => item.code);
    await setCookie(config.url, {
      name: 'favoritesArray',
      value: JSON.stringify(mappedForLocalArray),
    });
    await AsyncStorage.getItem('favoritesArray');
    await getFavsCookie(config.url);
  };
  const makeCall = async (source: string) => {
    if (source === 'top_phone') {
      await analytics().logEvent('top_phone');
    } else {
      await analytics().logEvent('main_phone');
    }
    Linking.openURL(`tel:${contacts.currentContact}`);
  };

  const supportClose = () => {
    setOpenSupport(false);
  };

  //Событие нажатия по баннеру на главной
  const onBannerPress = (item) => {
    navigation.navigate('BrandsScreen', {
      route: `/brands/${item.code}`,
    });
    dispatch(setRoute(`redirect|/brands/${item.code}`));
    dispatch(setTab('MainPage'));
    dispatch(setTitle(''));
  };

  //Берём избранное при маунте главной
  useEffect(() => {
    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Обновление избранного, если неавторизован
  useEffect(() => {
    if (!user?.token) {
      updateFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.length, user?.token]);

  //Подгрузка большинства данных для главной
  useEffect(() => {
    if (justForYou.products.length === 0) {
      getJustFroYou();
    }
    if (newProducts.length === 0) {
      getNewProducts();
    }
    if (slider.length === 0) {
      getImageSliderInfo();
    }
    if (banners.length === 0) {
      getBanners();
    }
    if (tags.length === 0) {
      getTags();
    }
    if (brandsArray.length === 0) {
      getBrands();
    }
    if (category.popular.list.length === 0) {
      getCategory();
    }
    if (liquidation.length === 0) {
      getLiquidation();
    }
    if (contacts.contactsArray.length === 0) {
      getContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Берём контакты для установки номера по городу
  useEffect(() => {
    setCurrentContactHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, contacts.contactsArray]);

  //useEffect который временно фиксит проблему с подгрузкой webview,
  //Показываем лоадер с заданным временем
  useEffect(() => {
    if (!webview.firstOpen && user.token) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3500);

      return () => {
        dispatch(setFirstOpen(true));
        clearTimeout(timeout);
      };
    }
    if (!webview.firstOpen && !user.token) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 2500);

      return () => {
        dispatch(setFirstOpen(true));
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, height: '100%' }}>
          <CustomLoader loading={loading} />
        </View>
      ) : (
            <ScrollView>
              <View style={{ flex: 0.8 }}>
                {/* Компонент хэдера с поиском и городом */}
                <View style={style.headerContainer}>
                  <CityHeader makeCall={makeCall} />
                  <Searchinput />
                </View>
                 {/*Сторис*/}
                <View>
                  <Stories />
                </View>
                {/* Компонент бонусной карты */}
                <View style={style.bonusContainer}>
                  <BonusCard
                    points={user.loyalty?.points?.available}
                    user={user}
                  />
                </View>
              {/*  /!* Компонент звонка для заказов *!/*/}
                <View style={style.makeCallComponent}>
                  <CallComponent setOpenCall={setOpenCall} />
                </View>
                {/*<View style={style.imageContainer}>
                  {!!slider.length && <SliderImage />}
                </View>*/}
              {/*  /!* Компонент с популярными категориями *!/*/}
                <View style={style.categoryListContainer}>
                  <PopularCategory />
                </View>
              {/*  /!* Распродажа *!/*/}
                {liquidation.length !== 0 && (
                  <View style={style.liquidationSliderContainer}>
                    <Slider
                      title="Распродажа"
                      liquidation={true}
                      array={liquidation}
                    />
                  </View>
                )}
              {/*  /!* Компонент "Специально для вас" *!/*/}
                {!!justForYou?.products?.length && (
                  <View>
                    <JusForYou liquidation={false} justForYou={justForYou} />
                  </View>
                )}
              {/*  /!* Компонент для баннера, возможно будет как слайдер *!/*/}
                <View style={style.bannersContainer}>
                  {!!banners.length && !!banners[0] && (
                    <SliderBanner banner={banners[0]} />
                  )}
                </View>
              {/*  /!* Компонент "Новинки" *!/*/}
                {newProducts.length !== 0 && (
                  <View style={style.liquidationSliderContainer}>
                    <Slider
                      array={newProducts}
                      liquidation={false}
                      title="Новинки"
                    />
                  </View>
                )}
              {/*  /!* Компонент с брендами *!/*/}
                <View style={style.brandsContainer}>
                  <Brands
                    brands={brandsArray}
                    url={config.url}
                    title="Бренды"
                    onBannerPress={onBannerPress}
                  />
                </View>
              {/*  /!* Компонент с чипсами товаров и категорий *!/*/}
                <View style={style.helpFindContainer}>
                  <HelpFind />
                </View>
              </View>
            </ScrollView>
          )}
      {/* Компонент тех. поддержки */}
      {!loading && !webview.loading && (
        <Pressable
          onPress={() => setOpenSupport(true)}
          style={style.supportIcon}>
          <Image
            source={require('../../../assets/svg/phone.png')}
            style={style.icon}
          />
        </Pressable>
      )}
      {/* Модалка тех. поддержки */}
      {openSupport && (
        <View style={style.modal}>
          <Support
            close={supportClose}
            user={user}
            cityId={cityId}
            apiUrl={config.apiUrl}
          />
        </View>
      )}
      {/* Модалка звонка для заказов */}
      {openCall && (
        <View style={style.modal}>
          <MakeCallDrawer
            close={() => setOpenCall(false)}
            makeCall={makeCall}
          />
        </View>
      )}
    </View>
  );
}

export default React.memo(MainPageScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: height - 60,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  bonusContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: GREY_3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 24,
  },
  bannersContainer: {
    paddingHorizontal: 16,
    marginBottom: 48,
    marginTop: 32,
  },
  categoryListContainer: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: GREY_3,
    marginBottom: 48,
  },
  liquidationSliderContainer: {
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  brandsContainer: {
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  helpFindContainer: {
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  supportIcon: {
    flex: 0.2,
    backgroundColor: BRAND_RED_50,
    borderRadius: 25,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  makeCallComponent: {
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingBottom: 24,
  },
});
