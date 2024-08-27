# Yogiverse Social Network

## Overview

**Yogiverse** is a social networking platform designed to connect users within the yoga community. The platform allows users to create accounts, connect with friends, share status updates with media, and engage in real-time communication through chats. Developed as part of an Advanced Web Development module, this project leverages a modern tech stack to deliver a dynamic and responsive user experience.

## Tech Stack

- **Backend**: Django
- **Frontend**: React
- **Real-Time Communication**: Websockets (Django Channels)
- **Database**: PostgreSQL
- **In-Memory Data Store**: Redis
- **HTTP Requests**: Axios

## Features

- **User Account Management**: Create accounts, log in, and log out securely with JWT authentication.
- **Friendship System**: Search for users, add them as friends, and manage friendship statuses.
- **Real-Time Chat**: Engage in real-time messaging with friends using Websockets for instant communication.
- **Status Updates**: Post status updates with text and media, which are displayed on the user’s home page.
- **Media Uploads**: Upload images and other media files to share with friends.

## Challenges and Solutions

### Real-Time Communication
- **Challenge**: Implementing a reliable real-time chat system that allows for instant communication between users.
- **Solution**: Utilized Django Channels with Websockets to handle real-time messaging, ensuring smooth and instant chat functionality.

### User Management and Friendships
- **Challenge**: Managing user accounts and friendships efficiently while preventing duplicate friendships.
- **Solution**: Developed a custom user model and friendship system with Django, including unique constraints to avoid duplicate friendships.

### Media Handling
- **Challenge**: Efficiently managing the upload, storage, and retrieval of media files.
- **Solution**: Integrated Django’s MultiPartParser to handle media uploads and associated them with users and status updates.

### Frontend Design
- **Challenge**: Creating an intuitive and responsive user interface.
- **Solution**: Designed the frontend with React, implementing a modular component-based architecture for ease of use and scalability.

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/yogiverse.git
   ```
2. **Backend Setup**:
   - Install dependencies: `pip install -r requirements.txt`
   - Apply migrations: `python manage.py migrate`
   - Run the server: `python manage.py runserver`

3. **Frontend Setup**:
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Start the frontend: `npm start`

4. **Redis Setup**:
   - Ensure Redis is installed and running on your machine.

## Usage

1. **User Registration**: Sign up with a username and password.
2. **Friendship Management**: Search for users and add them as friends.
3. **Real-Time Chat**: Engage in conversations with friends in real-time.
4. **Status Updates**: Post updates with text and media, which will appear on your profile and in the news feed.

## Future Enhancements

- **Group Chats**: Extend the chat feature to support group conversations.
- **Enhanced Media Handling**: Implement cloud-based storage for media files and add more robust validation for uploads.
- **Pagination and Caching**: Improve the user experience by adding pagination to the news feed and caching frequently accessed data.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
