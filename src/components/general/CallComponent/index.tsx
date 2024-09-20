import React, {Dispatch, SetStateAction} from 'react';
import {View, Image, StyleSheet, Text, Pressable} from 'react-native';
import {Badge} from 'react-native-paper';

type Props = {
  setOpenCall: Dispatch<SetStateAction<boolean>>;
};

export default function CallComponent({setOpenCall}: Props) {
  return (
    <Pressable style={style.container} onPress={() => setOpenCall(true)}>
      <View style={style.phoneContainer}>
        <Image
          source={require('../../../assets/svg/makeCall.png')}
          style={style.icon}
        />
        <Text style={style.text}>Заказать по телефону</Text>
        <Badge style={style.badge}>New</Badge>
      </View>
      <Image
        source={require('../../../assets/svg/right.png')}
        style={style.icon}
      />
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    marginHorizontal: 5,
    fontSize: 17,
    fontFamily: 'PTRootUI-Regular',
  },
  badge: {
    backgroundColor: '#FDA44A',
    borderRadius: 7,
    fontSize: 13,
    fontFamily: 'PTRootUI-Medium',
  },
});
