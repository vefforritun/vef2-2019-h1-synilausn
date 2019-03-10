CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  image VARCHAR(256) DEFAULT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(256) NOT NULL UNIQUE,
  email VARCHAR(256) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  admin BOOLEAN DEFAULT false
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256),
  address VARCHAR(256),
  order_created TIMESTAMP WITH TIME ZONE,
  order_submitted BOOLEAN DEFAULT false, -- order er frátekið orð
  user_id INTEGER REFERENCES users(id) -- user er frátekið orð
);

CREATE TABLE orderLines (
  id SERIAL PRIMARY KEY,
  quantity INTEGER CHECK (quantity > 0),
  product_id INTEGER REFERENCES products(id),
  order_id INTEGER REFERENCES orders(id)
);
