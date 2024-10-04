# ShiftEase

**ShiftEase** is a shift management web application designed for restaurants to streamline scheduling and communication. It offers role-specific views, shift availability tracking, and automated notifications to enhance team efficiency.

## Features

- **Role-based Interfaces:** Separate views for managers, waiters, and bartenders.
- **Shift Scheduling:** Employees can submit their availability, and managers can assign shifts accordingly.
- **Notifications:** Automated notifications for staff about their upcoming shifts.
- **Admin Management:** Easily add, update, or delete users and assign roles.

## Tech Stack

- **Frontend:** React (with Vite for build)
- **Backend:** Flask (Python)
- **Database:** SQLAlchemy (SQL database)
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (for serving the React frontend)
- **Proxy:** Nginx (for routing frontend and backend requests)
## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Docker** (for containerization)
- **Docker Compose** (for orchestrating multi-container Docker apps)

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/shiftease.git
cd ShiftEase
```
### Step 2: Build and Run the Project Using Docker Compose

```bash
docker-compose up --build
```
This command will:

Build the React frontend using Vite.
Build the Flask backend with Python and required dependencies.
Serve the app on http://localhost using Nginx.

## Usage
- Access the app: Open http://localhost in your browser.
- Authentication: Log in or sign up based on your role (admin, manager, or employee).
- Admin: Admin users can add or remove users and assign them to roles.
- Scheduling: Managers can assign shifts based on employee availability.
Availability: Employees can submit their weekly availability through the app.

## Contact
For any inquiries or support, feel free to reach out:

Email: charconmatan@gmail.com
LinkedIn: https://www.linkedin.com/in/matan-charcon-79a66a251
