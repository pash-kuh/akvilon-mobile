import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Paragraph, List} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {CityItem} from '@src/store/modules/city/CityTypes';
import {setActiveCity} from '@src/store/modules/city/CityActions';
import {GREY_50, GREY_70, GREY_90} from '@src/assets/style/variable.style';
import {RootState} from '@src/store';
import {ParamList} from '@src/types/route';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  setRoute,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import {setCookie} from '@src/helpers/webview/cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
/**
 * Regular description
 *
 * @category Screen
 */

type ParamsList = {
  CityScreen: {
    route: string;
    isWebPage: boolean;
    alredyLaunched: string;
  };
};

export default function CityScreen() {
  const {list, active} = useSelector((state: RootState) => state.city);
  const {config, user} = useSelector((s: RootState) => s);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const route = useRoute<RouteProp<ParamsList, 'CityScreen'>>();
  const dispatch = useDispatch();
  const [launched, setLaunched] = useState(false);
  const sections = [
    {
      title: 'Доставка и самовывоз',
      data: list.filter((item) => item.local && item.code !== 'aksu'),
    },
    {
      title: 'Доставка транспортными компаниями',
      data: [
        list.find((item) => item.code === 'aksu'),
        ...list
          .filter((item) => !item.local)
          .sort((a, b) => (a.code > b.code ? 1 : -1)),
      ],
    },
  ];

  const checkOnLaunched = async () => {
    if (route.params.alredyLaunched === '1') {
      await AsyncStorage.setItem('alreadyLaunched', '1');
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((response) => {
      if (response) {
        setLaunched(true);
      } else {
        setLaunched(false);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setTitle('Выберите город'));
    checkOnLaunched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = async (selectedItem: CityItem) => {
    dispatch(setActiveCity(selectedItem));

    dispatch(setRoute(`changeCity|${JSON.stringify(selectedItem)}`));
    await setCookie(config.url, {
      name: 'pickedCity',
      value: selectedItem.code,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (route.name === 'City') {
      navigation.navigate('MainPageScreen', {
        isWebPage: false,
        route: '/',
      });
      // dispatch(setLoading(true))
      dispatch(setTab('MainPage'));
    }
    // else if (navigation.canGoBack()) {
    //  navigation.goBack();
    //}
  };

  return (
    <ScrollView style={style.scrollView}>
      {/*Если пользователь первый раз запустил приложение и прошёл авторизацию*/}
      {!launched && user?.token && (
        <Text style={style.laststep}>Последний шаг — выберите ваш город</Text>
      )}
      <Paragraph style={style.paragraph}>
        Если город отсутствует в&nbsp;списке&nbsp;— выберите ближайший,
        до&nbsp;которого будет доставлен заказ.
      </Paragraph>
      {sections.map((row, rIndex) => {
        return (
          <List.Section key={rIndex}>
            <List.Subheader style={style.subheader}>{row.title}</List.Subheader>
            {/* {Platform.OS === 'ios' ? <Divider /> : null} */}
            {row &&
              row.data.map((item: CityItem, iIndex) => {
                return (
                  <List.Item
                    key={iIndex}
                    title={item && item.name}
                    style={style.item}
                    right={() => {
                      if (active === item?.code) {
                        return (
                          <List.Icon
                            style={style.icon}
                            icon={require('@src/assets/svg/active.png')}
                          />
                        );
                      }
                      return null;
                    }}
                    titleStyle={style.title}
                    onPress={() => handlePress(item)}
                  />
                );
              })}
          </List.Section>
        );
      })}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -55,
  },
  subheader: {
    fontSize: 11,
    textTransform: 'uppercase',
    color: GREY_50,
    fontFamily: 'PTRootUI-Bold',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'PTRootUI-Bold' : 'PTRootUI-Regular',
    color: GREY_70,
  },
  paragraph: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: Platform.OS === 'ios' ? 32 : 0,
    marginBottom: Platform.OS === 'ios' ? 16 : 38,
    letterSpacing: 0.01,
    color: GREY_90,
  },
  item: {
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  divider: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  laststep: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'PTRootUI-Bold',
  },
});
