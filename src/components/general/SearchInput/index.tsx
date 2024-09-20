import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {GREY_3} from '@src/assets/style/variable.style';
import SearchSvg from '@src/components/icons/search';
import {setTab} from '@src/store/modules/webview/WebviewReducer';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {NavigationProps} from '@src/types/route';

export default function Searchinput() {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProps<'SearchMainScreen'>['navigation']>();

  //Временно убранный функционал
  //const onScannerPress = async () => {
  //  dispatch(setTab('Search'));
  //  console.log(webview.action);
  //  if (webview.action === '1') {
  //    dispatch(setRoute('/rn-search?scanner=1'));
  //    dispatch(setAction('2'));
  //    navigation.navigate('SearchMainScreen', {
  //      route: '/rn-search?scanner=1',
  //      scanner: '1',
  //    });
  //  } else if (webview.action === '2') {
  //    dispatch(setAction('1'));
  //    dispatch(setRoute('/rn-search?scanner=2'));
  //    navigation.navigate('SearchMainScreen', {
  //      route: '/rn-search?scanner=2',
  //      scanner: '1',
  //    });
  //  } else {
  //    dispatch(setAction('3'));
  //    dispatch(setRoute('/rn-search?scanner=3'));
  //    navigation.navigate('SearchMainScreen', {
  //      route: '/rn-search?scanner=2',
  //      scanner: '3',
  //    });
  //  }
  //};

  return (
    <View style={style.searchContainer}>
      <SearchSvg />
      <TextInput
        onPressIn={() => {
          navigation.navigate('SearchMainScreen');
          dispatch(setTab('Search'));
        }}
        // disabled
        value={''}
        onChangeText={() => null}
        style={style.searchInput}
        underlineColor="transparent"
        placeholder="Название или код товара"
      />
    </View>
  );
}

const style = StyleSheet.create({
  searchContainer: {
    backgroundColor: GREY_3,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    height: 24,
    backgroundColor: GREY_3,
    borderBottomWidth: 0,
  },
});
