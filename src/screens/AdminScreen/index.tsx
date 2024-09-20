import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {setTitle} from '@src/store/modules/webview/WebviewReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@src/store';
import {Button, Headline, Switch, Text, TextInput} from 'react-native-paper';
import {typography} from '@src/assets/style/typography.style';
import {useNavigation} from '@react-navigation/native';
import {saveReviewStatus} from '@src/store/modules/review/ReviewActions';
import QrCodeDrawer from '@src/components/drawers/qrCodeDrawer';

export default function AdminScreen() {
  const navigation = useNavigation();
  const {config} = useSelector((state: RootState) => state);
  const [open, setOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle('Страница разработчика'));
  });
  // Переменная разработчика isDev
  // Переменная Api - ApiURI
  // Переменная Webview - WebviewURI
  return (
    <ScrollView style={[StyleSheet.absoluteFill, {backgroundColor: '#fff'}]}>
      <Button
        onPress={() =>
          navigation.navigate('FeedbackDrawer', {
            margin: 0,
          })
        }>
        Открыть Feedback
      </Button>
      <Button onPress={() => setOpen(true)}>Открыть QR Code</Button>
      <Button onPress={() => dispatch(saveReviewStatus(null))}>
        Сбросить статус Feedback
      </Button>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{...typography('lg', 'bold')}}>Режим разработчика</Text>
        <Switch />
      </View>
      <Text style={{...typography('sm'), color: 'red'}}>
        В этом режиме, у вас будут подставляться только те адреса, которые
        введены тут принудительно.
      </Text>
      <Headline>Адрес API</Headline>
      <TextInput value={config.apiUrl} />
      <Headline>Адрес Webview</Headline>
      <TextInput value={config.url} />
      <Button>Сохранить</Button>
      {open && <QrCodeDrawer open={open} setOpen={setOpen} />}
    </ScrollView>
  );
}
