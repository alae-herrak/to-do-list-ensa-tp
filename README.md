# To Do List Application Setup

## Backend Setup (Server)

1.  **Navigate to the server directory:**

    ```bash
    cd server
    ```

2.  **Configure environment variables:**

    * Rename the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
    * Open the `.env` file and fill in the required variables:
        * `MONGO_URI`: Your MongoDB connection string.  This should look something like: `mongodb://username:password@host:port/database`
        * `JWT_SECRET`:  A secret key used for JSON Web Token (JWT) authentication.  Choose a strong, random string.

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Run the server:**

    ```bash
    npm start
    ```

    The server should now be running, typically at `http://localhost:5000`.

## Frontend Setup (Client)

1.  **Navigate to the client directory:**

    ```bash
    cd client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The frontend application should now be running, typically at `http://localhost:3000`.
