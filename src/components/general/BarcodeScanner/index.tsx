import React, {useState, useEffect} from 'react';
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
  Vibration,
  PermissionsAndroid,
} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  useCameraDevices,
  Camera,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from "vision-camera-code-scanner";
import {widthToDp, heightToDp} from 'rn-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {api} from '@src/helpers/request';
import {setAction} from '@src/store/modules/webview/WebviewReducer';
import {RootState} from '@src/store';
import {setSelfServices} from '@src/store/modules/selfServiceData/SelfServiceReducer';
import {RNHoleView} from 'react-native-hole-view';
import {SelfServiceDrawer} from '@src/components/drawers/selfServiceDrawer';

// this is my comp
/**
 * Сканер штрихкодов
 */

const BarcodeScanner = ({goHome, goNotFound, openProduct, city}) => {
  const {config, webview} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const device = devices.back;
  const defaultSearchStatus = 'Расположите штрих-код внутри выделенной области';

  const [openSelfService, setOpenSelfService] = useState<boolean>(false);
  const [barcodes, setBarcodes] = useState<any[]>([]);
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
    return () => {
      isShowLoading;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /** функция-оболочка, чтобы записать из worklet в state */
  const workletBarcodes = (detectedBarcode: Barcode[]) => {
    setBarcodes(detectedBarcode);
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const detectedBarcodes = scanBarcodes(
      frame,
      [BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.EAN_13],
      {
        checkInverted: true,
      },
    );
    runOnJS(workletBarcodes)(detectedBarcodes);
  }, []);

  const checkCameraPermission = async () => {
    const statusPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    setHasPermission(statusPermission);
    return () => {
      setHasPermission(false);
    };
  };

  useEffect(() => {
    toggleActiveState();
    return () => {
      [barcodes];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  useEffect(() => {
    if (isNotFound) {
      resetScanning();
      goNotFound();
    }
    return () => {
      isNotFound;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotFound]);

  async function checkBarcode(curBarcode) {
    try {
      const {
        data: {data},
      } = await api(config.apiUrl)(
        `search/?cityId=${city}&q=${curBarcode}&mode=barcode&page=1&size=1&mode=barcode`,
      );

      if (data.count === 1) {
        const product = data.products.items[0];

        // если для iOS вдруг работать не будет (что вряд ли), то можно задать так: Vibration.vibrate([400], false);
        Vibration.vibrate();
        if (product.isSelfService) {
          console.log(product)
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
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsShowLoading(true);
      setSearchStatus('Распознаем код...');
      if ('rawValue' in barcodes[0]) {
        setBarcode(barcodes[0].rawValue);
      }
      if (barcode && !openSelfService) {
        setIsScanned(true);
        setBarcodes([]);
        setIsCameraActive(false);
        await checkBarcode(barcode);
      }
    }
  };

  const onCloseSelfServiceDriver = () => {
    setOpenSelfService(false);
    setIsShowLoading(false);
  };
  const torchOff = () => {
    setIsTorch(false);
  };
  /** Возвращает назад, если предыдущий экран был из стека Main (Главная / Поиск),
   * если это был экран Camera Not Found, то на Главную */
  const handleClose = async () => {
    torchOff();
    if (webview.action === '1') {
      dispatch(setAction('2'));
      console.log('setted 2');
    } else if (webview.action === '2') {
      dispatch(setAction('1'));
      console.log('seeted 1');
    } else if (webview.action === '3') {
      dispatch(setAction('1'));
      console.log('seeted 1');
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
      <SafeAreaView style={styles.containerMain}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isCameraActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
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
