import React, {useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {UserState} from '@src/store/modules/user/UserTypes';
import TextInputMask from 'react-native-text-input-mask';
import {SuccessfulIcon} from '../../../assets/svg/successfulIcon';
import {ErrorIcon} from '../../../assets/svg/errorIcon';
import {
  BRAND_RED_50,
  GREY_3,
  GREY_30,
  PRIMARY_50,
  WHITE,
} from '@src/assets/style/variable.style';
import {Controller, useForm} from 'react-hook-form';
import {fetchCallBack} from '@src/store/modules/user/UserActions';
import {useDispatch} from 'react-redux';
import moment from 'moment-timezone';
import {kzTimeChecker} from '@src/helpers/kzTimeChecker';
import DrawerComponent from '../drawer/DrawerComponent';
import {AppDispatch} from '@src/store';

type Props = {
  close: () => void;
  user: UserState;
  cityId: string;
  apiUrl: string;
};

function Support({close, user, cityId, apiUrl}: Props) {
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm({
    defaultValues: {
      phone: '',
    },
  });
  const dispatch: AppDispatch = useDispatch();

  const getTime = () => {
    const currentTime = moment().tz('Asia/Almaty');
    const hours = currentTime.format('HH');
    const minutes = currentTime.format('mm');
    return {hours, minutes};
  };

  const [newNumberState, setNewNumberState] = useState(!!user?.token);
  const [newPhone, setNewPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const num = user?.user?.phone
    ? `+${user?.user?.phone.substring(0, 1)} ${user?.user?.phone.substring(
        1,
        4,
      )}-${user?.user?.phone.substring(4, 7)}-${user?.user?.phone.substring(
        7,
        9,
      )}-${user?.user?.phone.substring(9, 11)}`
    : '';

  const changeNumber = () => {
    setNewNumberState(false);
  };

  const onSubmit = async (data) => {
    try {
      if (newNumberState) {
        const {payload} = await dispatch(
          fetchCallBack({phone: `+${user?.user?.phone}`, cityId, url: apiUrl}),
        );

        if (payload) {
          setSuccess(true);
        }
      } else {
        const updatedPhone = data.phone
          .replace('(', '')
          .replace(')', '')
          .replace(/\s/g, '');

        const dividedPhone = `+${updatedPhone.substring(
          1,
          2,
        )} ${updatedPhone.substring(2, 5)}-${updatedPhone.substring(
          5,
          8,
        )}-${updatedPhone.substring(8, 10)}-${updatedPhone.substring(10, 12)}`;

        setNewPhone(dividedPhone);
        const {payload} = await dispatch(
          fetchCallBack({phone: updatedPhone, cityId, url: apiUrl}),
        );

        if (payload) {
          setSuccess(true);
        }
      }
    } catch (error) {
      setSuccess(false);
      if (error.message === 'Request failed with status code 401') {
        setError('phone', {
          type: 'custom',
          message: 'Такого номера не существует.',
        });
      } else {
        setError('phone', {
          type: 'custom',
          message: 'Произошла ошибка, попробуйте снова.',
        });
      }
    }
  };

  return (
    <DrawerComponent
      title=""
      close={() => {
        close();
        setNewNumberState(false);
      }}
      borderRadius={{topLeft: 12, topRight: 12}}
      margin={Platform.OS === 'ios' ? 100 : 0}
      content={
        <View style={style.modalContent}>
          {success ? (
            <>
              <Text style={style.header}>
                {kzTimeChecker(getTime().hours, getTime().minutes)
                  ? 'Скоро позвоним'
                  : 'Позвоним завтра'}
              </Text>
              {kzTimeChecker(getTime().hours, getTime().minutes) ? (
                <View style={style.textContainer}>
                  <Text style={style.text}>Вы заказали звонок на </Text>
                  <Text numberOfLines={1} style={style.textUnwrap}>
                    {!newNumberState ? newPhone : num}.
                  </Text>
                  <Text style={style.text}> Перезвоним в течение </Text>
                  <Text numberOfLines={1} style={style.textUnwrap}>
                    30 минут.
                  </Text>
                </View>
              ) : (
                <View style={style.textContainer}>
                  <Text style={style.text}>
                    Магазин уже закрыт. Перезвоним завтра на{' '}
                  </Text>
                  <Text numberOfLines={1} style={style.textUnwrap}>
                    {!newNumberState ? newPhone : num}
                  </Text>
                  <Text style={style.text}>, в первой половине дня.</Text>
                </View>
              )}
              <Button
                style={[style.button, {backgroundColor: GREY_3, elevation: 0}]}
                labelStyle={[style.buttonLabel, {color: PRIMARY_50}]}
                mode="contained"
                onPress={() => {
                  close();
                  setNewNumberState(false);
                }}>
                Продолжить покупки
              </Button>
            </>
          ) : (
            <>
              <Text style={style.header}>Закажите звонок</Text>
              {newNumberState ? (
                <>
                  {kzTimeChecker(getTime().hours, getTime().minutes) ? (
                    <View style={style.textContainer}>
                      <Text style={style.text}>
                        Перезвоним на {num} в течение{' '}
                      </Text>
                      <Text numberOfLines={1} style={style.textUnwrap}>
                        30 минут.{' '}
                      </Text>
                      <Text onPress={changeNumber} style={style.phoneNumber}>
                        Другой номер.
                      </Text>
                    </View>
                  ) : (
                    <View style={style.textContainer}>
                      <Text style={style.text}>
                        Магазин уже закрыт. Перезвоним завтра,
                      </Text>
                      <Text numberOfLines={1} style={style.textUnwrap}>
                        {' '}
                        в первой{' '}
                      </Text>
                      <Text style={style.text}>половине дня на {num}. </Text>
                      <Text onPress={changeNumber} style={style.phoneNumber}>
                        Другой номер.
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={style.phoneBlock}>
                  {kzTimeChecker(getTime().hours, getTime().minutes) ? (
                    <Text style={style.text}>
                      Перезвоним в течение 30 минут
                    </Text>
                  ) : (
                    <View style={style.textContainer}>
                      <Text style={style.text}>
                        Магазин уже закрыт. Перезвоним завтра,
                      </Text>
                      <Text numberOfLines={1} style={style.textUnwrap}>
                        {' '}
                        в первой{' '}
                      </Text>
                      <Text style={style.text}>половине дня. </Text>
                    </View>
                  )}

                  <Controller
                    control={control}
                    name="phone"
                    rules={{
                      required: 'Введите номер телефона',
                      minLength: {
                        value: 18,
                        message: 'Телефон введен неверно',
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => {
                      return (
                        <TextInput
                          autoFocus
                          style={style.input}
                          onBlur={onBlur}
                          right={
                            value.length === 18 ? (
                              <TextInput.Icon
                                name={() =>
                                  errors?.phone ? ErrorIcon : SuccessfulIcon
                                }
                              />
                            ) : null
                          }
                          onChangeText={onChange}
                          value={value}
                          keyboardType="phone-pad"
                          mode="outlined"
                          label="Ваш телефон"
                          outlineColor={
                            value.length === 18 ? '#0A79CB' : '#DFE4E9'
                          }
                          activeOutlineColor="#0A79CB"
                          error={!!errors.phone}
                          render={(rProps) => (
                            <TextInputMask
                              {...rProps}
                              mask={'+7 ([000]) [000] [00] [00]'}
                            />
                          )}
                        />
                      );
                    }}
                  />
                  <Text style={style.errorText}>{errors?.phone?.message}</Text>
                </View>
              )}
              <Button
                style={[
                  style.button,
                  {backgroundColor: errors.phone ? GREY_3 : BRAND_RED_50},
                ]}
                disabled={!!errors.phone}
                labelStyle={[
                  style.buttonLabel,
                  {color: errors.phone ? GREY_30 : WHITE},
                ]}
                mode="contained"
                onPress={handleSubmit(onSubmit)}>
                {kzTimeChecker(getTime().hours, getTime().minutes)
                  ? 'Заказать звонок'
                  : 'Заказать звонок на завтра'}
              </Button>
            </>
          )}
        </View>
      }
    />
  );
}

export default Support;

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
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  textUnwrap: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 15,
    textAlign: 'center',
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
  phoneNumber: {
    color: PRIMARY_50,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    fontSize: 17,
    marginTop: 32,
    fontFamily: 'PTRootUI-Regular',
  },
  button: {
    //backgroundColor: BRAND_RED_50,
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 32,
    marginBottom: 16,
    width: '100%',
  },
  buttonLabel: {
    textTransform: 'none',
    fontFamily: 'PTRootUI-Medium',
    fontSize: 17,
  },
  phoneBlock: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    color: BRAND_RED_50,
    fontSize: 13,
    fontFamily: 'PTRootUI-Medium',
  },
});
