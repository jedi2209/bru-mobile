const languages = ['en_US', 'de_US'];

export const hasTranslation = lang => {
  console.log(lang);
  return languages.some(item => {
    console.log(item, lang);
    if (item === lang) {
      return true;
    } else {
      return false;
    }
  });
};
