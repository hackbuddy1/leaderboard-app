# Leaderboard Challenge Application 🏆

This is a full-stack MERN application that provides a real-time, interactive leaderboard system. Users can be selected from a list, points can be claimed for them, and rankings are updated instantly for all connected clients using WebSockets.

The project was built using React for the frontend, and Node.js with Express for the backend, all connected to a MongoDB Atlas database.


## ✨ Features

-   **Real-Time Leaderboard:** Rankings update instantly across all open browsers without needing a page refresh, thanks to Socket.IO.
-   **Dynamic Point System:** A "Claim" button awards a random number of points (1-10) to the selected user.
-   **User Management:** You can add new users to the leaderboard directly from the UI.
-   **Persistent Data:** All users, points, and claim history are stored in a MongoDB database.
-   **Claim History:** A detailed log of every point claim is recorded and displayed.
-   **Advanced UI:** A modern, clean, and responsive user interface featuring a special "Podium" view for the top 3 ranked users.
-   **Efficient Pagination:** The claim history is paginated, ensuring the application remains fast and efficient even with thousands of records.

## ⚙️ Tech Stack

### Backend
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web framework for creating the API.
-   **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
-   **Socket.IO:** Library for enabling real-time, bidirectional communication.
-   **Dotenv:** For managing environment variables.

### Frontend
-   **React.js:** JavaScript library for building user interfaces.
-   **Axios:** For making API requests to the backend.
-   **socket.io-client:** The client-side library for Socket.IO.
-   **CSS3:** For custom styling and responsive design.

### Database
-   **MongoDB (Atlas):** A cloud-hosted NoSQL database.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have the following software installed on your machine:
-   [Node.js](https://nodejs.org/en/) (which includes npm)
-   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/leaderboard-app.git
    cd leaderboard-app
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install the dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add your MongoDB connection string:
        ```
        # .env file
        PORT=5000
        MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/leaderboardDB?retryWrites=true&w=majority
        ```
    *   Start the backend server:
        ```bash
        npm start
        ```
    The backend will be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    *   Open a **new terminal** and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    *   Install the dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm start
        ```

4.  **You're all set!**
    Open your browser and go to `http://localhost:3000` to see the application in action.

---
## 🔌 API Endpoints

The following API endpoints are available:

| Method | Endpoint                    | Description                                         |
| :----- | :-------------------------- | :-------------------------------------------------- |
| `GET`  | `/api/users`                | Get a simple list of all users.                     |
| `POST` | `/api/users`                | Create a new user.                                  |
| `POST` | `/api/users/:userId/claim`  | Claim random points for a specific user.            |
| `GET`  | `/api/leaderboard`          | Get the full, ranked leaderboard.                   |
| `GET`  | `/api/history`              | Get paginated claim history (`?page=1&limit=10`).   |