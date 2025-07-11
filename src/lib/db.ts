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
<<<<<<< HEAD
=======

  // Initialize orders tables
  initializeOrdersTables();
}

function initializeOrdersTables() {
  // Check if orders table exists
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='orders'",
    (err, row) => {
      if (err) {
        console.error('Error checking for orders table:', err.message);
        return;
      }

      if (!row) {
        createOrdersTables();
      } else {
        console.log('Orders tables already exist.');
      }
    }
  );
}

function createOrdersTables() {
  // Create orders table
  const createOrdersTableSQL = `
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_zip TEXT NOT NULL,
      billing_address TEXT,
      billing_city TEXT,
      billing_state TEXT,
      billing_zip TEXT,
      same_as_billing BOOLEAN DEFAULT 1,
      status TEXT DEFAULT 'pending',
      total_amount DECIMAL(10,2) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `;

  // Create order_items table
  const createOrderItemsTableSQL = `
    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    )
  `;

  db.run(createOrdersTableSQL, err => {
    if (err) {
      console.error('Error creating orders table:', err.message);
    } else {
      console.log('Orders table created successfully.');

      // Create order_items table after orders table is created
      db.run(createOrderItemsTableSQL, err => {
        if (err) {
          console.error('Error creating order_items table:', err.message);
        } else {
          console.log('Order_items table created successfully.');
        }
      });
    }
  });
>>>>>>> 9536c36 (merge)
}

function createUsersTable() {
  const createTableSQL = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
<<<<<<< HEAD
=======
      address TEXT,
      phone TEXT,
>>>>>>> 9536c36 (merge)
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

<<<<<<< HEAD
=======
    // Check if address column exists
    if (!columnNames.includes('address')) {
      migrations.push(() => addAddressColumn());
      needsMigration = true;
    }

    // Check if phone column exists
    if (!columnNames.includes('phone')) {
      migrations.push(() => addPhoneColumn());
      needsMigration = true;
    }

>>>>>>> 9536c36 (merge)
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

<<<<<<< HEAD
=======
function addAddressColumn(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const addColumnSQL = `
      ALTER TABLE users 
      ADD COLUMN address TEXT
    `;

    db.run(addColumnSQL, err => {
      if (err) {
        console.error('Error adding address column:', err.message);
        reject(err);
      } else {
        console.log('Added address column to users table.');
        resolve();
      }
    });
  });
}

function addPhoneColumn(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const addColumnSQL = `
      ALTER TABLE users 
      ADD COLUMN phone TEXT
    `;

    db.run(addColumnSQL, err => {
      if (err) {
        console.error('Error adding phone column:', err.message);
        reject(err);
      } else {
        console.log('Added phone column to users table.');
        resolve();
      }
    });
  });
}

>>>>>>> 9536c36 (merge)
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
