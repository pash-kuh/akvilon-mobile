import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigationBuilder, StackRouter} from '@react-navigation/native';
import {WebviewComponent} from '@src/helpers/webview/component';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@src/store';
import {CustomTabBar} from '@src/components/general/CustomTabBar';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader} from '@src/components/general/CustomHeader';
import {setTab} from '@src/store/modules/webview/WebviewReducer';

export default function TabNavigator({
  initialRouteName,
  children,
  screenOptions,
}) {
  const {webview} = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [options, setOptions] = useState<{
    isWebView?: boolean | undefined;
    headerTitle?: string | undefined;
  }>({});
  const [ref, setRef] = useState<any>();
  const {state, navigation, descriptors, NavigationContent} =
    useNavigationBuilder(StackRouter, {
      children,
      screenOptions,
      initialRouteName,
    });
  const getHeaderOptions = (route) => {
    if (options.headerTitle !== route.options.headerTitle) {
      setOptions(route.options);
    }
    return route.render();
  };

  React.useEffect(() => {
    if (webview.tab === 'Home') {
      dispatch(setTab('MainPage'));
    }
  });

  //Навигация внутри webview
  const navigationGoBackHandle = () => {
    if (ref) {
      ref.goBack();
    }
  };

  return (
    <NavigationContent>
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader
          navigation={navigation}
          state={state}
          options={options}
          webview={webview}
          navigationGoBackHandle={navigationGoBackHandle}
        />
        {webview.title !== 'Главня' && (
          <WebviewComponent
            viewStyle={{flex: options.isWebView ? 1 : 0}}
            state={state}
            setRef={setRef}
          />
        )}
        <View style={{flex: !options.isWebView ? 1 : 0, display: 'flex'}}>
          {state.routes.map((nRoute, i) => {
            return (
              <View
                key={nRoute.key}
                style={[
                  i === state.index ? StyleSheet.absoluteFill : {},
                  {flex: options.isWebView ? 0 : 1},
                  {display: i === state.index ? 'flex' : 'none'},
                ]}>
                {i === state.index && getHeaderOptions(descriptors[nRoute.key])}
              </View>
            );
          })}
        </View>
        <CustomTabBar />
      </SafeAreaView>
    </NavigationContent>
  );
}
