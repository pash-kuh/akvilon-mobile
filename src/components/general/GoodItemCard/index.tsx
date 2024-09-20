import React, {useEffect, useState} from 'react';
import {GREY_3} from '@src/assets/style/variable.style';
import UnselectedLikeSvg from '@src/components/icons/unselectedLike';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  Pressable,
} from 'react-native';
import Price from '@src/components/common/Price';
import SelectedLikeSvg from '@src/components/icons/selectedLike';
import getImageUrl from '@src/helpers/getImageUrl';
import {MultiplyBlendColor} from 'react-native-image-filter-kit';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAction,
  setRoute,
  setTab,
} from '@src/store/modules/webview/WebviewReducer';
import {StackActions, useNavigation} from '@react-navigation/native';
import {
  addFavorite,
  removeFavorite,
} from '@src/store/modules/favorites/FavoriteReducer';
import {
  fetchAddFavorites,
  fetchRemoveFavorites,
} from '@src/store/modules/favorites/FavoriteActions';
import {RootState} from '@src/store';
import {LiquidationItem} from '@src/store/modules/liquidation/LiquidationTypes';

const {width: viewportWidth} = Dimensions.get('window');
const SLIDE_WIDTH = Math.round(viewportWidth / 2.45);
const ITEM_HORIZONTAL_MARGIN = 8;
const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
const SLIDER_WIDTH = viewportWidth;

type Props = {
  liquidation: boolean;
  item: LiquidationItem;
};

