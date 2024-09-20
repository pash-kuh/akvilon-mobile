import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import {typography} from '@src/assets/style/typography.style';
import {BRAND_RED_50, GREY_20, GREY_90} from '@src/assets/style/variable.style';
import {ActivityIndicator, Headline, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {NavigationProps} from '@src/types/route';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchUserInfo,
  fetchUserLoyaltyCard,
  fetchUserLoyaltyQrCode,
  newConfirmUser,
  recoveryUser,
  resendConfirmationUser,
  setUserToken,
} from '@src/store/modules/user/UserActions';
import {AppDispatch, RootState} from '@src/store';
import {
  setRoute,
  setRouteNow,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import {setCookie} from '@src/helpers/webview/cookie';
import {
  CommonActions,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkOnApi} from '@src/helpers/common/checkOnApi';
import {setConfirmation, setPhone} from '@src/store/modules/user/UserReducer';
import {EditIcon} from '../../../../../../assets/svg/editIcon';
import analytics from '@react-native-firebase/analytics';
import OTPTextView from 'react-native-otp-textinput';

type ParamsList = {
  SignMsgScreen: {
    phone: string;
  };
};

export default function SignMsgScreen(props: {
  route: NavigationProps<'SettingProfileSignMsg'>['route'];
  navigation: NavigationProps<'SettingProfileSignMsg'>['navigation'];
}) {
  const {config, webview, city, user} = useSelector(
    (state: RootState) => state,
  );
  const navigation =
    useNavigation<NavigationProps<'SettingProfileSignSignIn'>['navigation']>();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(30);
  const route = useRoute<RouteProp<ParamsList, 'SignMsgScreen'>>();
  const dispatch: AppDispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm({
    defaultValues: {
      sms: '',
    },
  });
  let timer = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startTimer = () => {
    timer = setTimeout(() => {
      if (time <= 0) {
        clearTimeout(timer);
        return false;
      }
      setTime(time - 1);
    }, 1000);
  };

  //Подтверждение смс
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = await dispatch(
        newConfirmUser({
          sms: data.sms,
          confirmation: user.confirmation,
          url: config.apiUrl,
        }),
      ).unwrap();
      dispatch(setRoute(`auth|${token}`));
      await dispatch(setUserToken(token));
      const userInfo = await dispatch(
        fetchUserInfo({token: token, url: config.apiUrl}),
      ).unwrap();
      await dispatch(fetchUserLoyaltyCard({token: token, url: config.apiUrl}));
      if (userInfo?.loyalty?.balance) {
        await dispatch(
          fetchUserLoyaltyQrCode({token: token, url: config.apiUrl}),
        );
      }
      await setCookie(config.url, {
        name: 'token',
        value: token,
      });
      await analytics().logEvent('authorization');
      if (city.active === null) {
        return props.navigation.replace('City');
      } else {
        if (webview.route === 'Cart') {
          props.navigation.dispatch(StackActions.push('CartOrderScreen'));
        } else if (webview.route === '/calculator/') {
          dispatch(setTitle('Строительный калькулятор'));
          dispatch(setRoute('/calculations/'));
          dispatch(setRouteNow('/calculations/'));
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {name: 'SettingMainScreen', params: {route: '/empty/'}},
                {name: 'SettingMainScreen', params: {route: '/calculations/'}},
              ],
            }),
          );
        } else {
          props.navigation.dispatch(StackActions.push('MainPageScreen'));
          dispatch(setTab('MainPage'));
        }
      }
      dispatch(setPhone(''));
      dispatch(setRoute(webview.route));
    } catch (e) {
      if (e.message.includes('Пользователь')) {
        setError('sms', {
          type: 'custom',
          message: 'Аккаунт уже зарегистрирован.',
        });
      } else if (e.message.includes('Слишком много попыток')) {
        setError('sms', {
          type: 'custom',
          message: 'Превышен лимит запросов, попробуйте позже',
        });
      } else if (e.message.includes('Неверный код')) {
        setError('sms', {
          type: 'custom',
          message: 'Неправильный код',
        });
      } else {
        setError('sms', {
          type: 'custom',
          message: 'Произошла ошибка, попробуйте снова',
        });
      }
    } finally {
      setLoading(false);
      await appAlreadyLaunched();
    }
  };

  const appAlreadyLaunched = async () => {
    await AsyncStorage.setItem('alreadyLaunched', '1');
  };

  //Повторный запрос СМС
  const repeatRequest = async () => {
    try {
      setLoading(true);
      if (checkOnApi(config.newAuth.newAuth === 'true')) {
        const {data} = await dispatch(
          resendConfirmationUser({...user, url: config.apiUrl}),
        ).unwrap();
        dispatch(setConfirmation(data.confirmation));
      } else {
        await dispatch(
          recoveryUser({
            username: props.route.params.phone,
            url: config.apiUrl,
          }),
        ).unwrap();
      }

      setTime(30);
      clearTimeout(timer);
      startTimer();
      setLoading(false);
    } catch (e) {
      console.log(e);
      if (e.message.includes('429')) {
        setError('sms', {
          type: 'custom',
          message: 'Превышен лимит запросов, попробуйте позже',
        });
      } else if (e.message.includes('500')) {
        setError('sms', {
          type: 'custom',
          message: 'Ошибка при отправке кода, попробуйте позже',
        });
      } else {
        setError('sms', {
          type: 'custom',
          message: 'Произошла ошибка, попробуйте снова',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const getFormatTime = () => {
    return time <= 9 ? `0${time}` : time;
  };
  useEffect(() => {
    startTimer();
    return () => clearTimeout(timer);
  }, [startTimer, timer]);
  return (
    <View style={style.wrapper}>
      <View style={style.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? null : 'position'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 200}>
          <Headline style={style.headline}>Введите код из СМС</Headline>
          <Pressable
            style={style.textContainer}
            onPress={() => navigation.navigate('SettingProfileSignSignIn')}>
            <Text style={style.text}>{route.params.phone}</Text>
            {EditIcon}
          </Pressable>
          <View style={style.inputWrapper}>
            <Controller
              name="sms"
              control={control}
              rules={{
                required: 'Введите код из SMS',
                minLength: {
                  value: 4,
                  message: 'Неполный код',
                },
              }}
              render={({field: {onChange}}) => {
                return (
                  <OTPTextView
                    autoFocus
                    handleTextChange={(value) => {
                      onChange(value);
                      if (value.length === 4) {
                        handleSubmit(onSubmit)();
                      }
                    }}
                    containerStyle={
                      errors.sms
                        ? style.textInputContainerError
                        : style.textInputContainer
                    }
                    textInputStyle={
                      errors.sms
                        ? style.roundedTextInputError
                        : style.roundedTextInput
                    }
                    offTintColor={errors.sms ? 'red' : '#E1E4E6'}
                    inputCount={4}
                    tintColor={errors.sms ? 'red' : '#E1E4E6'}
                    inputCellLength={1}
                  />
                );
              }}
            />
            <Text style={style.errorText}>
              {errors?.sms?.message}{' '}
              {errors?.sms?.message &&
                errors?.sms?.message?.includes('Аккаунт') && (
                  <Text
                    style={[style.errorText, {textDecorationLine: 'underline'}]}
                    onPress={() =>
                      navigation.navigate('SettingProfileSignSignInOnyPhone', {
                        onlyPhone: true,
                      })
                    }>
                    Войти
                  </Text>
                )}
            </Text>
          </View>
          {time <= 0 ? (
            <TouchableOpacity onPress={() => repeatRequest()}>
              <Text style={style.linkPressable}>Отправить ещё один код</Text>
            </TouchableOpacity>
          ) : (
            <Text style={style.link}>
              Отправить код повторно через 0:{getFormatTime()}
            </Text>
          )}
        </KeyboardAvoidingView>
        {/* <Button
          style={style.button}
          labelStyle={style.buttonLabel}
          onPress={handleSubmit(onSubmit)}
          mode="contained">
          {route.params.signin ? 'Зарегистрироваться' : buttonText}
        </Button> */}
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
  textInputContainer: {
    justifyContent: 'center',
    width: 168,
  },
  textInputContainerError: {
    justifyContent: 'center',
    width: 168,
  },
  roundedTextInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E1E4E6',
    height: 64,
  },
  roundedTextInputError: {
    borderRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'red',
    height: 64,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  inputWrapper: {
    alignItems: 'center',
  },
  link: {
    color: GREY_20,
    textAlign: 'center',
    fontSize: 12,
  },
  linkPressable: {
    color: '#0A79CB',
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headline: {
    paddingHorizontal: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 28,
    ...typography('xxl', 'bold'),
    fontWeight: Platform.OS === 'ios' ? 'bold' : null,
  },
  text: {
    color: GREY_90,
    fontFamily: 'PTRootUI-Regular',
    marginRight: 4,
  },
  textContainer: {
    flexDirection: 'row',
    marginBottom: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    fontFamily: 14,
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
  errorText: {
    fontSize: 12,
    fontFamily: 'PTRootUI-Regular',
    marginTop: 4,
    marginLeft: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});

export const MSGStyle = style;
