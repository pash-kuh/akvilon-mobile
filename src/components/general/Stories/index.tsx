import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchStories} from '@src/helpers/fetch-stories';
import {updateAndSortStories} from '@src/helpers/storiesUpdateSort';
import {RootState} from '@src/store';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import InstaStory from 'react-native-insta-story';
import {Button, Text, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {CloseStoryBtn} from '@src/components/icons/close-story-btn';
import {setStories} from '@src/store/modules/stories/StoriesReducer';

function Stories() {
  const {url} = useSelector((s: RootState) => s.config);
  const [loading, setLoading] = useState(false);
  const [seenStories, setSeenStories] = useState(new Set());
  const dispatch = useDispatch();
  const {stories} = useSelector((s) => s);

  useEffect(() => {
    if (stories.length === 0) {
      setLoading(true);
      fetchStories()
        .then((s) => dispatch(setStories(s)))
        .catch((e) => alert(e));
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={style.instaStoryLoading}>
        <ActivityIndicator animating color="red" />
      </View>
    );
  }

  const updateSeenStories = (story_id) => {
    setSeenStories((prevSet) => {
      prevSet.add(story_id);
      return prevSet;
    });
  };

  const handleSeenStories = async () => {
    setLoading(true);
    const lsStringSeenStories = await AsyncStorage.getItem('seenStories');
    const lsSeenStories = JSON.parse(lsStringSeenStories);
    const storyIds = lsSeenStories ?? [];
    seenStories.forEach((storyId) => {
      if (storyId && !storyIds.includes(storyId)) {
        storyIds.push(storyId);
      }
    });
    await AsyncStorage.setItem('seenStories', JSON.stringify(storyIds));
    const sortedAndUpdatedStories = updateAndSortStories(stories, storyIds);
    dispatch(setStories(sortedAndUpdatedStories));
    setLoading(false);
  };

  return (
    <InstaStory
      style={
        stories.length
          ? style.instaStoryStyles
          : {backgroundColor: '#fff', paddingBottom: 18}
      }
      data={stories}
      showAvatarText={false}
      avatarImageStyle={style.avatarImageStyles}
      avatarWrapperStyle={style.avatarWrapperStyle}
      storyAvatarImageStyle={style.storyAvatarImageStyle}
      storyUserContainerStyle={style.storyUserContainerStyle}
      pressedBorderColor="#fff"
      onClose={handleSeenStories}
      onStorySeen={async ({story}) => updateSeenStories(story.customProps.id)}
      renderSwipeUpComponent={({item}) => (
        <View style={style.swipeTextContainer}>
          <Text style={[style.swipeText, {color: item.customProps?.textColor}]}>
            {item.swipeText}
          </Text>
          <Text
            style={[style.secondText, {color: item.customProps?.textColor}]}>
            {item.customProps?.secondText}
          </Text>
          {item.customProps?.button ? (
            <Button
              style={[
                style.storyBuyButton,
                {backgroundColor: item.customProps?.button?.background},
              ]}
              uppercase={false}
              onPress={() =>
                Linking.openURL(
                  `https://${url}${item.customProps?.button?.url}`,
                )
              }>
              <Text
                style={[
                  style.storyBuyBtnText,
                  {color: item.customProps?.button?.font},
                ]}>
                {item.customProps?.button?.text}
              </Text>
            </Button>
          ) : null}
        </View>
      )}
      renderCloseComponent={({onPress}) => (
        <View style={style.closeButtonWrapper}>
          <CloseStoryBtn onPress={onPress} />
        </View>
      )}
      duration={10}
    />
  );
}

export default React.memo(Stories);

const style = StyleSheet.create({
  instaStoryStyles: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  instaStoryLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    height: 154,
    backgroundColor: '#fff',
  },
  avatarImageStyles: {
    height: 148,
    width: 132,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarWrapperStyle: {
    height: 152,
    width: 136,
    borderRadius: 17,
  },
  closeButtonWrapper: {
    position: 'relative',
    right: -30,
    top: 5,
    zIndex: 1,
  },
  swipeTextContainer: {
    paddingBottom: 60,
    paddingLeft: 30,
    paddingRight: 30,
  },
  swipeText: {
    justifyContent: 'flex-start',
    fontSize: 30,
  },
  secondText: {
    paddingTop: 5,
    paddingBottom: 30,
    fontSize: 17,
  },
  storyAvatarImageStyle: {
    opacity: 0,
  },
  storyUserContainerStyle: {
    height: 0,
  },
  storyBuyButton: {
    padding: 5,
    borderRadius: 7,
  },
  storyBuyBtnText: {
    fontSize: 15,
  },
});
