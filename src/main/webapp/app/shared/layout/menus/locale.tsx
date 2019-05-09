import React from 'react';
import { locales, languages } from 'app/config/translation';
import { Select } from 'antd';
import { Translate } from 'react-jhipster';

export const LocaleMenu = ({ currentLocale, onChange, maxInline = 0 }) => {
  if (Object.keys(languages).length < 2) return;

  if (maxInline) {
    const byImportance = Object.entries(languages)
      .map(entry => ({
        locale: entry[0],
        ...entry[1]
      }))
      .sort((a, b) => b.importance - a.importance);
    const cropped = byImportance.slice(0, maxInline);
    let modal = null;

    if (locales.length > maxInline) {
      modal = (
        <a onClick={null}>
          <Translate contentKey="global.menu.allLanguages">allLanguages</Translate>
        </a>
      );
    }

    return (
      <div>
        <Translate contentKey="global.menu.language">language</Translate>
        {': '}
        {cropped.map(locale => (
          <a key={locale.locale} onClick={onChange.bind(this, locale.locale)}>{`${locale.name} `}</a>
        ))}
        {modal}
      </div>
    );
  } else {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={currentLocale ? languages[currentLocale].name : undefined}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {locales.map(locale => (
          <Select.Option key={locale} value={locale}>
            {languages[locale].name}
          </Select.Option>
        ))}
      </Select>
    );
  }
};
