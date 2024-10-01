import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration
} from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  useCameraDevices,
  Camera,
  useFrameProcessor,
  useCodeScanner,
  CodeType,
} from "react-native-vision-camera";
import { widthToDp, heightToDp } from 'rn-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { typography } from '@src/assets/style/typography.style';
import { api } from '@src/helpers/request';
import { RNHoleView } from 'react-native-hole-view';
import { setSelfServices } from '@src/store/modules/selfServiceData/SelfServiceReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { SelfServiceDrawer } from '@src/components/drawers/selfServiceDrawer';
import { BARCODE_TYPES } from '@src/helpers/constants';

/**
 * Сканер штрихкодов
 *
 * @category CameraScreen Screen
 */
const BarcodeScanner = ({ goHome, goNotFound, openProduct, city }) => {
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const device = devices.find(({ position }) => position === "back");
  const defaultSearchStatus = 'Расположите штрих-код внутри выделенной области';
  const { config } = useSelector((s: RootState) => s);
  const dispatch = useDispatch();

  const [openSelfService, setOpenSelfService] = useState<boolean>(false);
  const [barcode, setBarcode] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [searchStatus, setSearchStatus] = useState(defaultSearchStatus);
  const [isTorch, setIsTorch] = useState(false);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const [isShowLoading, setIsShowLoading] = useState(false); // крутилка
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const resetScanning = () => {
    setSearchStatus(defaultSearchStatus);
    setIsShowLoading(false);
    setBarcode('');
    setIsCameraActive(true);
    setIsNotFound(false);
    setIsScanned(false);
    setRotateAnimation(new Animated.Value(0));
  };

  const handleAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  useEffect(() => {
    if (isShowLoading) {
      handleAnimation();
    }
  }, [isShowLoading]);

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };
  useEffect(() => {
    checkCameraPermission();
    return () => {
      setHasPermission(false);
    };
  }, []);

  const checkCameraPermission = async () => {
    const statusPermission = await Camera.getCameraPermissionStatus();
    setHasPermission(statusPermission === 'granted');
    return () => {
      setHasPermission(false);
    };
  };

  useEffect(() => {
    toggleActiveState();
  }, [barcode]);

  useEffect(() => {
    if (isNotFound) {
      resetScanning();
      goNotFound();
    }
  }, [isNotFound]);

  const codeScanner = useCodeScanner({
    codeTypes: BARCODE_TYPES as CodeType[],
    onCodeScanned: codes => {
      if (codes.length) {
        setBarcode(codes[0].value);
      }
    }
  }
  );

  async function checkBarcode(curBarcode) {
    try {
      const {
        data: { data },
      } = await api(config.apiUrl)(
        `search/?cityId=${city}&q=${curBarcode}&mode=barcode&page=1&size=1&mode=barcode`,
      );
      if (data.count === 1) {
        const product = data.products.items[0];

        // если для iOS вдруг работать не будет (что вряд ли), то можно задать так: Vibration.vibrate([400], false);
        Vibration.vibrate();
        if (product.isSelfService) {
          // логика сохранения продукта для модалки по которому мы сможем перейти к товару.
          dispatch(setSelfServices(product));
          setOpenSelfService(true);
          setIsShowLoading(false);
        } else {
          openProduct(navigation, product.code);
        }
        resetScanning();
      } else {
        setIsNotFound(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const toggleActiveState = async () => {
    if (barcode && isScanned === false) {
      setIsShowLoading(true);
      setSearchStatus('Распознаем код...');

      if (barcode && !openSelfService) {
        setIsScanned(true);
        setIsCameraActive(false);
        await checkBarcode(barcode);
      }
    }
  };

  /** Возвращает назад, если предыдущий экран был из стека Main (Главная / Поиск),
   * если это был экран CameraScreen Not Found, то на Главную */
  const handleClose = () => {
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if (prevRoute.name === 'Main') {
      navigation.goBack();
    } else {
      goHome();
    }
  };

  const handleTorch = () => {
    setIsTorch((torch) => !torch);
  };

  return (
    device != null &&
    hasPermission && (
      <SafeAreaView style={styles.containerMain}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isCameraActive}
          codeScanner={codeScanner}
          audio={false}
          torch={isTorch ? 'on' : 'off'}
        />
        <RNHoleView
          holes={[
            {
              x: widthToDp('8.5%'),
              y: heightToDp('46%'),
              width: widthToDp('83%'),
              height: heightToDp('38%'),
              borderRadius: 10,
            },
          ]}
          style={styles.rnholeView}
        />
        <View style={styles.cornersContainer}>
          <View style={[styles.cornerLength, styles.cornerLeftTop]} />
          <View style={[styles.cornerLength, styles.cornerRightTop]} />
          <View style={[styles.cornerLength, styles.cornerRightBottom]} />
          <View style={[styles.cornerLength, styles.cornerLeftBottom]} />
          <View style={[isShowLoading ? null : styles._hidden]}>
            <Animated.Image
              style={[animatedStyle, styles.loader]}
              source={require('@src/assets/svg/loader.png')}
            />
          </View>
        </View>
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.topIcon}
            onPress={() => handleClose()}>
            <Image source={require('@src/assets/svg/close_white.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topIcon}
            onPress={() => handleTorch()}>
            {isTorch ? (
              <TouchableOpacity onPress={() => handleTorch()}>
                <Image source={require('@src/assets/svg/flash_on.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleTorch()}>
                <Image source={require('@src/assets/svg/flash_off.png')} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.bottomView}>
          <Text style={styles.textStyle}>{searchStatus}</Text>
        </View>

        {openSelfService && (
          <View style={styles.modal}>
            <SelfServiceDrawer
              close={() => setOpenSelfService(false)}
              onPressTakeIt={handleClose}
            />
          </View>
        )}
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  /** RN Hole */
  rnholeView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cornersContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cornerLength: {
    width: 20,
    height: 20,
    borderWidth: 4,
    borderRadius: 3,
    borderStyle: 'solid',
  },
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  cornerLeftTop: {
    borderLeftColor: 'white',
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    left: widthToDp('8.4%'),
    top: heightToDp('45.8%'),
  },
  cornerRightTop: {
    borderLeftColor: 'white',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    left: widthToDp('8.4%'),
    top: heightToDp('73.9%'),
  },
  cornerLeftBottom: {
    borderLeftColor: 'transparent',
    borderTopColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: 'transparent',
    left: widthToDp('86.4%'),
    top: heightToDp('30.4%'),
  },
  cornerRightBottom: {
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'white',
    borderBottomColor: 'white',
    left: widthToDp('86.4%'),
    top: heightToDp('68.9%'),
  },

  /** Лоадер */
  _hidden: {
    display: 'none',
  },
  loader: {
    left: widthToDp('46.4%'),
    top: heightToDp('41.9%'),
  },

  /** Контейнер */
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Верхние иконки */
  topView: {
    display: 'flex',
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    padding: 11,
    flexDirection: 'row',
  },
  topIcon: {
    padding: 10,
  },

  /** Текст внизу */
  bottomView: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  textStyle: {
    ...typography('md', 'regular'),
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BarcodeScanner;
