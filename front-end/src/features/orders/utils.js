export function getDateTimeString(rawString) {
  return new Date(rawString).toLocaleString("en-GB");
}
