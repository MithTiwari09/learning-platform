/**
 * The bookshop practice database used throughout SQL from Zero.
 * International by design: prices in US dollars, authors and customers worldwide.
 */
export const BOOKSHOP_SEED = `
CREATE TABLE authors(id INTEGER PRIMARY KEY, name TEXT NOT NULL, country TEXT);
INSERT INTO authors VALUES
(1,'Ruskin Bond','India'),(2,'Chimamanda Ngozi Adichie','Nigeria'),(3,'Haruki Murakami','Japan'),
(4,'Terry Pratchett','UK'),(5,'Arundhati Roy','India'),(6,'Agatha Christie','UK'),
(7,'Yuval Noah Harari','Israel'),(8,'Ursula K. Le Guin','USA'),(9,'R. K. Narayan','India'),(10,'Gabriel García Márquez','Colombia');

CREATE TABLE books(id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id), genre TEXT, price REAL, published_year INTEGER, stock INTEGER);
INSERT INTO books VALUES
(1,'The Blue Umbrella',1,'Children',7.99,1980,42),
(2,'Rusty Runs Away',1,'Children',8.99,2002,15),
(3,'Half of a Yellow Sun',2,'Fiction',14.99,2006,8),
(4,'Americanah',2,'Fiction',16.99,2013,0),
(5,'Norwegian Wood',3,'Fiction',12.99,1987,21),
(6,'Kafka on the Shore',3,'Fiction',13.99,2002,12),
(7,'Guards! Guards!',4,'Fantasy',11.99,1989,30),
(8,'Small Gods',4,'Fantasy',12.49,1992,0),
(9,'The God of Small Things',5,'Fiction',13.49,1997,17),
(10,'Murder on the Orient Express',6,'Mystery',9.99,1934,25),
(11,'And Then There Were None',6,'Mystery',9.99,1939,33),
(12,'Sapiens',7,'Non-fiction',18.99,2011,40),
(13,'21 Lessons for the 21st Century',7,'Non-fiction',14.99,2018,9),
(14,'A Wizard of Earthsea',8,'Fantasy',10.99,1968,14),
(15,'The Left Hand of Darkness',8,'Science fiction',12.99,1969,6),
(16,'Malgudi Days',9,'Fiction',8.49,1943,27),
(17,'Swami and Friends',9,'Children',7.99,1935,19),
(18,'One Hundred Years of Solitude',10,'Fiction',15.99,1967,11),
(19,'The Dispossessed',8,'Science fiction',13.99,1974,0),
(20,'The Room on the Roof',1,'Fiction',9.49,1956,13);

CREATE TABLE customers(id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, country TEXT, joined_on TEXT);
INSERT INTO customers VALUES
(1,'Emma Johnson','London','UK','2025-01-14'),(2,'Lucas Silva','São Paulo','Brazil','2025-02-03'),
(3,'Aanya Sharma','Mumbai','India','2025-02-20'),(4,'Oliver Brown','London','UK','2025-03-11'),
(5,'Yuki Tanaka','Tokyo','Japan','2025-04-02'),(6,'Amara Okafor','Lagos','Nigeria','2025-04-29'),
(7,'Sofia Rossi','Milan','Italy','2025-05-17'),(8,'Daniel Kim','Toronto','Canada','2025-06-08');

CREATE TABLE orders(id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), order_date TEXT, status TEXT);
INSERT INTO orders VALUES
(1,1,'2025-07-02','delivered'),(2,2,'2025-07-05','delivered'),(3,3,'2025-07-09','cancelled'),(4,1,'2025-07-15','delivered'),
(5,4,'2025-08-01','delivered'),(6,5,'2025-08-03','shipped'),(7,6,'2025-08-10','pending'),(8,7,'2025-08-12','delivered'),
(9,8,'2025-08-20','pending'),(10,2,'2025-09-01','shipped');
`;

export const BOOKSHOP_SCHEMA: { table: string; rows: number; columns: [string, string][] }[] = [
  {
    table: "books",
    rows: 20,
    columns: [
      ["id", "INTEGER"],
      ["title", "TEXT"],
      ["author_id", "INTEGER"],
      ["genre", "TEXT"],
      ["price", "REAL, US$"],
      ["published_year", "INTEGER"],
      ["stock", "INTEGER"],
    ],
  },
  { table: "authors", rows: 10, columns: [["id", "INTEGER"], ["name", "TEXT"], ["country", "TEXT"]] },
  {
    table: "customers",
    rows: 8,
    columns: [
      ["id", "INTEGER"],
      ["name", "TEXT"],
      ["city", "TEXT"],
      ["country", "TEXT"],
      ["joined_on", "TEXT, date"],
    ],
  },
  {
    table: "orders",
    rows: 10,
    columns: [
      ["id", "INTEGER"],
      ["customer_id", "INTEGER"],
      ["order_date", "TEXT, date"],
      ["status", "TEXT"],
    ],
  },
];

