const bcrypt = require('bcrypt');
const xss = require('xss');

const badPasswords = require('./bad-passwords');

const { isInt, isEmpty, isNotEmptyString } = require('../utils/validation');
const { query, conditionalUpdate } = require('../utils/db');

const BCRYPT_ROUNDS = 11;

async function findByUsername(username) {
  const q = `
    SELECT
      id, username, password, email, admin
    FROM
      users
    WHERE username = $1`;

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findByEmail(email) {
  const q = `
    SELECT
      id, username, password, email, admin
    FROM
      users
    WHERE email = $1`;

  const result = await query(q, [email]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function validateUser({ username, password, email }, patch = false) {
  const validations = [];

  // can't patch username
  if (!patch) {
    if (!isNotEmptyString(username, { min: 3, max: 32 })) {
      const length = username && username.length ?
        username.length : 'undefined';

      const error = 'Must be non empty string at least 3 characters, ' +
                    'at most 32 characters. ' +
                    `Current length is ${length}.`;
      validations.push({ field: 'username', error });
    }

    const user = await findByUsername(username);

    if (user) {
      validations.push({
        field: 'username',
        error: 'Username exists',
      });
    }
  }

  if (!patch || password || isEmpty(password)) {
    if (badPasswords.indexOf(password) >= 0) {
      validations.push({
        field: 'password',
        error: 'Password is too bad',
      });
    }

    if (!isNotEmptyString(password, { min: 8 })) {
      const length = password && password.length ?
        password.length : 'undefined';
      const error = 'Must be non empty string at least 3 characters, ' +
                    'at most 32 characters. ' +
                    `Current length is ${length}.`;
      validations.push({ field: 'password', error });
    }
  }

  if (!patch || email || isEmpty(email)) {
    if (!isNotEmptyString(email, { max: 64 })) {
      const length = email && email.length ?
        email.length : 'undefined';
      const error = 'Must be non empty string at most 256 characters. ' +
                    `Current length is ${length}.`;
      validations.push({ field: 'email', error });
    }

    const user = await findByEmail(email);

    if (user) {
      validations.push({
        field: 'email',
        error: 'Email exists',
      });
    }
  }

  return validations;
}

async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

async function findById(id) {
  if (!isInt(id)) {
    return null;
  }

  const q = 'SELECT id, email, admin FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(username, email, password, admin = false) {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const q = `
    INSERT INTO
      users (username, email, password, admin)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *`;

  const result = await query(
    q,
    [xss(username), xss(email), hashedPassword, admin],
  );

  return result.rows[0];
}

async function updateUser(id, password, email) {
  if (!isInt(id)) {
    return null;
  }

  const isset = f => typeof f === 'string' || typeof f === 'number';

  const fields = [
    isset(password) ? 'password' : null,
    isset(email) ? 'email' : null,
  ];

  let hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  const values = [
    hashedPassword,
    isset(email) ? xss(email) : null,
  ];

  const result = await conditionalUpdate('users', id, fields, values);

  if (!result) {
    return null;
  }

  return result.rows[0];
}

module.exports = {
  validateUser,
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  updateUser,
};
