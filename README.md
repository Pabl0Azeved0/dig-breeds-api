# 🐾 Dog Breeds Explorer

This is a full-stack web application that allows users to browse different dog breeds, view their pictures, and save their favorite breeds. The project is built with a Node.js/TypeScript backend and a Vue 3/Vuetify frontend.

## Features

  * **Browse Breeds:** View a comprehensive list of dog breeds.
  * **Image Gallery:** Click on any breed to view a carousel of 3 images.
  * **Favorites System:** Mark and unmark breeds as favorites.
  * **Persistent Storage:** Your favorite breeds are saved and will be there when you return.
  * **Responsive Design:** A clean, modern UI that works on all screen sizes.

-----

## Tech Stack

### Backend

  * **Node.js** with **TypeScript**
  * **Express.js** for the REST API
  * **Jest & Supertest** for unit and integration testing
  * **Swagger (OpenAPI)** for API documentation
  * **Axios** for making requests to the external Dog CEO API
  * **JSON file** for persisting favorite breeds

### Frontend

  * **Vue 3** (Composition API with `<script setup>`)
  * **Vite** for the development server and build tooling
  * **Vitest & Vue Test Utils** for unit testing
  * **Vuetify 3** for the component library and layout
  * **Tailwind CSS** for utility-first styling

-----

## Getting Started

### Prerequisites

  * Node.js (v18 or later)
  * npm
  * Docker and Docker Compose (for the containerized setup)

### Local Development Setup

1.  **Clone the repository:**

    ```text
    github has a '<code>' button, hit it and copy
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configure frontend environment:**

      * In the `/frontend` directory, create a new file named `.env.local`.
      * Add the following line to it. This tells the frontend where to find the backend API.
        ```
        VITE_API_BASE_URL=http://localhost:3000/api
        ```

### Running the Application

You'll need two separate terminals to run the backend and frontend servers.

  * **Run the backend server:**

    ```bash
    # From the /backend directory
    npm run dev
    ```

    The API will be running at `http://localhost:3000`.

  * **Run the frontend server:**

    ```bash
    # From the /frontend directory
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

-----

## Running Tests 🧪

Both the frontend and backend are equipped with a full testing suite.

### Backend (Jest)

Navigate to the `/backend` directory to run the tests.

  * **Run all tests:**
    ```bash
    npm test
    ```
  * **Run tests with coverage report:**
    ```bash
    npm run test:coverage
    ```
    The detailed HTML report can be found in `/backend/coverage/lcov-report/index.html`.

### Frontend (Vitest)

Navigate to the `/frontend` directory to run the tests.

  * **Run all tests in watch mode:**
    ```bash
    npm run test:unit
    ```
  * **Run tests once with coverage report:**
    ```bash
    npm run test:coverage
    ```
    The detailed HTML report can be found in `/frontend/coverage/index.html`.

-----

## Running with Docker 🐳

The easiest way to run the entire application is with Docker Compose.

1.  **Build and start the containers:**

      * From the project's **root directory**, run:
        ```bash
        docker compose up
        ```
      * To run in the background, use the `-d` flag: `docker compose up -d`.
      * **Note:** The first time you run the app or after adding new dependencies, you should use the `--build` flag: `docker compose up --build`.

2.  **Access the application:**

      * The frontend will be available at `http://localhost:5173`.
      * The backend API will be available at `http://localhost:3000`.

-----

## API Endpoints

The backend provides the following REST API endpoints.

| Method     | Path                        | Description                          |
| :--------- | :-------------------------- | :----------------------------------- |
| **`GET`** | `/api/breeds`               | Get a list of all dog breeds.        |
| **`GET`** | `/api/breeds/:breed/image`  | Get a single random image for a breed. |
| **`GET`** | `/api/breeds/:breed/images` | Get three random images for a breed. |
| **`GET`** | `/api/favorites`            | Get the list of all favorite breeds. |
| **`POST`** | `/api/favorites`            | Add a new breed to favorites.        |
| **`DELETE`** | `/api/favorites/:breed`     | Remove a breed from favorites.       |

-----

## API Documentation (Swagger) 📖

This project uses Swagger UI to provide interactive API documentation. Once the backend server is running, you can access and test the API endpoints in your browser.

  * **URL:** `http://localhost:3000/docs`