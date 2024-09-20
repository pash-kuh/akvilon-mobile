import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@src/store';
import QRCode from 'react-native-qrcode-svg';
import devideString from '@src/helpers/devideString';
import SystemSetting from 'react-native-system-setting';
import {CloseIcon} from '@src/components/icons/close';
import {GREY_3} from '@src/assets/style/variable.style';
/**
 * Всплывающее окно для отображения qr кода
 *
 * @category Drawer
 */

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function QrCodeDrawer({open, setOpen}: Props) {
  const {user} = useSelector((s: RootState) => s);
  const [leave, setLeave] = useState(false);
  const [currentBrightness, setCurrentBrightness] = useState<number>(0);
  const duration = 800;
  const startTime = new Date().getTime();
  const qrString =
    user?.loyalty?.qrCodeInfo?.card + '-' + user?.loyalty?.qrCodeInfo?.code;
  //Функционал для увеличения яркости до максимальной, при открытии qr кода
  const changeBrightness = () => {
    let bright = 0;
    setTimeout(async () => {
      await SystemSetting.getBrightness().then((br) => {
        bright = br;
      });
      const interval = setInterval(async function () {
        const elapsedTime = new Date().getTime() - startTime;
        let currentValue = bright + ((1 - bright) * elapsedTime) / duration;

        if (currentValue > 1) {
          currentValue = +currentValue.toFixed();
        }
        setCurrentBrightness(currentValue);
        await SystemSetting.setAppBrightness(currentValue);
        if (elapsedTime >= duration) {
          clearInterval(interval);
        }
      }, 10);
    }, 100);
  };

  //Функционал для возвращения яркости к исходной
  const returnBrightness = () => {
    const bright = currentBrightness;
    const interval = setInterval(async function () {
      const elapsedTime = new Date().getTime() - startTime;
      let currentValue = 1 + ((0 - 1) * elapsedTime) / duration;
      // SystemSetting.setAppBrightness(currentValue);
      if (currentValue < bright) {
        currentValue = bright;
        clearInterval(interval);
      }
      await SystemSetting.setAppBrightness(currentValue);
      if (elapsedTime >= duration) {
        clearInterval(interval);
      }
    }, 10);
  };

  useEffect(() => {
    setLeave(false);
    if (!leave && open) {
      changeBrightness();
    }
    return () => changeBrightness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (leave) {
      returnBrightness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leave]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <View style={style.modalWrapper}>
      <Modal
        onRequestClose={() => {
          handleClose();
        }}
        visible={open}
        animationType="none"
        transparent>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={style.modalWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'android' ? null : 'position'}>
              <TouchableWithoutFeedback onPress={() => null}>
                <View style={style.qrCodeSection}>
                  <View style={style.container}>
                    <View style={style.wrapper}>
                      <View style={style.iconWrapper}>
                        <CloseIcon
                          color="black"
                          width={20}
                          height={20}
                          style={style.icon}
                          onPress={() => {
                            setOpen(false);
                            setLeave(true);
                          }}
                        />
                      </View>
                      <View style={style.qrTextContainer}>
                        <Text style={style.qrText}>
                          Покажите QR-код кассиру
                        </Text>
                      </View>
                      <QRCode
                        value={
                          qrString !== 'undefined-undefined'
                            ? qrString
                            : user?.loyalty?.number
                        }
                        size={248}
                      />
                      <Text style={style.cardNumber}>
                        Карта №{' '}
                        {user?.loyalty?.number
                          ? devideString(user.loyalty.number)
                          : 'unknown number'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
  },
  qrCodeSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREY_3,
  },
  iconWrapper: {
    width: '100%',
    marginRight: 24,
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  container: {
    width: '100%',
  },
  wrapper: {
    marginBottom: 24,
    alignItems: 'center',
  },
  qrTextContainer: {
    marginBottom: 32,
  },
  qrText: {
    width: 300,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PTRootUI-Bold',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  cardNumber: {
    marginTop: 16,
  },
});
