import CookieManager from '@react-native-cookies/cookies';

export type cookieType =
  | 'isMobile'
  | 'token'
  | 'pickedCity'
  | 'mobileOS'
  | 'versionOS'
  | 'favoritesArray'
  | 'mobileVersionNumber'
  | 'searchCookie';

export const setCookie = async (
  domain: string,
  {name, value}: {name: cookieType; value: string},
) => {
  await CookieManager.set(`https://${domain}/`, {
    name,
    value,
    domain,
    path: '/',
    version: '1',
    expires: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1000),
    ).toISOString(),
  });
};

export const getCookie = async (domain: string) => {
  const {digi_uc} = await CookieManager.get(`https://${domain}/`);
  return digi_uc;
};

export const getFavsCookie = async (domain: string) => {
  const {favoritesArray} = await CookieManager.get(`https://${domain}/`);
  return favoritesArray;
};

export const getSearchCookie = async (domain: string) => {
  const {searchCookie} = await CookieManager.get(`https://${domain}/`);
  return searchCookie;
};
