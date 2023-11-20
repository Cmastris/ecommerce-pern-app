CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email_address" varchar(100) UNIQUE NOT NULL,
  "hashed_pw" text,
  "auth_method" varchar(50) NOT NULL
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "address" varchar(300) NOT NULL,
  "postcode" varchar(8) NOT NULL,
  UNIQUE ("address", "postcode")
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "stock_count" integer NOT NULL,
  "available_stock_count" integer NOT NULL,
  "short_description" varchar(200),
  "long_description" text,
  "size" varchar(25),
  "avg_rating" decimal(3, 2),
  "rating_count" integer
);

CREATE TABLE "cart_products" (
  "user_id" integer,
  "product_id" integer,
  "quantity" smallint NOT NULL DEFAULT 1,
  PRIMARY KEY ("user_id", "product_id")
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "address_id" integer,
  "order_placed_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" varchar(100) NOT NULL,
  "total_cost" money NOT NULL
);

CREATE TABLE "order_products" (
  "order_id" integer,
  "product_id" integer,
  "product_quantity" smallint NOT NULL DEFAULT 1,
  PRIMARY KEY ("order_id", "product_id")
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "description" text,
  "url_slug" varchar(50)
);

CREATE TABLE "product_categories" (
  "product_id" integer,
  "category_id" integer,
  PRIMARY KEY ("product_id", "category_id")
);

ALTER TABLE "cart_products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "order_products" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_categories" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
