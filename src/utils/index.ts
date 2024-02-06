import { UserInfo } from "../api/scheduleList";

export function setUserInfo(userInfo: UserInfo) {
  try {
    localStorage.setItem("user", JSON.stringify(userInfo));
  } catch (err) {
    console.error(err);
  }
}

export function getUserInfo() {
  try {
    const info = localStorage.getItem("user");
    if (!info) {
      return "";
    } else {
      return JSON.parse(info);
    }
  } catch (err) {
    console.error(err);
  }
}

const LANG_KEY = 'lang';

export function setLanguage(lang: string) {
	localStorage.setItem(LANG_KEY, lang);
}

export function getLanguage() {
	return localStorage.getItem(LANG_KEY) || 'chs';
}