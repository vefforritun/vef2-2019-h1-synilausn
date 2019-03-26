const express = require('express');
const catchErrors = require('../utils/catchErrors');
const { requireAuth, checkUserIsAdmin } = require('../authentication/auth');

const requireAdmin = [
  requireAuth,
  checkUserIsAdmin,
];

/*
const requireAdmin = (req, res, next) => next();
const requireAuth = (req, res, next) => next();
 */

const {
  listCategories,
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('./categories');

const {
  listUsers,
  listUser,
  updateUser,
  currentUser,
  updateCurrentUser,
} = require('./users');

const {
  listProducts,
  createProduct,
  listProduct,
  updateProduct,
  deleteProduct,
} = require('./products');

const {
  listCart,
  addToCart,
  listCartLine,
  updateCartLine,
  deleteCartLine,
} = require('./cart');

const {
  listOrders,
  createOrder,
  listOrder,
} = require('./orders');

const router = express.Router();

function indexRoute(req, res) {
  return res.json({
    users: {
      users: '/users',
      user: '/users/{id}',
      register: '/users/register',
      login: '/users/login',
      me: '/users/me',
    },
    products: {
      products: '/products?search={query}&category={name}',
      product: '/products/{id}',
    },
    categories: '/categories',
    cart: {
      cart: '/cart',
      line: '/cart/line/{id}',
    },
    orders: {
      orders: '/orders',
      order: '/orders/{id}',
    },
  });
}

router.get('/', indexRoute);

router.get('/users', requireAdmin, catchErrors(listUsers));
router.get('/users/:id', requireAdmin, catchErrors(listUser));
router.patch('/users/:id', requireAdmin, catchErrors(updateUser));
router.get('/users/me', requireAuth, catchErrors(currentUser));
router.patch('/users/me', requireAuth, catchErrors(updateCurrentUser));

router.get('/products', catchErrors(listProducts));
router.post('/products', requireAdmin, catchErrors(createProduct));
router.get('/products/:id', catchErrors(listProduct));
router.patch('/products/:id', requireAdmin, catchErrors(updateProduct));
router.delete('/products/:id', requireAdmin, catchErrors(deleteProduct));

router.get('/categories', catchErrors(listCategories));
router.post('/categories', requireAdmin, catchErrors(createCategory));
router.get('/categories/:id', catchErrors(listCategory));
router.patch('/categories/:id', requireAdmin, catchErrors(updateCategory));
router.delete('/categories/:id', requireAdmin, catchErrors(deleteCategory));

router.get('/cart', requireAuth, catchErrors(listCart));
router.post('/cart', requireAuth, catchErrors(addToCart));
router.get('/cart/line/:id', requireAuth, catchErrors(listCartLine));
router.patch('/cart/line/:id', requireAuth, catchErrors(updateCartLine));
router.delete('/cart/line/:id', requireAuth, catchErrors(deleteCartLine));

router.get('/orders', requireAuth, catchErrors(listOrders));
router.post('/orders', requireAuth, catchErrors(createOrder));
router.get('/orders/:id', requireAuth, catchErrors(listOrder));

module.exports = router;
