import React, {Component, ReactNode} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Headline} from 'react-native-paper';
import {typography} from '@src/assets/style/typography.style';
import {CloseIcon} from '@src/components/icons/close';
import {GREY_3} from '@src/assets/style/variable.style';
/**
 * Основа для всплывающих окон
 *
 * @category General
 */
export class DrawerSection extends Component<
  {
    content: ReactNode;
    title: string;
    close: () => void;
    margin: number;
    borderRadius?: {
      topLeft: number;
      topRight: number;
    };
  },
  {
    animation: Animated.Value;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animationIn();
  }

  render() {
    const {content, title, margin, borderRadius} = this.props;
    const bgStyle = {
      backgroundColor: this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0, 0.5)', 'rgba(0,0,0, 0.5)'],
      }),
    };
    const contentStyle = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').height, 0],
          }),
        },
      ],
    };
    return (
      <TouchableWithoutFeedback
        onPress={() => this.handleClose()}
        style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0.5)'}}>
        <Animated.View style={[style.modal, bgStyle, {marginTop: margin}]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? null : 'position'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 100}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  style.container,
                  contentStyle,
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
                    onPress={() => this.handleClose()}
                  />
                </View>
                <View style={style.content}>{content}</View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  handleClose() {
    this.fadeOut();
    setTimeout(() => {
      this.props.close();
    }, 600);
  }

  animationIn() {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  fadeOut() {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
}

const style = StyleSheet.create({
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
    ...typography('xl', 'bold'),
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
