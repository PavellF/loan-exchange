import React, {useContext} from 'react';
import {languages, Translation} from "../../contexts/translation";

const LocaleMenu = ({maxInline = 0}) => {

  const translation = useContext(Translation);

  if (languages.length < 2) return null;

  const cropped = languages.slice(0, maxInline);
  let modal;

  if (languages.length > maxInline) {
    modal = (
      <a onClick={() => {}}>
        {translation.translation.LocaleMenu.allLanguages}
      </a>
    );
  }

  return (
    <div>
      {translation.translation.LocaleMenu.language + ': '}
      {cropped.map(locale => (
        <a key={locale.locale} onClick={() => translation.setLanguage(locale.locale)}>{`${locale.name} `}</a>
      ))}
      {modal}
    </div>
  );

};

export default LocaleMenu;
