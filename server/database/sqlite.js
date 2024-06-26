import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("server/database/db.sqlite")

db.exec("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, age INTEGER, jti TEXT, role TEXT NOT NULL) STRICT")

db.exec("CREATE TABLE IF NOT EXISTS stores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, address TEXT NOT NULL) STRICT")