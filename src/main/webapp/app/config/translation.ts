import { setLocale } from 'app/shared/reducers/locale';
import { TranslatorContext } from 'app/shared/language';

import { Storage } from 'app/shared/util/storage-util';

TranslatorContext.setDefaultLocale('en');
TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const languages: any = {
  en: { name: 'English', importance: 100 },
  ru: { name: 'Русский', importance: 90 }
};

export const locales = Object.keys(languages).sort();

export const registerLocale = store => {
  store.dispatch(setLocale(Storage.session.get('locale', 'en')));
};
