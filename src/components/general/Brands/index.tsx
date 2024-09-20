import React from 'react';
import {Brand} from '@src/store/modules/brands/BrandsTypes';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
// import Carousel from 'react-native-snap-carousel';
// import {ITEM_WIDTH, SLIDER_WIDTH} from '../GoodItemCard';
import {GREY_3} from '@src/assets/style/variable.style';
import {MultiplyBlendColor} from 'react-native-image-filter-kit';

type Props = {
  brands: Brand[][];
  url: string;
  title: string;
  onBannerPress: (item: any) => void;
};

function Brands({brands, url, title, onBannerPress}: Props) {
  return (
    <View>
      <Text style={style.title}>{title}</Text>
      {brands.length !== 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}>
          {brands.map((itemsArr, index) => {
            return (
              <View style={style.brandContainer} key={index}>
                {itemsArr.length &&
                  itemsArr.map((item) => {
                    const imageLink = 'https://' + url + item.imgColor;
                    return (
                      <Pressable
                        onPress={() => {
                          onBannerPress(item);
                        }}
                        key={item.id}
                        style={style.brandItem}>
                        <MultiplyBlendColor
                          dstImage={
                            <Image
                              style={style.brandImage}
                              source={{uri: imageLink}}
                              resizeMode={'contain'}
                            />
                          }
                          srcColor={GREY_3}
                        />
                      </Pressable>
                    );
                  })}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default React.memo(Brands);

const style = StyleSheet.create({
  brandContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PTRootUI-Bold',
    marginBottom: 16,
  },
  brandItem: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: GREY_3,
    borderRadius: 6,
  },
  brandImage: {
    width: 128,
    height: 56,
  },
});
