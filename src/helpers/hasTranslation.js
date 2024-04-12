export const languages = ['en', 'fr', 'de', 'es', 'it'];

export const hasTranslation = lang => {
  return languages.some(item => item === lang);
};
