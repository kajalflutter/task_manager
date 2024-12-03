Use MySQL for datbase:

Database creation:
CREATE DATABASE task_manager;

Verify creation:
SHOW DATABASES;


Use database:
USE task_manager;

Table creation:
CREATE TABLE tasks_table_name (
    id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    isSynced TINYINT(1) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

Verify Creation:

DESC tasks;



Prerequisites
Node.js installed
MySQL installed and running


Setup the project:
mkdir task_manager
cd task_manager
copy all files to this directory
update host, password and user details in file db.js
npm init -y
npm install express mysql2 body-parser nodemon


Api end points:

POST	/api/tasks	Create a task	
GET	/api/tasks	Get all tasks	-
PUT	/api/tasks/:id	Update a task by ID
DELETE	/api/tasks/:id	Delete a task by ID


