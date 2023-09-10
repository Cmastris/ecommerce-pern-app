-- Add categories
INSERT INTO categories(name, description, url_slug)
VALUES
  ('Entertainment', 'Books, movies, music, and more.', 'entertainment'),
  ('Books', 'A selection of page-turners from a range of genres.', 'books'),
  ('Movies', 'A variety of top-rated movies to lose yourself in.', 'movies');


-- Add 'To Kill a Mockingbird' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      'To Kill a Mockingbird',
      8.99,
      25,
      25,
      'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. By Harper Lee.',
      'Compassionate, dramatic, and deeply moving, this novel takes readers to the roots of human behaviour - to innocence and experience, kindness and cruelty, love and hatred, humour and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal and is regarded as a masterpiece of American literature.',
      4.26,
      25
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 2);


-- Add '1984' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      '1984',
      7.99,
      3,
      3,
      'The year 1984 has come and gone, but this prophetic, nightmarish vision in 1949 of the world we were becoming is timelier than ever. By George Orwell.',
      '1984 is still the great modern classic of negative utopia — a startlingly original and haunting novel that creates an imaginary world that is completely convincing, from the first sentence to the last four words.',
      4.19,
      55
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 2);


-- Add 'The Lord of the Rings' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      'The Lord of the Rings',
      9.99,
      1,
      1,
      'One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.',
      'When Bilbo reached his eleventy-first birthday he disappeared, bequeathing to his young cousin Frodo the Ruling Ring and a perilous quest: to journey across Middle-earth, deep into the shadow of the Dark Lord, and destroy the Ring by casting it into the Cracks of Doom.',
      4.52,
      99
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 2);


-- Add 'The Shawshank Redemption' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      'The Shawshank Redemption',
      6.99,
      8,
      8,
      'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
      'This movie starring Tim Robbins and Morgan Freeman chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit.',
      4.65,
      80
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 3);


-- Add 'The Godfather' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      'The Godfather',
      7.99,
      3,
      3,
      'The head of a mafia family decides to hand over his empire to his youngest son. However, his decision puts the lives of his loved ones in grave danger.',
      'This movie starring Marlon Brando and Al Pacino is an epic crime drama that chronicles the transformation of Michael Corleone (Pacino) from reluctant family outsider to ruthless mafia boss.',
      4.60,
      80
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 3);


-- Add 'The Dark Knight' product & categories
WITH product_row AS (
  INSERT INTO
    products(
      name,
      price,
      stock_count,
      available_stock_count, 
      short_description,
      long_description,
      avg_rating,
      rating_count
    )
  VALUES 
    (
      'The Dark Knight',
      8.99,
      20,
      20,
      'When The Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.',
      'This movie starring Christian Bale and Heath Ledger has been widely assessed as one of the best superhero movies ever made, thanks to some outstanding performances, gritty realism, and thrilling action sequences.',
      4.55,
      90
    )
  RETURNING id
)
INSERT INTO product_categories(product_id, category_id)
VALUES
  ((SELECT id FROM product_row), 1),
  ((SELECT id FROM product_row), 3);