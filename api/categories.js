const xss = require('xss');

const { query, pagedQuery } = require('../utils/db');
const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
  toPositiveNumberOrDefault,
} = require('../utils/validation');
const addPageMetadata = require('../utils/addPageMetadata');

async function listCategories(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  const categories = await pagedQuery(
    'SELECT id, title FROM categories ORDER BY updated DESC',
    [],
    { offset, limit },
  );

  const categoriesWithPage = addPageMetadata(
    categories,
    req.path,
    { offset, limit, length: categories.items.length },
  );

  return res.json(categoriesWithPage);
}

async function getCategory(id) {
  if (!isInt(id)) {
    return null;
  }

  const category = await query(
    'SELECT id, title FROM categories WHERE id = $1',
    [id],
  );

  if (category.rows.length !== 1) {
    return null;
  }

  return category.rows[0];
}

async function listCategory(req, res) {
  const { id } = req.params;

  const category = await getCategory(id);

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.json(category);
}

async function validateCategory(title) {
  if (!isNotEmptyString(title, { min: 1, max: 256 })) {
    return [{
      field: 'title',
      error: lengthValidationError(title, 1, 256),
    }];
  }

  const cat = await query(
    'SELECT id FROM categories WHERE title = $1',
    [title],
  );

  if (cat.rows.length > 0) {
    const currentCat = cat.rows[0].id;
    const error = `Category already exists in category with id ${currentCat}.`;
    return [{ field: 'title', error }];
  }

  return [];
}

async function createCategory(req, res) {
  const { title } = req.body;

  const validations = await validateCategory(title);

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  const q = 'INSERT INTO categories (title) VALUES ($1) RETURNING id, title';
  const result = await query(q, [xss(title)]);

  return res.status(201).json(result.rows[0]);
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  const category = await getCategory(id);

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const validations = await validateCategory(title);

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  const q = `
    UPDATE
      categories
    SET title = $1, updated = current_timestamp
    WHERE id = $2
    RETURNING id, title`;
  const result = await query(q, [xss(title), id]);

  return res.status(201).json(result.rows[0]);
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  const category = await getCategory(id);

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Athuga hversu margar vörur eru í flokk
  const countQuery = 'SELECT COUNT(*) FROM products WHERE category_id = $1';
  const countResult = await query(countQuery, [id]);

  const { count } = countResult.rows[0];

  // Leyfum bara að eyða tómum flokkum
  if (toPositiveNumberOrDefault(count, 0) > 0) {
    return res.status(400).json({ error: 'Category is not empty' });
  }

  const q = 'DELETE FROM categories WHERE id = $1';
  await query(q, [id]);

  return res.status(204).json({});
}

module.exports = {
  listCategories,
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
