export const kzTimeChecker = (hours: string, minutes: string) => {
  const kzHours = +hours;
  const kzMinutes = +minutes;

  if ((kzHours === 19 && kzMinutes > 50) || kzHours > 19 || kzHours < 8) {
    return false;
  } else {
    return true;
  }
};
