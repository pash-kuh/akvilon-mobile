import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {BRAND_RED_50} from '@src/assets/style/variable.style';
import DrawerComponent from '@src/components/general/drawer/DrawerComponent';

type Props = {
  close: () => void;
  makeCall: (source: string) => void;
};

function MakeCallDrawer({close, makeCall}: Props) {
  return (
    <DrawerComponent
      title=""
      close={close}
      borderRadius={{topLeft: 12, topRight: 12}}
      margin={0}
      content={
        <View style={style.modalContent}>
          <Text style={style.header}>Сделайте заказ по телефону</Text>
          <Text style={style.text}>
            Оформите доставку или самовывоз из магазина.
          </Text>
          <Button onPress={() => makeCall('main_phone')} style={style.button}>
            <Text style={style.buttonText}>Связаться с менеджером</Text>
          </Button>
        </View>
      }
    />
  );
}

export default MakeCallDrawer;

const style = StyleSheet.create({
  modalContent: {
    padding: 16,
  },
  header: {
    fontFamily: 'PTRootUI-Bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chipItem: {
    marginHorizontal: 2,
    marginVertical: 4,
  },
  button: {
    backgroundColor: BRAND_RED_50,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'none',
    fontSize: 17,
    fontFamily: 'PTRootUI-Medium',
  },
});
