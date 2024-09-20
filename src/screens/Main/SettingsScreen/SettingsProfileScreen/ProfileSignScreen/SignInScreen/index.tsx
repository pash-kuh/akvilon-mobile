import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
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
  Platform,
  Pressable,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import {typography} from '@src/assets/style/typography.style';
import {
  BRAND_RED_50,
  GREY_50,
  PRIMARY_50,
} from '@src/assets/style/variable.style';
import TextInputMask from 'react-native-text-input-mask';
import {
  createUser,
  fetchUserInfo,
  fetchUserLoyaltyCard,
  fetchUserLoyaltyQrCode,
  getAuthStatus,
  loginByPassword,
  recoveryUser,
  setUserToken,
} from '@src/store/modules/user/UserActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppDispatch, RootState} from '@src/store';
import {
  setRoute,
  setTitle,
  setRouteNow,
} from '@src/store/modules/webview/WebviewReducer';
import {setCookie} from '@src/helpers/webview/cookie';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {SuccessfulIcon} from '../../../../../../assets/svg/successfulIcon';
import {ErrorIcon} from '../../../../../../assets/svg/errorIcon';
import {setConfirmation} from '@src/store/modules/user/UserReducer';
import {checkOnApi} from '@src/helpers/common/checkOnApi';
import {setNewAuth} from '@src/store/modules/config/ConfigReducer';
import {setPhone} from '@src/store/modules/user/UserReducer';
import {parsePhone} from '@src/helpers/common/parse';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList} from '@src/types/route';

//Компонент временно неиспользуется, т.к. авторизация и регистрация происходит через SignUp
export default function SignInScreen() {
  const {config, user} = useSelector((state: RootState) => state);

  const getNewAuthStatus = async () => {
    const data = await dispatch(getAuthStatus(config.apiUrl));
    dispatch(setNewAuth(data.payload));
  };

  useEffect(() => {
    getNewAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiUrl]);
  const dispatch: AppDispatch = useDispatch();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const route = useRoute();
  const [buttonText] = useState('Получить код');
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      username: user.phone ? user.phone : '',
      password: '',
    },
  });

  useEffect(() => {
    if (watch('username') !== user.phone) {
      dispatch(setPhone(watch('username')));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('username')]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await dispatch(
        createUser({username: data.username, url: config.apiUrl}),
      ).unwrap();
      return navigation.navigate('SettingProfileSignSignInSMS', {
        type: route.params.type,
        phone: getValues().username,
      });
    } catch (e) {
      if (e.message === 'Request failed with status code 401') {
        setError('username', {
          type: 'custom',
          message: 'Номер телефона или пароль неверный.',
        });
      } else if (e.message.includes('Пользователь')) {
        setError('username', {
          type: 'custom',
          message: e.message,
        });
      } else {
        setError('username', {
          type: 'custom',
          message: 'Произошла ошибка, попробуйте снова.',
        });
      }
      setLoading(false);
    } finally {
      setLoading(false);
      await appAlreadyLaunched();
    }
  };

  const continueWithOutAuth = async () => {
    navigation.replace('City');
    await appAlreadyLaunched();
  };

  const createAccount = async () => {
    navigation.navigate('SettingProfileSignSignUp', {
      type: route.params.type || '',
      phone: user.phone,
    });
    await appAlreadyLaunched();
  };

  const appAlreadyLaunched = async () => {
    await AsyncStorage.setItem('alreadyLaunched', '1');
  };

  return (
    <View style={style.wrapper}>
      <View style={style.container}>
        <View style={style.contentWrapper}>
          <Headline style={style.headline}>
            Войдите и реализуйте все возможности
            {/* {config.newAuth.newAuth === 'true' ? '(new auth)' : '(old auth)'} */}
          </Headline>
          <View>
            <Controller
              control={control}
              name="username"
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
                    style={style.input}
                    onBlur={onBlur}
                    right={
                      user.phone.length === 18 ? (
                        <TextInput.Icon
                          name={() =>
                            errors?.username ? ErrorIcon : SuccessfulIcon
                          }
                        />
                      ) : null
                    }
                    onChangeText={onChange}
                    value={user.phone}
                    keyboardType="phone-pad"
                    mode="outlined"
                    label="Ваш телефон"
                    outlineColor={
                      user.phone.length === 18 ? '#0A79CB' : '#DFE4E9'
                    }
                    activeOutlineColor="#0A79CB"
                    error={!!errors.username}
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
          </View>
          <Text style={style.errorText}>{errors?.username?.message}</Text>
          <Text style={style.text}>
            Отправим SMS-сообщениие с кодом подтверждения
          </Text>
        </View>
        <KeyboardAvoidingView
          style={{width: '100%'}}
          behavior={Platform.OS === 'android' ? null : 'position'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 100}>
          <Button
            style={style.button}
            labelStyle={style.buttonLabel}
            mode="contained"
            onPress={handleSubmit(onSubmit)}>
            {route.params.onlyPhone ? 'Отправить СМС' : 'Получить код'}
          </Button>
        </KeyboardAvoidingView>
        <View style={style.linkWrapper}>
          <Text
            onPress={() => Linking.openURL('https://akvilon.kz/policy/')}
            style={style.text2}>
            Вводя телефон, вы даете
            <Text style={style.link}>
              согласие на обработку персональных данных.
            </Text>
          </Text>
        </View>
        {/* {route.params.type === 'initial' ? (
          <Button
            labelStyle={style.outlineButtonLabel}
            onPress={() => continueWithOutAuth()}>
            Продолжить без регистрации
          </Button>
        ) : null} */}
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
    justifyContent: 'flex-end',
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    paddingHorizontal: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 48,
    lineHeight: 28,
    ...typography('xxl', 'bold'),
    fontWeight: Platform.OS === 'ios' ? 'bold' : null,
  },
  input: {
    width: 224,
    backgroundColor: '#FFF',
    ...typography('lg'),
  },
  text: {
    marginTop: 28,
    color: GREY_50,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontFamily: 'PTRootUI-Regular',
    fontSize: 15,
  },
  linkWrapper: {
    marginBottom: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text2: {
    color: GREY_50,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'PTRootUI-Regular',
    letterSpacing: 0.26,
  },
  link: {
    color: PRIMARY_50,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'PTRootUI-Regular',
    letterSpacing: 0.26,
  },
  button: {
    backgroundColor: '#F00933',
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 14,
    marginBottom: 16,
    width: '100%',
  },
  buttonLabel: {
    textTransform: 'none',
    ...typography('md', 'medium'),
    color: '#FFF',
  },
  outlineButtonLabel: {
    ...typography('xs', 'bold'),
    color: '#006AC7',
  },
  errorText: {
    ...typography('sm', 'regular'),
    marginTop: 4,
    color: BRAND_RED_50,
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
    backgroundColor: '#fff',
  },
});
