import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'todo.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`
            CREATE TABLE IF NOT EXISTS todo (
                todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

export default {
    query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            try {
                if (sql.toUpperCase().includes('SELECT')) {
                    db.all(sql, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve({ rows: rows || [] });
                    });
                } else if (sql.toUpperCase().includes('INSERT')) {
                    db.run(sql, params, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            db.get('SELECT * FROM todo WHERE todo_id = ?', [this.lastID], (err, row) => {
                                if (err) reject(err);
                                else resolve({ rows: [row] });
                            });
                        }
                    });
                } else if (sql.toUpperCase().includes('UPDATE')) {
                    db.run(sql, params, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            const changes = this.changes;
                            const todoId = params[params.length - 1];
                            db.get('SELECT * FROM todo WHERE todo_id = ?', [todoId], (err, row) => {
                                if (err) reject(err);
                                else resolve({ rows: [row], rowCount: changes });
                            });
                        }
                    });
                } else if (sql.toUpperCase().includes('DELETE')) {
                    db.run(sql, params, function(err) {
                        if (err) reject(err);
                        else resolve({ rowCount: this.changes });
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }
};
