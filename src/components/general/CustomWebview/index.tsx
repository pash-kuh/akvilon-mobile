import React from 'react';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import {RootState} from '@src/store';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';

type ParamsList = {
  CustomWebview: {
    route: string;
  };
};

export default function CustomWebview() {
  const route = useRoute<RouteProp<ParamsList, 'CustomWebview'>>();
  const {config} = useSelector((state: RootState) => state);
  // const [loading, setLoading] = useState(true);
  return (
    <View style={style.container}>
      <WebView
        source={{uri: `https://${config.url}${route.params.route}`}}
        // onLoadStart={() => dispatch(setLoading(true))}
        // onLoadEnd={() => dispatch(setLoading(false))}
        thirdPartyCookiesEnabled
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
