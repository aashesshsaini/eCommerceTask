import {I18n} from 'i18n';
import path from 'path';

const i18n = new I18n({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
  cookie: 'locale',
  directory: path.join(__dirname, 'locales'),
  directoryPermissions: '755',
  autoReload: true,
  updateFiles: true,
  objectNotation: true,
  api: {
    _: '_',
    __n: '__n',
  },
});

export default i18n;

