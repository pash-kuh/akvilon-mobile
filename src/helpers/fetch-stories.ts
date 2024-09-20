import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateAndSortStories} from './storiesUpdateSort';
import {api} from './request';

export const fetchStories = async () => {
  const fullUrl = 'https://api.akvilon.kz';
  const url = 'api.akvilon.kz/api/';
  const {
    data: {data},
  } = await api(url).get('story/');

  const stories = await Promise.all(
    data.map(async ({id}) => {
      const {
        data: {data: fullInfoStory},
      } = await api(url).get(`story/${id}/`);

      return {
        user_image: fullUrl + fullInfoStory.previewImage.mobile['2x'],
        seen: false,
        stories: fullInfoStory.slides.map((slide, i) => ({
          story_image: fullUrl + slide.image.mobile['2x'],
          swipeText: slide?.title,
          customProps: {
            id: fullInfoStory.id + i,
            secondText: slide?.text,
            textColor: slide?.textColor,
            button: slide?.button
              ? {
                  text: slide?.button?.text,
                  font: slide?.button?.color.font,
                  background: slide?.button?.color.background,
                  url: slide?.button?.url,
                }
              : null,
          },
        })),
      };
    }),
  );

  const lsStringSeenStories = await AsyncStorage.getItem('seenStories');
  const lsSeenStories = JSON.parse(lsStringSeenStories);

  if (lsSeenStories && lsSeenStories.length > 0) {
    return updateAndSortStories(stories, lsSeenStories);
  }
  return stories;
};
