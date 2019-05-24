import React, {useState} from 'react';
import Russian from "../i18n/Russian";

export interface Language {
  name: string;
  locale: string;
  importance: number;
  load: () => Promise<any>;
}
/*
* Has to be sorted by importance.
* */
export const languages: ReadonlyArray<Language> = [
  { name: 'English', locale: 'en', importance: 100, load: () => import("../i18n/English") },
  { name: 'Русский', locale: 'ru', importance: 90, load: () => import("../i18n/Russian") }
];

const initialState = {
  loading: false,
  currentLanguage: 'ru',
  translation: Russian,
  setLanguage: (code: string) => {}
};

export const Translation = React.createContext(initialState);

const TranslationContext = (props) => {

  const [state, setState] = useState(initialState);

  const setLanguage = (code: string) => {

    if (code !== state.currentLanguage) {
      const lang = languages.find(l => l.locale === code);
      if (lang) {
        setState({...state, loading: true});
        lang.load().then(module => {
          setState({
            ...state,
            loading: false,
            currentLanguage: code,
            translation: module.default
          });
        }).catch(_ => setState({...state, loading: false}));
      }
    }
  };

  const context = {
    ...state,
    setLanguage
  };

  return (
    <Translation.Provider value={context}>
      {props.children}
    </Translation.Provider>
  );

};

export default TranslationContext;
