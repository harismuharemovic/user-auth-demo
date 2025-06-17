import sqlite3 from 'sqlite3';

const DBSOURCE = 'main.db';

const db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    console.error('Error opening database:', err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');

    // Initialize database schema
    initializeDatabase();
  }
});

function initializeDatabase() {
  // First, check if the users table exists and what columns it has
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (err) {
        console.error('Error checking for users table:', err.message);
        return;
      }

      if (!row) {
        // Table doesn't exist, create it with the correct schema
        createUsersTable();
      } else {
        // Table exists, check if it needs migration
        migrateUsersTable();
      }
    }
  );
}

function createUsersTable() {
  const createTableSQL = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, err => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully with correct schema.');
    }
  });
}

function migrateUsersTable() {
  // Check current schema
  db.all('PRAGMA table_info(users)', (err, columns) => {
    if (err) {
      console.error('Error checking table schema:', err.message);
      return;
    }

    const columnNames = columns.map((col: any) => col.name);
    let needsMigration = false;
    const migrations = [];

    // Check if password_hash column exists (might be named 'password')
    if (
      columnNames.includes('password') &&
      !columnNames.includes('password_hash')
    ) {
      migrations.push(() => renamePasswordColumn());
      needsMigration = true;
    }

    // Check if created_at column exists
    if (!columnNames.includes('created_at')) {
      migrations.push(() => addCreatedAtColumn());
      needsMigration = true;
    }

    if (needsMigration) {
      console.log('Database schema migration needed. Applying migrations...');
      runMigrations(migrations);
    } else {
      console.log('Database schema is up to date.');
    }
  });
}

function runMigrations(migrations: (() => Promise<void>)[]) {
  let currentMigration = 0;

  function runNextMigration() {
    if (currentMigration >= migrations.length) {
      console.log('All database migrations completed successfully.');
      return;
    }

    migrations[currentMigration]()
      .then(() => {
        currentMigration++;
        runNextMigration();
      })
      .catch(err => {
        console.error('Migration failed:', err);
      });
  }

  runNextMigration();
}

function addCreatedAtColumn(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const addColumnSQL = `
      ALTER TABLE users 
      ADD COLUMN created_at DATETIME
    `;

    db.run(addColumnSQL, err => {
      if (err) {
        console.error('Error adding created_at column:', err.message);
        reject(err);
      } else {
        console.log('Added created_at column to users table.');

        // Update existing records to have a created_at value
        db.run(
          'UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL',
          updateErr => {
            if (updateErr) {
              console.error(
                'Error updating existing records with created_at:',
                updateErr.message
              );
            } else {
              console.log(
                'Updated existing records with created_at timestamps.'
              );
            }
            resolve();
          }
        );
      }
    });
  });
}

function renamePasswordColumn(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const renameColumnSQL = `
      ALTER TABLE users 
      RENAME COLUMN password TO password_hash
    `;

    db.run(renameColumnSQL, err => {
      if (err) {
        console.error('Error renaming password column:', err.message);
        reject(err);
      } else {
        console.log('Renamed password column to password_hash.');
        resolve();
      }
    });
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  db.close(err => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

export default db;
