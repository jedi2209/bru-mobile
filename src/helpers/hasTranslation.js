const languages = ['en_US', 'de_US'];

export const hasTranslation = lang => {
  return languages.some(item => item === lang);
};