function GoodItemCard({liquidation, item}: Props) {
  const {favorites, config, user} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [like, setLike] = useState(false);

  //Функция проверяющая на то, в избранном элемент или нет
  //Если пользователь авторизован, то делаем запрос
  //Если не авторизован, то используем куки и локал сторедж
  const checkOnFavorites = () => {
    if (user?.token) {
      if (favorites && !!favorites.length) {
        const favItem = favorites?.find(
          (fav) => fav.id === item.id || fav.code === item.productCode,
        );
        if (favItem) {
          setLike(true);
          return true;
        }

        setLike(false);
        return false;
      }

      setLike(false);
      return false;
    } else {
      if (favorites && !!favorites.length) {
        const favItem = favorites?.find(
          (fav) => fav.id === item.id || fav.code === item.productCode,
        );
        if (favItem) {
          setLike(true);
          return true;
        }
        setLike(false);
        return false;
      }
      setLike(false);
      return false;
    }
  };

  //Функция клика добавления или удаления из избранного
  //Если пользователь авторизован, то делаем запрос
  //Если не авторизован, то используем куки и локал сторедж
  const likeItemHandler = async () => {
    setLike(!like);
    if (!checkOnFavorites()) {
      if (user?.token) {
        dispatch(addFavorite({id: item.id, code: item.productCode}));

        let favoritesArray = favorites;
        favoritesArray = [
          ...favoritesArray,
          {id: item.id, code: item.productCode},
        ];
        const mapperForFetch = favoritesArray.map((item) => item.id);
        dispatch(
          fetchAddFavorites({
            url: config.apiUrl,
            favoritesIds: mapperForFetch,
            token: user?.token,
          }),
        );
      } else {
        dispatch(addFavorite({id: item.id, code: item.productCode}));
        console.log(item.id, '----', item.productCode);
      }
    } else {
      if (user?.token) {
        dispatch(removeFavorite(item.id));

        dispatch(
          fetchRemoveFavorites({
            url: config.apiUrl,
            favoritesId: item.id,
            token: user?.token,
          }),
        );
      } else {
        dispatch(removeFavorite(item.id));
      }
    }
  };

  //Функция клика по товару, просто навигация
  const makeOrder = () => {
    dispatch(setRoute(`redirect|/p/${item.code}`));
    dispatch(setTab('Catalog'));
    dispatch(setAction('return'));
    navigation.dispatch(
      StackActions.push('CatalogMainScreen', {
        isWebPage: true,
        route: `/p/${item.code}`,
      }),
    );
  };

  const generateImageLink = () => {
    return 'https://static.akvilon.kz' + getImageUrl('p', 'sm_154', item.externalId);
  };

  useEffect(() => {
    checkOnFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  return (
    <Pressable style={style.goodItemCardContainer} onPress={makeOrder}>
      <View style={style.goodItemCardContent}>
        <MultiplyBlendColor
          dstImage={
            <Image
              source={{uri: generateImageLink()}}
              style={style.goodItemCardImage}
            />
          }
          srcColor={GREY_3}
        />
        {item.badges.length !== 0 && (
          <View style={style.badge}>
            {item.badges[0] === 'Акция' && (
              <View style={style.nonLiquidationPromoBadge}>
                <Text style={style.badgePromoText}>{item.badges[0]}</Text>
              </View>
            )}
            {item.badges[0] === 'Распродажа' && (
              <LinearGradient
                colors={['#FF8329', '#FC035A']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0.5}}
                useAngle={true}
                angle={135}
                style={style.liqudationBadge}>
                <Text style={style.badgeText}>{item.badges[0]}</Text>
              </LinearGradient>
            )}
            {!liquidation &&
              item.badges[0] !== 'Акция' &&
              item.badges[0] !== 'Распродажа' && (
                <View style={style.nonLiquidationBadge}>
                  <Text style={style.badgeTextNonLiq}>{item.badges[0]}</Text>
                </View>
              )}
          </View>
        )}
        <View style={style.likeSvg}>
          <Pressable onPress={likeItemHandler}>
            {like ? <SelectedLikeSvg /> : <UnselectedLikeSvg />}
          </Pressable>
        </View>
        {/* <View style={style.moreSvg}>
          <Pressable onPress={equalItemHandler}>
            {equal ? <SelectedEqualSvg /> : <UnselectedEqualSvg />}
          </Pressable>
        </View> */}
      </View>
      <Text numberOfLines={2} style={style.goodItemCardDescription}>
        {item.name ? item.name : 'Отсутствует имя'}
      </Text>
      <Price liquidation={liquidation} price={item.price} item={item} />
      {/* <GoodItemButton
        onPress={makeOrder}
        title="В корзину"
        textColor="#fff"
        backgroundColor={PRIMARY_50}
        liquidation={liquidation}
      /> */}
    </Pressable>
  );
}

export default React.memo(GoodItemCard);

export {SLIDE_WIDTH, ITEM_HORIZONTAL_MARGIN, ITEM_WIDTH, SLIDER_WIDTH};

const style = StyleSheet.create({
  goodItemCardContainer: {
    position: 'relative',
    flexDirection: 'column',
    flex: 1,
    width: ITEM_WIDTH,
  },
  goodItemCardContent: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: GREY_3,
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  goodItemCardImage: {
    flex: 1,
    width: '100%',
    height: 152,
    resizeMode: 'contain',
  },
  goodItemCardDescription: {
    fontFamily: 'PTRootUI-Medium',
    fontSize: 13,
    marginBottom: 13,
    height: 32,
  },
  likeSvg: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  moreSvg: {
    position: 'absolute',
    right: 8,
    top: 42,
  },
  badge: {
    position: 'absolute',
    left: 8,
    top: 12,
  },
  liqudationBadge: {
    borderRadius: 16,
    padding: 2,
  },
  nonLiquidationBadge: {
    backgroundColor: '#D6F1FF',
    borderRadius: 16,
    padding: 2,
  },
  nonLiquidationPromoBadge: {
    backgroundColor: '#f4ce67',
    borderRadius: 16,
    padding: 2,
  },
  badgeTextNonLiq: {
    alignItems: 'center',
    color: '#0862A2',
    fontSize: 13,
    padding: 1,
    paddingHorizontal: 3,
    fontFamily: 'PTRootUI-Medium',
  },
  badgeText: {
    alignItems: 'center',
    color: '#fff',
    fontSize: 13,
    padding: 1,
    paddingHorizontal: 3,
    fontFamily: 'PTRootUI-Medium',
  },
  badgePromoText: {
    alignItems: 'center',
    color: '#151719',
    fontSize: 13,
    padding: 1,
    paddingHorizontal: 3,
    fontFamily: 'PTRootUI-Medium',
  },
});
