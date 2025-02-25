# Digital Music Library

## 📗 Table of Contents
- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Contact](#contact)

## About the Project
The Music Collection Web App is a dynamic web application that allows users to manage their music collection. Users can add, edit, and delete artist and albums, open a detailed view detailed view about their favourite albums and more.

### Built With
- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Version Control**: Git

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites
- **Node.js**: Download and install Node.js from [Node.js official site](https://nodejs.org/).
- **MySQL Server**: Install MySQL Server from [MySQL's official page](https://dev.mysql.com/downloads/mysql/).
- **npm**: Ensure npm (Node Package Manager) is installed by running `npm -v` in your terminal.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PatrasSergiu/digital-music-library.git
   cd digital-music-library

2. **Set Up DB**
   - Create a new database in MySQL. You can then use the root user or create a new one.
   - Create a .env file in the root directory.
   - Add database credentials
3. **Install npm packages**
   Run npm install in both front end and back end projects.
   ```bash
   npm install
### Usage
By default, the server runs on localhost:3000 and the client on localhost:3001
Open both projects in the IDE of your choice. Make sure to run the server first.

- Backend: npm run dev
- Frontend: npm start

For easier testing of the application, we reset the database to the original contents from the data.json file. 
This behaviour can be changed by altering the sequelize sync to force: false

### Running Tests

Open a terminat in the back end project and run
   ```bash
   npm test
  ```
### Contact
Feel free to contact me at patras.sergiu@yahoo.com
