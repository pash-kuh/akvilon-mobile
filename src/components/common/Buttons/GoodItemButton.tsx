import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  onPress: () => void;
  title: string;
  backgroundColor: string;
  textColor: string;
  liquidation?: boolean;
};

export default function GoodItemButton({
  onPress,
  title,
  backgroundColor,
  textColor,
  liquidation,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={
        liquidation
          ? {}
          : [style.buttonContainer, {backgroundColor: backgroundColor}]
      }>
      {liquidation ? (
        <LinearGradient
          colors={['#FF8329', '#FC035A']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0.5}}
          useAngle={true}
          angle={135}
          style={style.buttonContainer}>
          <Text style={[style.buttonTitle, {color: textColor}]}>{title}</Text>
        </LinearGradient>
      ) : (
        <Text style={[style.buttonTitle, {color: textColor}]}>{title}</Text>
      )}
    </Pressable>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonTitle: {
    fontFamily: 'PTRootUI-Medium',
    fontSize: 15,
    lineHeight: 20,
  },
});
