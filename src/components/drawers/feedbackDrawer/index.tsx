import React, {useEffect, useState} from 'react';
import {DrawerSection} from '@src/components/general/drawer/drawerSection';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {typography} from '@src/assets/style/typography.style';
import {Button, TextInput} from 'react-native-paper';
import {LikeIcon} from '@src/components/icons/like';
import {DislikeIcon} from '@src/components/icons/dislike';
import {BRAND_RED_50} from '@src/assets/style/variable.style';
import InAppReview from '@src/modules/InAppReview';
import {
  createBadReview,
  saveReviewStatus,
} from '@src/store/modules/review/ReviewActions';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from '@src/store/modules/review/ReviewReducer';
import {ReviewStatusType} from '@src/store/modules/review/ReviewTypes';
import {AppDispatch, RootState} from '@src/store';
import {CommonActions, useNavigation} from '@react-navigation/native';
import { setTab } from '@src/store/modules/webview/WebviewReducer';
import DrawerComponent from '@src/components/general/drawer/DrawerComponent';
/**
 * Всплывающее окно для оставления отзыва
 *
 * @category Drawer
 */
export default function FeedbackDrawer({route}) {
  const {review, user} = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const [type, setType] = useState('like');
  const [text, setText] = useState('');
  const handleSelect = (type) => {
    setType(type);
  };
  const getCurrentClass = () => {
    if (type === 'like') {
      return style.buttonLike;
    }
    if (type === 'dislike') {
      if (text.length >= 1) {
        return style.buttonDislike;
      }
    }
    return null;
  };
  const getButtonDisable = () => {
    if (type === 'like') {
      return false;
    }
    if (type === 'dislike') {
      if (text.length >= 1) {
        return false;
      }
    }
    return true;
  };
  const handleNext = async () => {
    if (type === 'like') {
      await InAppReview.RequestInAppReview();
      await dispatch(setStatus('fulfilled'));
      await dispatch(saveReviewStatus('success'));
    }
    if (type === 'dislike') {
      const token = user.token;
      await dispatch(createBadReview({comment: text, token: token}));
      await dispatch(setStatus('fulfilled'));
      await dispatch(saveReviewStatus('refused'));
    }
  };

  const handleClose = (type: ReviewStatusType) => {
    dispatch(saveReviewStatus(type));
    dispatch(setTab('MainPage'));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'MainPageScreen'}],
      }),
    );
  };
  useEffect(() => {
    dispatch(setTab('MainPage'));
  });

  return (
    <DrawerComponent
      title={
        review.status !== 'fulfilled'
          ? 'Оцените приложение'
          : 'Спасибо за обратную связь'
      }
      close={() => {
        if (review.reviewStatus === 'success') {
          handleClose('success');
        } else if (review.reviewStatus === 'refused') {
          handleClose('refused');
        } else {
          handleClose('wait');
        }
      }}
      margin={route.params.margin}
      content={
        review.status !== 'fulfilled' ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'android' ? null : 'position'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={style.feedbackSection}>
                <View style={style.container}>
                  <View style={style.wrapper}>
                    <TouchableOpacity
                      style={[style.imageWrapper, style.imageWrapperFirst]}
                      onPress={() => handleSelect('like')}>
                      <LikeIcon active={type === 'like'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.imageWrapper}
                      onPress={() => handleSelect('dislike')}>
                      <DislikeIcon active={type === 'dislike'} />
                    </TouchableOpacity>
                  </View>
                  {type === 'dislike' ? (
                    <TextInput
                      style={style.textInput}
                      label="Оставьте комментарий"
                      mode="outlined"
                      value={text}
                      multiline={true}
                      dense={true}
                      onChangeText={(value) => setText(value)}
                    />
                  ) : null}
                  <View>
                    <Button
                      style={[style.button, getCurrentClass()]}
                      color="#FFFFFF"
                      disabled={getButtonDisable()}
                      onPress={() => handleNext()}>
                      ОСТАВИТЬ ОТЗЫВ
                    </Button>
                    <Button
                      labelStyle={style.showButton}
                      onPress={() => handleClose('refused')}>
                      Больше не показывать
                    </Button>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        ) : (
          <View>
            <Text style={style.paragraph}>Ваше мнение важно для нас</Text>
            <Button
              style={[style.buttonSuccess]}
              color="#FFFFFF"
              onPress={() => handleClose('success')}>
              ЗАКРЫТЬ
            </Button>
          </View>
        )
      }
    />
  );
}

const style = StyleSheet.create({
  feedbackSection: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  paragraph: {
    ...typography('lg', 'regular'),
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  textInput: {
    ...typography('md', 'medium'),
    marginBottom: 28,
    backgroundColor: '#fff',
  },
  container: {
    marginTop: 35,
    width: '100%',
  },
  button: {
    ...typography('lg', 'bold'),
    backgroundColor: '#BFC9D2',
    borderRadius: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
  buttonLike: {
    backgroundColor: '#006AC7',
  },
  buttonSuccess: {
    ...typography('lg', 'bold'),
    backgroundColor: BRAND_RED_50,
    borderRadius: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
  buttonDislike: {
    backgroundColor: BRAND_RED_50,
  },
  showButton: {
    ...typography('xs'),
    marginTop: 18,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  imageWrapperFirst: {
    marginRight: 24,
  },
  imageWrapperActive: {
    backgroundColor: '#000',
  },
  wrapper: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
