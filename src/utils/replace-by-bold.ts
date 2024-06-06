export const replaceByBold = (message: string, wordsToBold: string[]) => {
  const words = message.split(/\s+/);

  const toLowerCaseWordsToBold = wordsToBold.map((word) => word.toLowerCase());

  const newText = words
    .map((word) => {
      if (
        toLowerCaseWordsToBold.includes(
          word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase(),
        )
      ) {
        return `<b>${word}</b>`;
      } else {
        return word;
      }
    })
    .join(' ');

  return newText;
};
