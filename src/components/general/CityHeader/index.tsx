import {useNavigation} from '@react-navigation/native';
import {RootState} from '@src/store';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CitySvg from '@src/components/icons/city';
import {setAction} from '@src/store/modules/webview/WebviewReducer';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList} from '@src/types/route';

type Props = {
  makeCall: (source: string) => void;
};

export default function CityHeader({makeCall}: Props) {
  const {active, list} = useSelector((s: RootState) => s.city);
  const {contacts} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['City']>>();
  const chooseCityHandler = () => {
    dispatch(setAction('return'));
    navigation.navigate('City');
  };
  return (
    <View style={style.cityContainer}>
      <TouchableOpacity onPress={chooseCityHandler} style={style.header}>
        <CitySvg />
        <Text style={style.cityTitle}>
          {list ? list?.find((item) => item?.code === active)?.name : ''}
        </Text>
        <View>
          <Image source={require('@src/assets/svg/bottom.png')} />
        </View>
      </TouchableOpacity>
      <Pressable onPress={() => makeCall('top_phone')}>
        <Text style={style.phoneNumber}>{contacts.currentContact}</Text>
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  cityContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cityTitle: {
    fontSize: 13,
    fontFamily: 'PTRootUI-Medium',
  },
  phoneNumber: {
    fontSize: 13,
    fontFamily: 'PTRootUI-Medium',
  },
});
