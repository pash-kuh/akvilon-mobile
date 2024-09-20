import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from "react-redux";
import {setHideTabBar} from '@src/store/modules/webview/WebviewReducer';
import {Button} from 'react-native-paper';
import {widthToDp, heightToDp} from 'rn-responsive-screen';
import {typography} from '@src/assets/style/typography.style';
import {GREY_90} from '@src/assets/style/variable.style';

/**
 * Товар не найден
 *
 * @category CameraScreen Not Found Screen
 */

const textData = {
  button: "Попробовать еще раз",
  text: "Попробуйте отсканировать штрих-код ещё раз или воспользуйтесь поиском по каталогу",
  title: "Товар не найден"
}

const CameraNotFoundScreen = ({ webview, dispatch, navigation }) => {

  useEffect(() => {
    dispatch(setHideTabBar(true));
    return () => {
      dispatch(setHideTabBar(false));
    };
  }, [dispatch]);

  return (
      <View style={styles.container}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backArrow}
              onPress={() => navigation.navigate('Camera')}>
            <Image
              source={require('@src/assets/svg/back-arrow-v2.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>
            {textData.title}
          </Text>
          <Text style={styles.text}>
            {textData.text}
          </Text>
          <View style={styles.tryAgainButton}>
            <Button
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={() => navigation.navigate('Camera')}
            >
              {textData.button}
            </Button>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: heightToDp('55%'),
  },
  backContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backArrow: {
    width: 16,
    height: 16,
    padding: 20,
  },
  title: {
    ...typography('xxxl', 'bold'),
    color: Platform.OS === 'ios' ? GREY_90 : 'rgba(0, 0, 0, 0.87)',
  },
  text: {
    ...typography('md', 'regular'),
    color: GREY_90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 34,
  },
  tryAgainButton: {
    width: widthToDp('90%'),
  },
  button: {
    backgroundColor: '#F00933',
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 14,
    marginBottom: 32,
  },
  buttonLabel: {
    letterSpacing: 0,
    ...typography('md', 'medium'),
    textTransform: 'none',
    color: '#FFF',
  },
});

const mapStateToProps = (state) => {
  const {webview} = state;
  return {webview};
};

export default connect(mapStateToProps)(CameraNotFoundScreen);
