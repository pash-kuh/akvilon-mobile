import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {BRAND_RED_50, GREY_50} from '@src/assets/style/variable.style';
import AkvilonCardSvg from '../icons/akvilonCard';
import LinearGradient from 'react-native-linear-gradient';
import {MathRoundPrice, spaseOnPrice} from '@src/helpers/priceWithDiscount';
import {LiquidationItem} from '@src/store/modules/liquidation/LiquidationTypes';
type Props = {
  liquidation: boolean;
  price: number;
  item: LiquidationItem;
};

export default function Price({price, item}: Props) {
  const [isLiquidation, setIsLiquidation] = useState(false);

  useEffect(() => {
    if (
      item.badges?.includes('Акция') ||
      item?.badges?.includes('Распродажа')
    ) {
      setIsLiquidation(true);
    } else {
      setIsLiquidation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDiscountValue = () => {
    const hasDiscount = !!(
      item.discount &&
      Object.keys(item.discount).length &&
      item.discount.value
    );

    if (item && Object.keys(item).length && hasDiscount && item.clubPrice) {
      const discountPrice = MathRoundPrice(
        (item.price * (100 - item.discount.value)) / 100,
      );
      return (discountPrice as number) >= item.clubPrice
        ? 0
        : item.discount.value;
    }
  };

  const getDiscountPrice = () => {
    const hasDiscount = !!(
      item.discount &&
      Object.keys(item.discount).length &&
      item.discount.value
    );

    if (item && Object.keys(item).length) {
      // Когда есть это значение, то юзер оптовик и цена может быть только такая
      if (item.wholesalePrice) {
        return item.wholesalePrice;
      }

      if (hasDiscount) {
        // Клубная цена может быть только если юзер авторизован и у клубная цена лучше (чем меньше, тем лучше) цены со скидкой
        if (item.clubPrice) {
          const discountPrice =
            (item.price * (100 - item.discount.value)) / 100;
          const price =
            discountPrice >= item.clubPrice ? item.clubPrice : discountPrice;
          return spaseOnPrice(MathRoundPrice(price));
        }

        // Если юзер не авторизован, у него не может быть клубной цены
        const price = (item.price * (100 - item.discount.value)) / 100;
        return spaseOnPrice(MathRoundPrice(price));
      }

      // На данном этапе все сценарии скидки мы прошли, и если возможна клубная цена, то показываем её
      if (item.clubPrice) {
        return spaseOnPrice(item.clubPrice);
      }
    }

    return spaseOnPrice(item.price);
  };

  return (
    <View style={style.priceContainer}>
      <View style={style.specialPriceContainer}>
        <Text
          style={
            isLiquidation ? style.specialPriceLiquidation : style.specialPrice
          }>
          {isLiquidation ? spaseOnPrice(price) : spaseOnPrice(item.clubPrice)}{' '}
          ₸/шт
        </Text>
        {isLiquidation ? null : <AkvilonCardSvg />}
      </View>
      <View style={style.commonPriceContainer}>
        <Text
          style={
            isLiquidation ? style.commonPriceLiquidation : style.commonPrice
          }>
          {isLiquidation
            ? getDiscountPrice()
              ? getDiscountPrice()
              : spaseOnPrice(price)
            : spaseOnPrice(price)}{' '}
          ₸/шт
        </Text>
        {isLiquidation ? (
          <LinearGradient
            colors={['#FF8329', '#FC035A']}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0.5}}
            useAngle={true}
            angle={135}
            style={style.liqudationBadge}>
            <Text style={style.liquidationBadgeTitle}>
              -{getDiscountValue()}%
            </Text>
          </LinearGradient>
        ) : null}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  priceContainer: {
    marginBottom: 16,
  },
  specialPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  specialPrice: {
    fontSize: 15,
    fontFamily: 'PTRootUI-Bold',
  },
  commonPrice: {
    fontSize: 13,
    fontFamily: 'PTRootUI-Light',
    color: GREY_50,
  },
  specialPriceLiquidation: {
    fontSize: 13,
    fontFamily: 'PTRootUI-Light',
    color: GREY_50,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  liqudationBadge: {
    borderRadius: 4,
  },
  liquidationBadgeTitle: {
    alignItems: 'center',
    color: '#fff',
    fontSize: 13,
    padding: 1,
    paddingHorizontal: 3,
    fontFamily: 'PTRootUI-Medium',
  },
  commonPriceLiquidation: {
    color: BRAND_RED_50,
    fontFamily: 'PTRootUI-Bold',
    fontSize: 15,
    marginRight: 4,
  },
});
