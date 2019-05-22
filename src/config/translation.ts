import {Storage} from '../shared/util/storage-util';
import {setLocale} from "../shared/reducers/locale";

export const languages: any = {
  en: { name: 'English', importance: 100 },
  ru: { name: 'Русский', importance: 90 }
};

export const locales = Object.keys(languages).sort();

export const registerLocale = store => {
  store.dispatch(setLocale(Storage.session.get('locale', 'en')));
};
