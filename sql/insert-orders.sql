-- Bæta við pöntunum og körfu fyrir notendur
INSERT INTO
  orders
    (id, user_id, name, address, order_created, order_submitted)
  VALUES
    (1, 2, 'Óli skóli', 'Háskóli Íslands', current_timestamp, true);

INSERT INTO orderLines (quantity, product_id, order_id) VALUES (3, 10, 1);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (1, 43, 1);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (2, 20, 1);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (1, 50, 1);

INSERT INTO
  orders
    (id, user_id, name, address, order_created, order_submitted)
  VALUES
    (2, 2, 'Óli', 'Askja', current_timestamp, true);

INSERT INTO orderLines (quantity, product_id, order_id) VALUES (1, 4, 2);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (13, 30, 2);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (2, 18, 2);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (3, 73, 2);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (1, 98, 2);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (5, 20, 2);

INSERT INTO
  orders
    (id, user_id, order_submitted)
  VALUES
    (3, 2, false);

INSERT INTO orderLines (quantity, product_id, order_id) VALUES (2, 39, 3);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (1, 98, 3);

INSERT INTO
  orders
    (id, user_id, name, address, order_created, order_submitted)
  VALUES
    (4, 1, 'Mr. Admin', '?', current_timestamp, true);

INSERT INTO orderLines (quantity, product_id, order_id) VALUES (30, 29, 4);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (100, 85, 4);
INSERT INTO orderLines (quantity, product_id, order_id) VALUES (2, 35, 4);
