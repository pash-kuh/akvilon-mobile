import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import GoodItemCard from '../GoodItemCard';
import {PRIMARY_50} from '@src/assets/style/variable.style';
import {LiquidationList} from '@src/store/modules/liquidation/LiquidationTypes';

export type RootStackParamList = {
  CatalogMainScreen: {isWebPage: boolean; route: string} | undefined;
};

type Props = {
  title: string;
  liquidation: boolean;
  array: LiquidationList | Array<object>;
};

//Компонент для слайдера товаров на главной
function Slider({title, liquidation, array}: Props) {
  //const dispatch = useDispatch();
  //const navigation =
  //  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //Временно задизейблена кнопка см.всё
  //const checkAll = () => {
  //  dispatch(setRoute(liquidation ? 'redirect|/c/liquidation/' : '/catalog/'));
  //  dispatch(setTab('Catalog'));
  //  dispatch(setTitle('Распродажа'));
  //  navigation.navigate('CatalogMainScreen', {
  //    isWebPage: true,
  //    route: liquidation ? '/c/liquidation/' : '/catalog/',
  //  });
  //};

  return (
    <View style={style.sliderContainer}>
      <View style={style.sliderTitleContainer}>
        <Text
          style={[style.sliderTitle, {color: liquidation ? '#FF8329' : ''}]}>
          {title}
        </Text>
        {/* <Text onPress={checkAll} style={style.sliderSpan}>
          см.все
        </Text> */}
      </View>
      <FlatList
        horizontal
        data={array}
        renderItem={({item}: any) => {
          return (
            <View style={style.goodItemCardWrapper}>
              <GoodItemCard
                item={item}
                // Проверка на то, является ли item с распродажей
                liquidation={item.badges[0] === 'Распродажа'}
              />
            </View>
          );
        }}
      />
    </View>
  );
}

export default React.memo(Slider);

const style = StyleSheet.create({
  sliderContainer: {
    flex: 1,
  },
  sliderContent: {
    flexDirection: 'row',
  },
  sliderTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderTitle: {
    fontSize: 20,
    fontFamily: 'PTRootUI-Bold',
    marginBottom: 16,
  },
  sliderSpan: {
    color: PRIMARY_50,
    fontFamily: 'PTRootUI-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  goodItemCardWrapper: {
    paddingRight: 10,
  },
});
