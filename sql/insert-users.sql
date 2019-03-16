-- Bæta við tilbúnum notendum
INSERT INTO
  users
    (id, username, email, password, admin)
  VALUES
    (1, 'admin', 'admin@example.org', '$2b$11$S/0nSIFH6oLalwYB/6XW4u9IIP.IN5oug/K3b.ZF7F4NL1cWyw8R6', true);

INSERT INTO
  users
    (id, username, email, password, admin)
  VALUES
    (2, 'oli', 'osk@hi.is', '$2b$11$pzXL.B8mMVOEAaGrtNa.KObIhJnpC6VBYsbNzF6F93TIUE/J2WLJ2', false);
