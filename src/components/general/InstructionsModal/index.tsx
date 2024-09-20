import {GREY_3, GREY_50, PRIMARY_50} from '@src/assets/style/variable.style';
import {CloseIcon} from '@src/components/icons/close';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Badge, Button} from 'react-native-paper';
import SystemSetting from 'react-native-system-setting';

export default function InstructionsModal({setInstructions, instructions}) {
  const [leave, setLeave] = useState(false);
  const [currentBrightness, setCurrentBrightness] = useState<number | null>(
    null,
  );
  const duration = 800;
  const startTime = new Date().getTime();

  //Функционал для повышения яркости при открытии модалки
  const changeBrightness = () => {
    let bright = 0;
    setTimeout(async () => {
      await SystemSetting.getBrightness().then((br) => {
        bright = br;
      });
      const interval = setInterval(function () {
        const elapsedTime = new Date().getTime() - startTime;
        let currentValue = bright + ((1 - bright) * elapsedTime) / duration;

        if (currentValue > 1) {
          currentValue = +currentValue.toFixed();
        }
        setCurrentBrightness(currentValue);
        SystemSetting.setAppBrightness(currentValue);
        if (elapsedTime >= duration) {
          clearInterval(interval);
        }
      }, 10);
    }, 100);
  };

  //Функционал для возвращения яркости к исходной
  const returnBrightness = () => {
    const bright = currentBrightness;
    const interval = setInterval(function () {
      const elapsedTime = new Date().getTime() - startTime;
      let currentValue = 1 + ((0 - 1) * elapsedTime) / duration;
      // SystemSetting.setAppBrightness(currentValue);
      if (currentValue < bright) {
        currentValue = bright;
        clearInterval(interval);
      }
      SystemSetting.setAppBrightness(currentValue);
      if (elapsedTime >= duration) {
        clearInterval(interval);
      }
    }, 10);
  };

  useEffect(() => {
    setLeave(false);
    if (!leave && instructions) {
      changeBrightness();
    }
    return () => changeBrightness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructions]);
  //   console.log(leave);
  useEffect(() => {
    if (leave) {
      returnBrightness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructions]);
  return (
    <View style={style.modalWrapper}>
      <Modal
        transparent
        animationType="none"
        visible={instructions}
        onRequestClose={() => {
          setInstructions(false);
          setLeave(true);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setInstructions(false);
            setLeave(true);
          }}>
          <View style={style.modalWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'android' ? null : 'position'}>
              <TouchableWithoutFeedback onPress={() => null}>
                <View style={style.modal}>
                  <View style={style.container}>
                    <View style={style.wrapper}>
                      <View style={style.iconWrapper}>
                        <CloseIcon
                          color="black"
                          width={20}
                          height={20}
                          style={style.icon}
                          onPress={() => {
                            setInstructions(false);
                            setLeave(true);
                          }}
                        />
                      </View>
                      <View style={style.title}>
                        <Text style={style.titleText}>
                          Как получить карту АКВИЛОН.BONUS
                        </Text>
                      </View>
                      <View style={style.textRow}>
                        <View>
                          <Badge size={24} style={style.badge}>
                            1
                          </Badge>
                        </View>
                        <View style={style.textColumn}>
                          <Text style={style.textMain}>
                            Совершите покупки на{' '}
                            <Text numberOfLines={1}>100 000 ₸</Text> в
                            приложении или на сайте. Карта будет выпущена
                            автоматически.
                          </Text>
                          <Text style={style.text}>
                            Или соберите чеки на
                            <Text numberOfLines={1}> 100 000 ₸</Text> и
                            обменяйте их на карту «АКВИЛОН.BONUS» на кассе или
                            стойке информации в нашем магазине.
                          </Text>
                        </View>
                      </View>
                      <View style={style.textRow}>
                        <View>
                          <Badge size={24} style={style.badge}>
                            2
                          </Badge>
                        </View>
                        <View style={style.textColumn}>
                          <Text style={style.text}>
                            Покупайте по клубной цене и используйте баллы для
                            оплаты заказа.
                          </Text>
                        </View>
                      </View>
                      <Text style={style.span}>
                        Карта выдаётся только физическим лицам.
                      </Text>
                      <Button
                        onPress={() => {
                          setInstructions(false);
                          setLeave(true);
                        }}
                        style={style.button}>
                        <Text style={style.buttonText}>Продолжить покупки</Text>
                      </Button>
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
  modal: {
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
    paddingHorizontal: 16,
    // width: '100%',
  },
  badge: {
    backgroundColor: PRIMARY_50,
    marginRight: 8,
  },
  textRow: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'PTRootUI-Bold',
  },
  text: {
    fontSize: 15,
    fontFamily: 'PTRootUI-Regular',
  },
  textMain: {
    fontSize: 15,
    fontFamily: 'PTRootUI-Regular',
    marginBottom: 8,
  },
  span: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'PTRootUI-Regular',
    color: GREY_50,
    marginBottom: 28,
  },
  button: {
    backgroundColor: GREY_3,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  buttonText: {
    color: PRIMARY_50,
    textTransform: 'none',
    fontFamily: 'PTRootUI-Bold',
    fontSize: 17,
  },
  wrapper: {},
});
