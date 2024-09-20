import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Capitalizer from '@src/helpers/capitalizer';
import {RootState} from '@src/store';
import {
  setRoute,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import React from 'react';
import {Image, StyleSheet, FlatList, View, Text, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {path} from '@src/components/general/PopularCategory/pathForImages';
import {CategoryItem} from '@src/store/modules/category/CategoryTypes';
import {ParamList} from '@src/types/route';

export default function PopularCategory() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const dispatch = useDispatch();
  const checkOnElement = (index) => {
    if (index === 1 || index === 4 || index === 7) {
      return true;
    }
    return false;
  };

  const navigateToCategory = (item: CategoryItem) => {
    dispatch(setRoute(`redirect|/c/${item.code}/`));
    dispatch(setTitle(item.name));
    dispatch(setTab('Catalog'));
    navigation.navigate('CatalogFilterScreen', {
      isWebPage: true,
      route: `/c/${item.code}/`,
    });
  };

  const getItemLayout = (data, index) => ({
    length: 244,
    offset: 244 * index,
    index,
  });

  const {category} = useSelector((s: RootState) => s);

  return (
    <FlatList
      getItemLayout={getItemLayout}
      listKey="popularCategory"
      scrollEnabled={false}
      data={category.popular.list}
      renderItem={({item, index}) => {
        return (
          <Pressable
            onPress={() => navigateToCategory(item)}
            style={[
              style.popularCategoryItemContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              {marginHorizontal: checkOnElement(index) ? 8 : 0},
            ]}>
            <View style={style.popularCategoryItem}>
              <Image
                style={style.popularCategoryItemImage}
                source={
                  !!path.find((img) => img.name === item.name).img
                    ? path.find((img) => img.name === item.name).img
                    : ''
                }
              />
            </View>
            <Text style={style.popularCategoryItemTitle}>
              {Capitalizer(item.name)}
            </Text>
          </Pressable>
        );
      }}
      numColumns={3}
    />
  );
}

const style = StyleSheet.create({
  popularCategoryContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularCategoryItem: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 8,
    height: 120,
  },
  popularCategoryItemContainer: {
    flex: 2,
    flexDirection: 'column',
    marginBottom: 16,
  },
  popularCategoryItemImage: {
    resizeMode: 'contain',
  },
  popularCategoryItemTitle: {
    fontSize: 13,
    fontFamily: 'PTRootUI-Medium',
    textAlign: 'center',
    lineHeight: 16,
    height: 32,
  },
});
