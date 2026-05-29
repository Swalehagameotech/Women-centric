const NAME_WORD_REGEX = /^[a-zA-Z]+$/;

export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }

  const trimmed = name.trim().replace(/\s+/g, ' ');
  const words = trimmed.split(' ').filter(Boolean);

  if (words.length < 1 || words.length > 3) {
    return 'Name must be 1 to 3 words only';
  }

  for (const word of words) {
    if (word.length < 3) {
      return 'Each word must have at least 3 letters';
    }

    if (word.length > 30) {
      return 'Each word can have at most 30 letters';
    }

    if (!NAME_WORD_REGEX.test(word)) {
      return 'Name can only contain letters (no numbers or symbols)';
    }
  }

  return null;
};

export const formatName = (name) =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
