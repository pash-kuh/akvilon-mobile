import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {BRAND_RED_50} from '@src/assets/style/variable.style';

export default function CustomLoader(props: {loading: boolean}) {
  if (!props.loading) {
    return null;
  }
  return (
    <View style={style.loading}>
      <ActivityIndicator animating={true} size="large" color={BRAND_RED_50} />
    </View>
  );
}

const style = StyleSheet.create({
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
