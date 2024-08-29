export const convertToSeconds = (time) => {
  const [hours, minutes] = time.split(":");
  return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
};

export const formatTimeForDisplay = (seconds) => {
  const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);
  return formattedTime;
};
