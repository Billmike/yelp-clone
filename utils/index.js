export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
};

export const convertToKM = (value) => {
  const valueInKM = (value / 1000).toFixed(1);
  return `${valueInKM} km`;
};
