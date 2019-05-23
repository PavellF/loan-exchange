import React from 'react';
import ReactDOM from 'react-dom';
import AppComponent from './app';
import AuthenticationContext from "./shared/contexts/authentication";
import NotificationContext from "./shared/contexts/notification";
import TranslationContext from "./shared/contexts/translation";

const rootEl = document.getElementById('root');

const render = Component =>
  ReactDOM.render(
    <AuthenticationContext>
      <NotificationContext>
        <TranslationContext>
          <div>
            <Component/>
          </div>
        </TranslationContext>
      </NotificationContext>
    </AuthenticationContext>,
    rootEl
  );

render(AppComponent);
