import React, {useContext} from 'react';
import {languages, Translation} from "../../contexts/translation";
import {Button} from 'antd';

const LocaleMenu = ({maxInline = 0}) => {

  const translation = useContext(Translation);

  if (languages.length < 2) return null;

  const cropped = languages.slice(0, maxInline);
  let modal;

  if (languages.length > maxInline) {
    modal = (
      <Button type="link" onClick={() => {}}>
        {translation.translation.LocaleMenu.allLanguages}
      </Button>
    );
  }

  return (
    <div>
      {translation.translation.LocaleMenu.language + ': '}
      {cropped.map(locale => (
        <Button style={{padding: 3}} type="link" key={locale.locale} onClick={() => translation.setLanguage(locale.locale)}>{`${locale.name} `}</Button>
      ))}
      {modal}
    </div>
  );

};

export default LocaleMenu;
