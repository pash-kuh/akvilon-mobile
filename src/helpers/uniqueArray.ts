export default (array: string[]) => {
  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  return array.filter(onlyUnique) as string[];
};
