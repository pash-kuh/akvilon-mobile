import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import {
  useCameraDevices,
  Camera,
  useCodeScanner,
  CodeType
} from 'react-native-vision-camera';
import { widthToDp, heightToDp } from 'rn-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@src/helpers/request';
import { setAction } from '@src/store/modules/webview/WebviewReducer';
import { RootState } from '@src/store';
import { setSelfServices } from '@src/store/modules/selfServiceData/SelfServiceReducer';
import { RNHoleView } from 'react-native-hole-view';
import { SelfServiceDrawer } from '@src/components/drawers/selfServiceDrawer';
import { BARCODE_TYPES } from '@src/helpers/constants';
import { GREY_90 } from '@src/assets/style/variable.style';

/**
 * Сканер штрихкодов
 */

const BarcodeScanner = ({ goHome, goNotFound, openProduct, city }) => {
  const { config, webview } = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const device = devices.find(({ position }) => position === "back");
  const defaultSearchStatus = 'Расположите штрих-код внутри выделенной области';

  const [openSelfService, setOpenSelfService] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [searchStatus, setSearchStatus] = useState<string>(defaultSearchStatus);
  const [isTorch, setIsTorch] = useState<boolean>(false);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const [isShowLoading, setIsShowLoading] = useState<boolean>(false); // крутилка
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

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

  const codeScanner = useCodeScanner({
    codeTypes: BARCODE_TYPES as CodeType[],
    onCodeScanned: codes => {
      if (codes.length) {
        setBarcode(codes[0].value);
      }
    }
  }
  );

  const checkCameraPermission = async () => {
    const statusPermission = await Camera.getCameraPermissionStatus();
    setHasPermission(statusPermission === 'granted');
    return () => {
      setHasPermission(false);
    };
  };

  useEffect(() => { toggleActiveState() }, [barcode]);

  useEffect(() => {
    if (isNotFound) {
      resetScanning();
      goNotFound();
    }
  }, [isNotFound]);

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

  const onCloseSelfServiceDriver = () => {
    setOpenSelfService(false);
    setIsShowLoading(false);
  };
  const torchOff = () => { setIsTorch(false) };

  /** Возвращает назад, если предыдущий экран был из стека Main (Главная / Поиск),
   * если это был экран Camera Not Found, то на Главную */
  const handleClose = async () => {
    torchOff();
    if (webview.action === '1') {
      dispatch(setAction('2'));
    } else if (webview.action === '2') {
      dispatch(setAction('1'));
    } else if (webview.action === '3') {
      dispatch(setAction('1'));
    }
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
      <View style={styles.safeAreaContainer}>
        <StatusBar hidden={true} />
        <View style={[styles.containerMain]}>
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
                close={onCloseSelfServiceDriver}
                onPressTakeIt={handleClose}
              />
            </View>
          )}
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    position: 'absolute',
    paddingTop: 50,
    paddingBottom: 80,
    top: -50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GREY_90,
    height: "120%",
  },
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
    top: heightToDp('73.8%'),
  },
  cornerLeftBottom: {
    borderLeftColor: 'transparent',
    borderTopColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: 'transparent',
    left: widthToDp('86.4%'),
    top: heightToDp('31.2%'),
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
    top: heightToDp('62%'),
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
    fontSize: 14,
    fontFamily: 'PTRootUI-Regular',
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BarcodeScanner;
