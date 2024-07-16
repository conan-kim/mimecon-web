export const convertStringToNum = (_string) => {
  return (
    _string.split(":")[0] * 3600 +
    _string.split(":")[1] * 60 +
    _string.split(":")[2] * 1
  );
};
