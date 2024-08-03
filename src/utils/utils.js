export function isValidNumber(str) {
  const num = Number(str);

  if (!isNaN(num)) {
    return true;
  } else {
    return false;
  }
}
