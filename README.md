# ShiftEase

ShiftEase is a web application designed to streamline work arrangements and availability management. The platform allows users to log in, manage their work schedules, and administrators to manage user data effectively.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (login/signup/logout)
- Manage work arrangements
- Track user availability
- Admin panel for managing users and waiters
- Flash messages for feedback (success/error)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/ShiftEase.git
    cd ShiftEase
    ```

2. **Create a virtual environment**:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

4. **Set up the database**:
    ```sh
    flask db init
    flask db migrate
    flask db upgrade
    ```

5. **Run the application**:
    ```sh
    flask run
    ```

6. **Access the application**:
    Open your web browser and go to `http://127.0.0.1:5000`.

## Usage

1. **User Authentication**:
    - Sign up for a new account or log in with existing credentials.
    - Once logged in, you can manage your work arrangements and availability.

2. **Admin Panel**:
    - Admin users have additional options to manage the user list and waiter assignments.
    - Navigate to `/admin/users` to manage users.
    - Navigate to `/admin/waiters` to manage waiters.

## Contributing

We welcome contributions to enhance ShiftEase. To contribute, follow these steps:

1. **Fork the repository**:
    - Click the "Fork" button on the top right of the repository page.

2. **Clone your forked repository**:
    ```sh
    git clone https://github.com/yourusername/ShiftEase.git
    cd ShiftEase
    ```

3. **Create a new branch**:
    ```sh
    git checkout -b feature/your-feature-name
    ```

4. **Make your changes**:
    - Implement your feature or bug fix.

5. **Commit your changes**:
    ```sh
    git add .
    git commit -m "Description of your changes"
    ```

6. **Push your changes**:
    ```sh
    git push origin feature/your-feature-name
    ```

7. **Create a Pull Request**:
    - Go to the original repository on GitHub and create a pull request from your forked repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
