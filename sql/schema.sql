CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  image VARCHAR(256) DEFAULT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  category_id INTEGER REFERENCES categories(id) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(256) NOT NULL UNIQUE,
  email VARCHAR(256) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  admin BOOLEAN DEFAULT false,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256),
  address VARCHAR(256),
  order_created TIMESTAMP WITH TIME ZONE,
  order_submitted BOOLEAN DEFAULT false, -- order er frátekið orð
  user_id INTEGER REFERENCES users(id) NOT NULL, -- user er frátekið orð
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
  -- Væri hægt að bæta við frekari constraints til að passa upp á að aðeins sé
  -- til að hámarki ein pöntun með (user_id, false) í einu, þ.e.a.s. ein karfa
);

CREATE TABLE orderLines (
  id SERIAL PRIMARY KEY,
  quantity INTEGER CHECK (quantity > 0),
  product_id INTEGER REFERENCES products(id) NOT NULL,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  UNIQUE(product_id, order_id) -- sama vara ekki oft í sömu körfu/pöntun
);
