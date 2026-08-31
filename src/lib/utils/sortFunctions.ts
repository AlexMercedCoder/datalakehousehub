// sort by date, newest first
//
// The tiebreak matters more than it looks. Several posts share a date, and
// without one their order comes from whatever getCollection happens to return,
// which is not stable across a cold content cache. Anything that then slices
// the result, like the related posts block, silently shows a different three
// on every clean build. The id is the file path, so it is fixed by the content.
export const sortByDate = (array: any[]) => {
  return [...array].sort((a: any, b: any) => {
    const at = new Date(a.data.pubDatetime || a.data.date || 0).getTime();
    const bt = new Date(b.data.pubDatetime || b.data.date || 0).getTime();
    if (bt !== at) return bt - at;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
};

// sort product by weight
export const sortByWeight = (array: any[]) => {
  const withWeight = array.filter(
    (item: { data: { weight: any } }) => item.data.weight
  );
  const withoutWeight = array.filter(
    (item: { data: { weight: any } }) => !item.data.weight
  );
  const sortedWeightedArray = withWeight.sort(
    (a: { data: { weight: number } }, b: { data: { weight: number } }) =>
      a.data.weight - b.data.weight
  );
  const sortedArray = [...new Set([...sortedWeightedArray, ...withoutWeight])];
  return sortedArray;
};
