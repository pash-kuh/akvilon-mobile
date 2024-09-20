import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Badge} from 'react-native-paper';
import {typography} from '@src/assets/style/typography.style';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@src/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {setTitle} from '@src/store/modules/webview/WebviewReducer';
import QRCode from 'react-native-qrcode-svg';
import devideString from '@src/helpers/devideString';
import priceFormatter from '@src/helpers/priceFormatter';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList} from '@src/types/route';
/**
 * Regular description
 *
 * @category Screen
 */
export default function BonusScreen() {
  const {
    user: {loyalty},
  } = useSelector((state: RootState) => state);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const dispatch: AppDispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(0));
  const qrString = loyalty?.qrCodeInfo?.card + '-' + loyalty?.qrCodeInfo?.code;
  const fadeInFadeOut = () => {
    const fadeInAndOut = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(fadeInAndOut).start();
  };
  const handlePress = () => {
    navigation.navigate('SettingPersonalClubcard');
  };

  useEffect(() => {
    fadeInFadeOut();
    dispatch(setTitle('Моя карта АКВИЛОН.BONUS'));
    return () => fadeInFadeOut();
  });
  return (
    <View style={style.container}>
      <ScrollView>
        <View style={style.infoContainer}>
          <View>
            <Text style={style.titleFont}>Ваши баллы</Text>
            <Animated.View style={{opacity: fadeAnim}}>
              <Badge size={10} style={style.badge} />
            </Animated.View>
          </View>
          <Text style={style.bonusFont}>
            {priceFormatter(loyalty.points.available)}
          </Text>
          <Text style={style.infoFont}>
            {loyalty.toNextStatus} ₸ до статуса карты “{loyalty.nextStatusName}”
          </Text>
          <Image
            source={require('@src/assets/image/akvilonbonus.png')}
            style={style.image}
          />
        </View>
        <TouchableOpacity
          onPress={() => handlePress()}
          style={style.buttonContainer}>
          <Text style={style.button}>Детализация активации баллов</Text>
          <Image
            source={require('@src/assets/svg/right.png')}
            style={style.icon}
          />
        </TouchableOpacity>
        <View style={style.qrCodeContainer}>
          <View style={style.qrTextContainer}>
            <Text style={style.qrText}>
              Покажите этот QR-код кассиру для списания баллов
            </Text>
          </View>
          <QRCode
            value={
              qrString !== 'undefined-undefined' ? qrString : loyalty?.number
            }
            size={248}
          />
          <Text style={style.qrCodeNumber}>
            Карта № {devideString(loyalty.number)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingBottom: 40,
    elevation: 2,
    shadowColor: 'black',
  },
  qrTextContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  qrText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
    paddingHorizontal: 0,
    lineHeight: 20,
  },
  qrCodeNumber: {
    marginTop: 16,
  },
  container: {
    backgroundColor: '#F2F5F8',
    flex: 1,
    justifyContent: 'space-between',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  button: {
    textAlign: 'left',
    letterSpacing: 1,
    borderWidth: 0,
    fontSize: 17,
    lineHeight: 20,
  },

  icon: {
    width: 25,
    height: 25,
  },

  badge: {
    position: 'absolute',
    left: 74,
    top: -13,
    opacity: 1,
  },

  badgeAnimate: {
    opacity: 0,
  },

  image: {
    position: 'absolute',
    right: 16,
    top: 24,
    width: 76,
    height: 48,
  },
  titleFont: {
    fontSize: 12,
    marginTop: 24,
    color: '#A0AFBD',
  },

  bonusFont: {
    fontSize: 35,
    fontFamily: 'PTRootUI-Bold',
    color: '#10131E',
    marginTop: 4,
    marginBottom: 8,
  },

  infoFont: {
    fontSize: 14,
    color: '#0C6DEB',
  },

  infoContainer: {
    backgroundColor: '#F2F5F8',
    paddingLeft: 16,
    paddingRight: 16,
    height: 124,
    marginBottom: 16,
  },

  barcodeContainer: {},

  barcode: {
    backgroundColor: '#FFF',
    paddingTop: 24,
    marginLeft: 16,
    marginRight: 16,
    top: -(156 / 2),
    borderRadius: 8,
    elevation: 8,
  },

  barcodeFont: {
    ...typography('md', 'bold'),
    marginTop: 12,
    marginBottom: 12,
  },
});
