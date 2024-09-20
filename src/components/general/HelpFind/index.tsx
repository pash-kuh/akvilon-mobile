import Capitalizer from '@src/helpers/capitalizer';
import {
  setAction,
  setRoute,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Chip} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {ParamList} from '@src/types/route';
import {RootState} from '@src/store';

export default function HelpFind() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const {tags} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigateToCategory = (item) => {
    dispatch(setRoute(`redirect|/c/${item.param}/`));
    dispatch(setTitle(item.name));
    dispatch(setAction('return'));
    navigation.navigate('CatalogFilterScreen', {
      isWebPage: true,
      route: `/c/${item.param}/`,
    });
  };
  return (
    <View style={style.chipContainer}>
      <Text style={style.title}>Популярно в каталоге</Text>
      {tags.length !== 0 &&
        tags.map((tag) => {
          return (
            <Pressable key={tag.id} onPress={() => navigateToCategory(tag)}>
              <Chip key={tag.id} style={style.chipItem}>
                {Capitalizer(tag.name)}
              </Chip>
            </Pressable>
          );
        })}
    </View>
  );
}

const style = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chipItem: {
    margin: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PTRootUI-Bold',
    marginBottom: 16,
  },
});
