const languages = ['en', 'de'];

export const hasTranslation = lang => {
  return languages.some(item => item === lang);
};
