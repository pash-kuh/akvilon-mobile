export const updateAndSortStories = (stories, ids) => {
  const updatedStories = stories.map((story) => {
    const isStorySeen = story.stories.every(({customProps}) =>
      ids.includes(customProps.id),
    );
    return isStorySeen ? {...story, seen: true} : story;
  });
  const sortedStories = updatedStories.sort(
    (a, b) => Number(a.seen) - Number(b.seen),
  );
  return sortedStories;
};
