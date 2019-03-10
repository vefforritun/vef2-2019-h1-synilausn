function isEmpty(s) {
  return s != null && !s;
}

function isInt(i) {
  return Number.isInteger(Number(i));
}

function isNotEmptyString(s, { min = undefined, max = undefined } = {}) {
  if (typeof s !== 'string' || s.length === 0) {
    return false;
  }

  if (max && s.length > max) {
    return false;
  }

  if (min && s.length < min) {
    return false;
  }

  return true;
}

function toPositiveNumberOrDefault(value, defaultValue) {
  const cast = Number(value);
  const clean = Number.isInteger(cast) && cast > 0 ? cast : defaultValue;

  return clean;
}

module.exports = {
  isEmpty,
  isInt,
  isNotEmptyString,
  toPositiveNumberOrDefault,
};
