import React, {useState} from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {Carousel, Pagination} from 'react-native-snap-carousel';
import {GREY_20} from '@src/assets/style/variable.style';
import {RootState} from '@src/store';

const {width: viewportWidth} = Dimensions.get('window');
const SLIDE_WIDTH = Math.round(viewportWidth / 1);
const ITEM_HORIZONTAL_MARGIN = 16;
const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
const SLIDER_WIDTH = viewportWidth;

//Компонент со слайдером изображений на главной
export default function SliderImage() {
  const [index, setIndex] = useState(0);
  const {slider, config} = useSelector((s: RootState) => s);
  //Смотрит только на те слайды, в которых есть альтернативное изображение
  const sliderLength: Array<any> = slider.filter((item) => {
    if (item.image['mobile-alt']['2x']) {
      return item;
    }
  });
  console.log(sliderLength);
  const isCarousel = React.useRef(null);
  return (
    <View>
      <Carousel
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH - 64}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={0}
        layout="default"
        vertical={false}
        layoutCardOffset={1}
        ref={isCarousel}
        data={sliderLength}
        onSnapToItem={(index) => setIndex(index)}
        renderItem={({item, index}) => {
          const imageLink =
            'https://' + config.url + item.image['mobile-alt']['2x'];
          if (item.image['mobile-alt']) {
            return (
              <View style={style.akvilonychSlideContainer} key={index}>
                <View style={style.imageContainer}>
                  <Image source={{uri: imageLink}} style={style.image} />
                </View>
              </View>
            );
          }
        }}
        inactiveSlideShift={0}
        useScrollView={true}
      />
      <Pagination
        dotsLength={sliderLength.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 24,
          height: 4,
          backgroundColor: 'black',
        }}
        tappableDots={true}
        inactiveDotStyle={{
          backgroundColor: GREY_20,
          width: 4,
          height: 4,
          // Define styles for inactive dots here
        }}
        animatedDuration={200}
        inactiveDotOpacity={0.5}
        inactiveDotScale={1}
      />
    </View>
  );
}

const style = StyleSheet.create({
  akvilonychSlideContainer: {
    flex: 1,
  },
  imageContainer: {
    // width: '100%',
  },
  image: {
    // width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});
