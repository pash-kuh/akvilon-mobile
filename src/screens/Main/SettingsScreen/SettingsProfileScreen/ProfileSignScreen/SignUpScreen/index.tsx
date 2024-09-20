import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Headline,
  Text,
  TextInput,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import TextInputMask from 'react-native-text-input-mask';
import {typography} from '@src/assets/style/typography.style';
import {BRAND_RED_50, PRIMARY_50} from '@src/assets/style/variable.style';
import {NavigationProps} from '@src/types/route';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {createUser} from '@src/store/modules/user/UserActions';
import {AppDispatch, RootState} from '@src/store';
import {setTitle} from '@src/store/modules/webview/WebviewReducer';
import {setConfirmation, setPhone} from '@src/store/modules/user/UserReducer';
import analytics from '@react-native-firebase/analytics';

export default function SignUpScreen(props: {
  navigation: NavigationProps<'SettingProfileSignSignUp'>['navigation'];
  route: NavigationProps<'SettingProfileSignSignUp'>['route'];
}) {
  // Создать аккаунт
  const dispatch: AppDispatch = useDispatch();
  const [buttonText] = useState('ОТПРАВИТЬ СМС');
  const [loading, setLoading] = useState(false);
  const {config, user} = useSelector((s: RootState) => s);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    watch,
  } = useForm({
    defaultValues: {
      phone: user.phone,
      checkbox: true,
    },
  });
  //Отправка смс с подтверждением
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const datas = await dispatch(
        createUser({username: data.phone, url: config.apiUrl}),
      ).unwrap();
      dispatch(setConfirmation(datas.data.confirmation));
      props.navigation.replace('SettingProfileSignMsg', {
        phone: data.phone,
        type: props.route.params.type || '',
        signin: true,
      });
      await analytics().logEvent('authorization');
    } catch (e) {
      if (e.message.includes('500')) {
        setError('checkbox', {
          type: 'custom',
          message: 'Ошибка при отправке кода, попробуйте позже.',
        });
      } else {
        setError('checkbox', {
          type: 'custom',
          message: 'Произошла ошибка, попробуйте снова.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  //Открытие соглашения
  const openPersonalDataPage = async () => {
    const url = 'https://akvilon.kz/include/licenses_detail/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('', 'На устройстве нет браузера, чтобы открыть ссылку', [
        {
          text: 'Понятно',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
    }
  };

  useEffect(() => {
    dispatch(setPhone(watch('phone')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('phone')]);

  useEffect(() => {
    dispatch(setTitle('Создать аккаунт'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={style.wrapper}>
      <View style={style.container}>
        <Headline style={style.headline}>Введите телефон</Headline>
        <View>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Введите номер телефона',
              minLength: {
                value: 18,
                message: 'Телефон введен неверно', // JS only: <p>error message</p> TS only support string
              },
            }}
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <TextInput
                  style={style.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                  mode="outlined"
                  label="Номер телефона"
                  outlineColor="#DFE4E9"
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
          <Text style={style.errorText}>{errors?.checkbox?.message}</Text>
        </View>
        <TouchableWithoutFeedback>
          <View style={style.checkboxWrapper}>
            <Controller
              control={control}
              name="checkbox"
              rules={{
                required: 'Пожалуйста, ознакомьтесь с условиями',
              }}
              render={({field: {onChange, value}}) => (
                <CheckBox
                  tintColors={{true: PRIMARY_50}}
                  value={value}
                  onValueChange={onChange}
                  boxType="square"
                  style={{width: 20, height: 20, marginRight: 12}}
                />
              )}
            />
            <Text style={[style.checkboxText]}>Я даю согласие на&nbsp;</Text>
            <TouchableOpacity onPress={() => openPersonalDataPage()}>
              <Text style={[style.checkboxText, style.checkboxLink]}>
                обработку персональных данных
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <Button
          style={style.button}
          labelStyle={style.buttonLabel}
          mode="contained"
          onPress={handleSubmit(onSubmit)}>
          {buttonText}
        </Button>
      </View>
      {loading && (
        <View style={style.loading}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={BRAND_RED_50}
          />
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#FFFFFF',
  },
  headline: {
    marginTop: 24,
    marginBottom: 24,
    ...typography('xl', 'bold'),
    fontWeight: Platform.OS === 'ios' ? 'bold' : null,
  },
  input: {
    backgroundColor: '#FFF',
    fontSize: 17,
  },
  button: {
    backgroundColor: '#F00933',
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 14,
    marginBottom: 16,
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: 'PTRootUI-Medium',
    color: '#FFF',
  },
  errorContainer: {
    marginTop: 4,
    marginLeft: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'PTRootUI-Regular',
    color: BRAND_RED_50,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 12,
    fontFamily: 'PTRootUI-Regular',
  },
  checkboxLink: {
    textDecorationLine: 'underline',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});
