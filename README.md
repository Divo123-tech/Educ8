# **Educ8 - E-Learning Platform**

Welcome to **Educ8**, the next-generation e-learning platform built for modern learners and educators. Whether you're a student eager to take courses or an instructor looking to share your knowledge, Educ8 provides an interactive and intuitive learning environment for everyone.

To see a full comprehensive <a href="https://drive.google.com/file/d/1lcBhi3bMnhVNPWpBxiQN5dDpTAemG8As/view?usp=sharing">report</a>

---

## **Table of Contents**

- [About Educ8](#about-educ8)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation Guide](#installation-guide)
- [Development Setup](#development-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## **About Educ8**

Educ8 is a feature-rich e-learning platform designed to connect learners with educators seamlessly. It allows students to register for courses, track their learning progress, and interact with instructors in real-time. 

### Key Features:
- **Real-Time Communication**: Chat with instructors and fellow students during live sessions using WebSockets powered by Django Channels and Redis. This provides an engaging and interactive experience in real-time.
- **Course Management**: Educators can create, update, and publish courses with video lessons, quizzes, and assignments.
- **Personalized Experience**: Students can browse through courses by categories, search, and filter for the courses that match their needs.

---

## **Tech Stack**

Educ8 is built using the following technologies:

- **Frontend:**
  - **React**: A powerful JavaScript library for building dynamic user interfaces.
  - **Vite**: A fast, modern build tool and development server for React.
  - **Tailwind CSS**: A utility-first CSS framework for designing beautiful and responsive UIs.

- **Backend:**
  - **Django**: A robust Python-based web framework for building secure and scalable web applications.
  - **Django Channels**: Extends Django to handle WebSockets for real-time interactions like chat and notifications, enabling a real-time communication experience for users.
  - **Redis**: In-memory data structure store used for caching and handling real-time messages with Channels.

- **Database:**
  - **PostgreSQL**: A powerful, open-source relational database system used for storing application data.
  
---

## **Features**

Educ8 offers a wide range of features for both students and instructors:

### **For Students:**
- **Course Registration**: Sign up and register for your favorite courses.
- **Progress Tracking**: View your learning progress and completed courses.
- **Live Chat**: Real-time chat with instructors and other students using WebSockets. Stay connected and engage during live sessions and group discussions.
- **Search & Filters**: Find courses based on category, course name, or creator.
- **Assignments**: Submit assignments and get real-time feedback.

### **For Instructors:**
- **Course Creation**: Create and manage your courses, add lessons, quizzes, and assignments.
- **Student Interaction**: Communicate directly with students via real-time chat and notifications.
- **Analytics**: Track student progress and engagement with your courses.

---

## **Installation Guide**

Follow these steps to get Educ8 up and running on your local machine.

### **Backend (Django + Channels)**

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/educ8.git
    cd educ8/server
    ```

2. **Create and activate a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the environment variables**:
    Copy the `.env.example` file and rename it to `.env`. Set the necessary values like your database URL, secret key, etc.

5. **Run database migrations**:
    ```bash
    python manage.py migrate
    ```

6. **Start Redis server** (make sure Redis is installed):
    ```bash
    redis-server
    ```

7. **Run the Django development server**:
    ```bash
    python manage.py runserver
    ```

### **Frontend (React + Vite)**

1. **Navigate to the frontend directory**:
    ```bash
    cd ../client
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the Vite development server**:
    ```bash
    npm run dev
    ```

Now, you should have both the backend and frontend running locally on your machine! 🎉

---

## **Development Setup**

To contribute or modify the code, you'll need to set up your environment for development. Follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Divo123-tech/educ8.git
    ```

2. Set up a **Python virtual environment** for the backend and install the required packages:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. Install **Node.js and NPM** (if not already installed) and run:
    ```bash
    cd client
    npm install
    ```

4. **Start Redis** for WebSockets:
    ```bash
    redis-server
    ```

5. **Run Backend & Frontend**:
    - Backend: `python manage.py runserver`
    - Frontend: `npm run dev`

---
## **Deployment**

For production deployment, we use **AWS S3**, **AWS RDS**, and **Docker** to ensure scalability, reliability, and ease of management.

1. **Backend Deployment**:
   - **AWS RDS**: The backend database is hosted on **AWS RDS** (PostgreSQL), providing a managed, scalable, and secure database environment.
   - **Redis**: Used for caching and real-time communication (WebSockets).
   - **Docker**: The backend is containerized using **Docker**, ensuring consistency across environments and simplifying deployment to AWS or other platforms.
   - **Django Settings**: Configuration for production environments (e.g., `ALLOWED_HOSTS`, `DATABASE_URL`, `AWS_ACCESS_KEY_ID`, etc.) is done in the `settings.py` file, making it ready for AWS deployment.

2. **Frontend Deployment**:
   - The **React** application is built using `npm run build` and deployed to **AWS S3** for serving static assets. AWS S3 provides scalable storage for your static files and is optimized for fast content delivery.

3. **Real-Time Communication (WebSockets)**:
   - For real-time chat and notifications, the backend uses **Django Channels** with **WebSockets**. Redis is used as a message broker to handle WebSocket connections in a distributed manner, ensuring scalability.

4. **Containerization**:
   - Both the backend and frontend are containerized using **Docker**, ensuring consistent environments across development, testing, and production. Docker simplifies the process of deploying the application to various cloud platforms, including AWS.

By leveraging AWS services and Docker, the deployment is optimized for scalability, reliability, and performance in a production environment.


---

## **Contributing**

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**.
2. **Clone your fork**:
    ```bash
    git clone https://github.com/Divo123-tech/educ8.git
    ```
3. Create a **branch** for your feature:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4. Make your changes and **commit**:
    ```bash
    git commit -m "Add feature: your-feature-name"
    ```
5. **Push your changes** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
6. Create a **pull request** with a description of your changes.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Contact**

For any issues, suggestions, or questions, feel free to reach out to us by opening an issue or contacting us directly at [your-email@example.com].
