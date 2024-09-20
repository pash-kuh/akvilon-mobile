import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, Title, Button} from 'react-native-paper';
import {BRAND_RED_50} from '@src/assets/style/variable.style';
import {typography} from '@src/assets/style/typography.style';
import SplashScreen from 'react-native-splash-screen';
import {NavigationProps} from '@src/types/route';
import {useNavigation, useRoute} from '@react-navigation/native';
/**
 * Regular description
 *
 * @category Screen
 */
export default function ErrorScreen() {
  const navigation = useNavigation();
  const handlePress = async () => {
    await SplashScreen.show();
    await navigation.navigate('Loading');
  };
  return (
    <View style={style.view}>
      <View style={style.imageWrapper}>
        <Image
          source={require('@src/assets/image/no-wifi.png')}
          style={style.image}
        />
      </View>
      <Title style={style.title}>Вы не подключены к сети</Title>
      <Text style={style.text}>Проверьте соединение с интернетом</Text>
      <Button
        style={style.button}
        labelStyle={style.buttonText}
        mode="contained"
        onPress={() => handlePress()}>
        Обновить
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  imageWrapper: {
    marginBottom: 16,
    width: 120,
    height: 120,
    backgroundColor: '#F2F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },

  image: {
    width: 120,
    height: 120,
  },

  title: {
    marginBottom: 4,
    ...typography('lg', 'bold'),
  },

  text: {
    marginBottom: 24,
    ...typography('md', 'regular'),
  },

  button: {
    backgroundColor: BRAND_RED_50,
  },

  buttonText: {
    ...typography('md', 'medium'),
    textTransform: 'none',
    color: '#fff',
  },
});
