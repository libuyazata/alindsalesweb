// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  //basePath : 'http://97.74.85.211:8080/',
  //serverUrl: 'http://97.74.85.211:8080/',
  basePath : 'http://97.74.85.211:8080/dev-alindsales/',
  serverUrl: 'http://97.74.85.211:8080/dev-alindsales/',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ]
};
