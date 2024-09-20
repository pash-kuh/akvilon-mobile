import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GoodItemCard, {ITEM_WIDTH, SLIDER_WIDTH} from '../GoodItemCard';
import Carousel from 'react-native-snap-carousel';
import {PRIMARY_50} from '@src/assets/style/variable.style';

type Props = {
  title: string;
  liquidation: boolean;
  array: Array<object>;
};

export default function JustForYouSlider({title, liquidation, array}: Props) {
  // console.log('array', array)
  const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const isCarousel = React.useRef(null);
  return (
    <View style={style.sliderContainer}>
      <View style={style.sliderTitleContainer}>
        <Text
          style={[style.sliderTitle, {color: liquidation ? '#FF8329' : ''}]}>
          {title}
        </Text>
        <Text style={style.sliderSpan}>см.все</Text>
      </View>
      <Carousel
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH + 8}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        layout="default"
        vertical={false}
        layoutCardOffset={10}
        ref={isCarousel}
        data={array}
        renderItem={({item}) => (
          <GoodItemCard
            item={item}
            liquidation={liquidation}
            img={require('@src/assets/image/test.png')}
          />
        )}
        inactiveSlideShift={0}
        useScrollView={true}
      />
    </View>
  );
}

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
});
