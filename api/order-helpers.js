/**
 * Föll sem bæði cart og orders nota.
 */

const { query } = require('../utils/db');

async function getOrderLine(orderId, productId) {
  const q = `
    SELECT
      id, order_id, product_id, quantity, created, updated
    FROM
      orderLines
    WHERE
      order_id = $1 AND product_id = $2
    `;

  const result = await query(q, [orderId, productId]);

  if (result.rows.length !== 1) {
    return null;
  }

  return result.rows[0];
}

async function getOrderLines(orderId) {
  const q = `
    SELECT
      l.id AS id, l.quantity, l.created, l.updated,
      p.id AS product_id, p.title, p.price, p.description, p.image, p.created,
      p.category_id, c.title as category_title,
      l.quantity * p.price AS total
    FROM
      orderLines AS l
    LEFT JOIN
      products AS p ON p.id = l.product_id
    LEFT JOIN
      categories AS c ON c.id = p.category_id
    WHERE
      l.order_id = $1
    ORDER BY l.created
  `;

  const result = await query(q, [orderId]);

  return result.rows;
}

async function getCart(userId) {
  const q = `
    SELECT
      id, created, updated
    FROM
      orders
    WHERE
      user_id = $1 AND order_submitted = false
  `;

  const result = await query(q, [userId]);

  if (result.rows.length !== 1) {
    return null;
  }

  const cart = result.rows[0];
  cart.lines = await getOrderLines(cart.id);
  cart.total = cart.lines.reduce((sum, i) => sum + i.total, 0);

  return cart;
}

module.exports = {
  getCart,
  getOrderLine,
  getOrderLines,
};
