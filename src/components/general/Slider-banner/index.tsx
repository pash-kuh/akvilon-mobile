import React from 'react';
import {StyleSheet, View, Image, Pressable, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setAction, setRoute} from '@src/store/modules/webview/WebviewReducer';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@src/store';
import {NavigationProps} from '@src/types/route';

function SliderBanner({banner}: any) {
  const {config} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProps<'SettingCalculator'>['navigation']>();

  const openLink = (link) => {
    if (link.includes('calculator')) {
      const replacedUrl = link.replace('https://akvilon.kz', '');
      dispatch(setRoute(`redirect|${replacedUrl}`));
      dispatch(setAction('return'));
      navigation.navigate('SettingCalculator');
    } else {
      Linking.openURL(link);
    }
  };

  const imageLink = 'https://' + config.url + banner.image.mobile['2x'];
  return (
    <View style={style.wrapper}>
      <Pressable
        style={style.akvilonychSlideContainer}
        key={banner.url}
        onPress={() => openLink(banner.url)}>
        <View style={style.imageContainer}>
          <Image source={{uri: imageLink}} style={style.image} />
        </View>
      </Pressable>
      {/* <Carousel
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH - 64}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={0}
        layout="default"
        vertical={false}
        layoutCardOffset={1}
        ref={isCarousel}
        data={banners}
        onSnapToItem={(index) => setIndex(index)}
        renderItem={({ item, index }) => {
          const imageLink = 'https://' + config.url + item.image.mobile['2x'];
          return (
            
          );
        }}
        inactiveSlideShift={0}
        useScrollView={true}
      />
      <Pagination
        dotsLength={banners.length}
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
      /> */}
    </View>
  );
}

export default React.memo(SliderBanner);

const style = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  akvilonychSlideContainer: {
    flex: 1,
  },
  imageContainer: {
    // width: '100%',
  },
  image: {
    // width: '100%',
    height: 120,
    resizeMode: 'stretch',
    borderRadius: 8,
  },
});
