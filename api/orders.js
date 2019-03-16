const xss = require('xss');
const { getCart, getOrderLines } = require('./order-helpers');
const { query, pagedQuery } = require('../utils/db');
const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
} = require('../utils/validation');
const addPageMetadata = require('../utils/addPageMetadata');

/* helpers */

async function getOrder(id, userId = null) {
  if (!isInt(id)) {
    return null;
  }

  const hasUser = userId && isInt(userId);
  const user = hasUser ? 'AND user_id = $2' : '';

  const q = `
    SELECT
      id, name, address, order_created AS created, user_id, created, updated
    FROM
      orders
    WHERE
      order_submitted = true
      AND
      id = $1
      ${user}
  `;

  const result = await query(
    q,
    [id, hasUser ? userId : null].filter(Boolean),
  );

  if (result.rows.length !== 1) {
    return null;
  }

  const order = result.rows[0];
  order.lines = await getOrderLines(order.id);
  order.total = order.lines.reduce((sum, i) => sum + i.total, 0);

  return order;
}

async function validateOrder(name, address, cart) {
  const validation = [];

  if (!isNotEmptyString(name, { min: 1, max: 256 })) {
    validation.push({
      field: 'name',
      error: lengthValidationError(name, 1, 256),
    });
  }

  if (!isNotEmptyString(address, { min: 1, max: 256 })) {
    validation.push({
      field: 'address',
      error: lengthValidationError(address, 1, 256),
    });
  }

  if (!cart) {
    validation.push({
      field: 'cart',
      error: 'Cart does not exist',
    });
  } else if (cart.lines.length === 0) {
    validation.push({
      field: 'cart',
      error: 'Cart does not have any lines',
    });
  }

  return validation;
}

/* api */

async function listOrders(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  const { user } = req;

  const filterUser = !user.admin ? 'AND user_id = $1' : '';

  const q = `
    SELECT
      id, name, address, order_created AS created, user_id, created, updated
    FROM
      orders
    WHERE
      order_submitted = true
      ${filterUser}
    ORDER BY updated DESC
  `;

  const orders = await pagedQuery(
    q,
    [!user.admin ? user.id : null].filter(Boolean),
    { offset, limit },
  );

  const ordersWithPage = addPageMetadata(
    orders,
    req.path,
    { offset, limit, length: orders.items.length },
  );

  return res.json(ordersWithPage);
}

async function createOrder(req, res) {
  const { user } = req;
  const { name, address } = req.body;

  const cart = await getCart(user.id);

  const validations = await validateOrder(name, address, cart);

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  const q = `
    UPDATE
      orders
    SET
      name = $1,
      address = $2,
      order_submitted = true,
      updated = current_timestamp
    WHERE id = $3
  `;

  await query(q, [xss(name), xss(address), cart.id]);

  const order = await getOrder(cart.id);

  return res.status(201).json(order);
}

async function listOrder(req, res) {
  const { id } = req.params;
  const { user } = req;

  // admin má skoða allar pantanir
  const userIdIfNotAdmin = user.admin ? null : user.id;

  const order = await getOrder(id, userIdIfNotAdmin);

  if (!order) {
    // TODO skila 403 fobidden ef order til en ekki admin?
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json(order);
}

module.exports = {
  listOrders,
  createOrder,
  listOrder,
};
