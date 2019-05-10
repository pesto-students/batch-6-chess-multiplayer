/* eslint-disable import/prefer-default-export */
export const convertSecToMinSecStr = (sec) => {
  if (sec <= 0) {
    return '00:00';
  }
  const secInAMin = 60;
  let min = Math.floor(sec / secInAMin);
  let remainingSec = sec - min * secInAMin;
  // Pad 0 if required
  min = min < 10 ? `0${min}` : `${min}`;
  remainingSec = remainingSec < 10 ? `0${remainingSec}` : `${remainingSec}`;
  return `${min}:${remainingSec}`;
};
