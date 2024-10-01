import React, { useEffect, useState } from 'react';
import { GREY_3, WHITE } from '@src/assets/style/variable.style';
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
import { MultiplyBlendColor } from 'react-native-image-filter-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import {
    setAction,
    setRoute,
    setTab,
} from '@src/store/modules/webview/WebviewReducer';
import { StackActions, useNavigation } from '@react-navigation/native';
import {
    addFavorite,
    removeFavorite,
} from '@src/store/modules/favorites/FavoriteReducer';
import {
    fetchAddFavorites,
    fetchRemoveFavorites,
} from '@src/store/modules/favorites/FavoriteActions';
import { RootState } from '@src/store';
import { LiquidationItem } from '@src/store/modules/liquidation/LiquidationTypes';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDE_WIDTH = Math.round(viewportWidth / 2.45);
const ITEM_HORIZONTAL_MARGIN = 8;
const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
const SLIDER_WIDTH = viewportWidth;

type Props = {
    liquidation: boolean;
    item: LiquidationItem;
};

function SelfServiceItemCard({ liquidation, item }: Props) {
    const { favorites, config, user } = useSelector((s: RootState) => s);
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
                dispatch(addFavorite({ id: item.id, code: item.productCode }));

                let favoritesArray = favorites;
                favoritesArray = [
                    ...favoritesArray,
                    { id: item.id, code: item.productCode },
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
                dispatch(addFavorite({ id: item.id, code: item.productCode }));
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
        <Pressable onPress={makeOrder}>
            <View style={style.goodItemCardContent}>
                <MultiplyBlendColor
                    dstImage={
                        <Image
                            source={{ uri: generateImageLink() }}
                            style={style.goodItemCardImage}
                        />
                    }
                    srcColor={WHITE}
                />
                <View style={style.body}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={style.goodItemCardDescription}>
                        {item.name ? item.name : 'Отсутствует имя'}
                    </Text>
                    <View style={style.price}>
                        <Price
                            liquidation={liquidation}
                            price={item.price}
                            item={item}
                        />
                    </View>
                </View>
                <View style={style.goSvg}>
                    <Image
                        source={require('@src/assets/svg/right.png')}
                        style={style.goIcon}
                    />
                </View>
            </View>
        </Pressable>
    );
}

export default React.memo(SelfServiceItemCard);

export { SLIDE_WIDTH, ITEM_HORIZONTAL_MARGIN, ITEM_WIDTH, SLIDER_WIDTH };

const style = StyleSheet.create({
    goodItemCardContent: {
        flexDirection: 'row',
        height: 88,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 4,
        gap: 8,
    },
    goodItemCardImage: {
        backgroundColor: WHITE,
        borderRadius: 6,
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    body: {
        flexDirection: 'column',
        flex: 1,
        height: 72,
    },
    goodItemCardDescription: {
        height: 32,
        fontFamily: 'PTRootUI-Regular',
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.02,
    },
    price: {
        paddingTop: 4,
    },
    goSvg: {
        marginLeft: 4
    },
    goIcon: {
        width: 24,
        height: 24,
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
    nonLiquidationPromoBadge: {
        backgroundColor: '#f4ce67',
        borderRadius: 16,
        padding: 2,
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
