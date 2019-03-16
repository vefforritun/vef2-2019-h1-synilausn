const { getProduct } = require('./products');
const { getCart, getOrderLine } = require('./order-helpers');
const { toPositiveNumberOrDefault } = require('../utils/validation');
const { query } = require('../utils/db');

/* helpers */

async function createOrReturnCurrentCart(userId) {
  const currentCart = await getCart(userId);

  if (currentCart) {
    return currentCart;
  }

  const q = `
    INSERT INTO orders (user_id)
    VALUES ($1)
    RETURNING id, created, updated
  `;

  const result = await query(q, [userId]);

  const cart = result.rows[0];
  cart.lines = []; // ný karfa hefur engar línur
  cart.total = 0;

  return cart;
}

async function updateCartLine(cartId, productId, quantity) {
  const q = `
    UPDATE
      orderLines
    SET quantity = $3, updated = current_timestamp
    WHERE
      order_id = $1 AND product_id = $2
    `;

  const result = await query(q, [cartId, productId, quantity]);

  return result.rowCount === 1;
}

async function updateCartLineById(cartLineId, quantity) {
  const q = `
    UPDATE
      orderLines
    SET quantity = $2, updated = current_timestamp
    WHERE
      id = $1
    `;

  const result = await query(q, [cartLineId, quantity]);

  return result.rowCount === 1;
}

async function addProductToCart(cartId, productId, quantity = 1) {
  const cartLine = await getOrderLine(cartId, productId);

  if (cartLine) {
    return updateCartLine(cartId, productId, quantity);
  }

  const q = `
    INSERT INTO
      orderLines (order_id, product_id, quantity)
    VALUES
      ($1, $2, $3)
    `;

  const result = await query(q, [cartId, productId, quantity]);

  return result.rowCount === 1;
}

async function getCartLineForUser(userId, lineId) {
  const currentCart = await getCart(userId);

  if (!currentCart) {
    return null;
  }

  return currentCart.lines.find(i => i.id === lineId);
}

/* api */

async function listCart(req, res) {
  const { user } = req;

  const cart = await getCart(user.id);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  return res.status(200).json(cart);
}

async function addToCart(req, res) {
  const { user } = req;
  const { product: productId, quantity } = req.body;

  const product = await getProduct(productId);

  const validations = [];

  if (!product) {
    validations.push({
      field: 'product',
      error: 'Product does not exist',
    });
  }

  if (toPositiveNumberOrDefault(quantity, 0) <= 0) {
    validations.push({
      field: 'quantity',
      error: 'Quantity must be a positive integer',
    });
  }

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  const cart = await createOrReturnCurrentCart(user.id);

  await addProductToCart(cart.id, product.id, quantity);

  // í staðinn fyrir að bæta við lines, uppfærum alla körfu
  const updatedCart = await getCart(user.id);

  return res.status(201).json(updatedCart);
}

async function listCartLine(req, res) {
  const { user } = req;
  const { id } = req.params;

  const line = await getCartLineForUser(user.id, Number(id));

  if (!line) {
    return res.status(404).json({ error: 'Cart line not found' });
  }

  return res.status(200).json(line);
}

async function updateCartLineRoute(req, res) {
  const { user } = req;
  const { id } = req.params;
  const { quantity } = req.body;

  const line = await getCartLineForUser(user.id, Number(id));

  if (!line) {
    return res.status(404).json({ error: 'Cart line not found' });
  }

  if (toPositiveNumberOrDefault(quantity, 0) <= 0) {
    return res.status(401).json({
      errors: [{
        field: 'quantity',
        error: 'Quantity must be a positive integer',
      }],
    });
  }

  await updateCartLineById(line.id, quantity);

  const updatedLine = await getCartLineForUser(user.id, Number(id));

  return res.status(200).json(updatedLine);
}

async function deleteCartLine(req, res) {
  const { user } = req;
  const { id } = req.params;

  const line = await getCartLineForUser(user.id, Number(id));

  if (!line) {
    return res.status(404).json({ error: 'Cart line not found' });
  }

  const q = 'DELETE FROM orderLines WHERE id = $1';
  await query(q, [id]);

  return res.status(204).json({});
}

module.exports = {
  getCart,
  listCart,
  addToCart,
  listCartLine,
  updateCartLine: updateCartLineRoute,
  deleteCartLine,
};
