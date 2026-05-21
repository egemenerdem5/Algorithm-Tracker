#  System Design Project: Algorithm Tracker 🚀

A full-stack Single Page Application (SPA) designed to track, organize, and manage solved coding algorithms and LeetCode problems. 

## Features
- 📝 **Full CRUD Operations:** Create, read, update, and delete algorithm records.
- 📄 **Interactive API Docs:** Swagger UI integration available at `/api-docs`.
- ⚡ **RESTful API Architecture:** Clean routing built with Node.js and Express.js.
- 🗄️ **Embedded Database:** Zero-configuration SQLite setup.
- 🧪 **Unit Tested:** API endpoint testing implemented using Jest & Supertest.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Tools:** Swagger UI, Jest, Nodemon

## API Endpoints
The backend provides a clean RESTful API to interact with the database:
- `GET /api/problems` : Retrieve all saved algorithm problems.
- `POST /api/problems` : Add a new problem record.
- `PUT /api/problems/:id` : Update an existing problem by its ID.
- `DELETE /api/problems/:id` : Delete a problem by its ID.

## Prerequisites
Before running the project, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Quick Start

1. Clone the repository and install the dependencies:
   ```bash
   npm install
