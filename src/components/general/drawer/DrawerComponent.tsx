/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useEffect, useState} from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  Platform,
} from 'react-native';
import {CloseIcon} from '@src/components/icons/close';
import {Headline} from 'react-native-paper';
import {GREY_3} from '@src/assets/style/variable.style';

type Props = {
  content: ReactNode;
  title: string;
  close: () => void;
  margin: number;
  borderRadius?: {
    topLeft: number;
    topRight: number;
  };
  contentStyle?: object;
};

function DrawerComponent({
  content,
  title,
  close,
  margin,
  borderRadius,
  contentStyle,
}: Props) {
  const [animation] = useState<Animated.Value>(new Animated.Value(0));

  const bgStyle = {
    backgroundColor: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(0,0,0, 0.5)', 'rgba(0,0,0, 0.5)'],
    }),
  };

  const mainViewContentStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [Dimensions.get('window').height, 0],
        }),
      },
    ],
  };

  const fadeOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleClose = () => {
    fadeOut();
    setTimeout(() => {
      close();
    }, 600);
  };

  const animationIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animationIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => handleClose()}
      style={style.modalContainerStyle}>
      <Animated.View style={[style.modal, bgStyle, {marginTop: margin}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? null : 'position'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 100}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                style.container,
                mainViewContentStyle,
                {
                  borderTopRightRadius: borderRadius?.topRight
                    ? borderRadius.topRight
                    : 0,
                  borderTopLeftRadius: borderRadius?.topLeft
                    ? borderRadius.topLeft
                    : 0,
                },
              ]}>
              <View>
                <Headline style={style.headline}>{title}</Headline>
                <CloseIcon
                  style={style.close}
                  width={20}
                  height={20}
                  color="black"
                  onPress={() => handleClose()}
                />
              </View>
              <View style={contentStyle ? contentStyle : style.content}>
                {content}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  modalContainerStyle: {flex: 1, backgroundColor: 'rgba(0,0,0, 0.5)'},
  modal: {
    flex: 1,
    marginTop: '-170%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  headline: {
    fontSize: 20,
    fontFamily: 'PTRootUI-Bold',
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(16, 19, 30, 0.7)',
  },
  content: {},
  containerActive: {},
  close: {
    position: 'absolute',
    right: 0,
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREY_3,
  },
});

export default DrawerComponent;
