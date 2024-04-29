import sqlite3 from "sqlite3";

export const db = new sqlite3.Database('database/db.sqlite')

db.exec("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, age INTEGER, jti TEXT, role TEXT NOT NULL) STRICT")