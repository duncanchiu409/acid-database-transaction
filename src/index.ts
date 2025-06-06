import Database from 'better-sqlite3';

// Create a new database instance
const db = new Database('user.db');

// Create a table for demonstration
const create_table_stmt = db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE);`);
create_table_stmt.run();
console.log('Table created successfully.');

const insert_user_stmt = db.prepare(`INSERT INTO users (name) VALUES (?);`);

try {
    // Start a transaction explicitly
    db.exec('BEGIN TRANSACTION;');

    // Insert a user
    console.log('Inserting user `Alice`...');
    insert_user_stmt.run('Alice');
    console.log('User `Alice` inserted successfully.');

    // Attempt to insert a duplicate user to trigger an error
    console.log('Inserting user `Alice` again...');
    insert_user_stmt.run('Alice'); // This will cause a UNIQUE constraint violation
    console.log('User `Alice` inserted again successfully.'); // This line will not be executed

    // If everything is successful, commit the transaction
    db.exec('COMMIT;');
} catch (error) {
    // If an error occurs, roll back the transaction
    const errorMessage = (error as Error).message;
    db.exec('ROLLBACK;');
    console.log('Transaction rolled back due to error:', errorMessage);
}

try {
    // Start implicit transactions
    console.log('Inserting user `Candice`...');
    insert_user_stmt.run('Candice');
    console.log('User `Candice` inserted successfully.');

    // Commit the transaction
    db.exec('COMMIT;');

    // Attempt to insert a duplicate user to trigger an error
    console.log('Inserting user `Candice` again...');
    insert_user_stmt.run('Candice'); // This will cause a UNIQUE constraint violation
    console.log('User `Candice` inserted again successfully.'); // This line will not be executed

    // Commit the transaction
    db.exec('COMMIT;');
} catch (error) {
    // If an error occurs, roll back the transaction
    const errorMessage = (error as Error).message;
    console.log('Transaction rolled back due to error:', errorMessage);
}

try {
    // Start autocommit transactions
    console.log('Inserting user `Bob`...');
    insert_user_stmt.run('Bob');
    console.log('User `Bob` inserted successfully.');

    // Attempt to insert a duplicate user to trigger an error
    console.log('Inserting user `Bob` again...');
    insert_user_stmt.run('Bob'); // This will cause a UNIQUE constraint violation
    console.log('User `Bob` inserted again successfully.'); // This line will not be executed
} catch (error) {
    // If an error occurs, roll back the transaction
    const errorMessage = (error as Error).message;
    console.log('Transaction rolled back due to error:', errorMessage);
}

// Check the users in the database
const select_user_stmt = db.prepare(`SELECT * FROM users;`);
let result = select_user_stmt.all();
console.log('Users in the database:', result);

// Close the database connection
db.close();
console.log('Database connection closed.');