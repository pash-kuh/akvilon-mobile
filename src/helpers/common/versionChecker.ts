export default function checkVersion(currentVersion, userVersion) {
  const currentVersionArr = currentVersion.split('.').map(Number);
  const userVersionArr = userVersion.split('.').map(Number);
  const length = Math.max(currentVersionArr.length, userVersionArr.length);

  for (let i = 0; i < length; i++) {
    const currentVersionPart = currentVersionArr[i] || 0;
    const userVersionPart = userVersionArr[i] || 0;
    if (currentVersionPart > userVersionPart) {
      return false;
    } else if (currentVersionPart < userVersionPart) {
      return true;
    } else if (i === 2 && currentVersionPart === userVersionPart) {
      return true;
    }
  }
}
