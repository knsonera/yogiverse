# Yogiverse App

Welcome to Yogiverse App - a social network web application, where yogis meet in the virtual world.

# Getting started

#### To start backend server:

1. Open backend directory
cd Yogiverse

2. Install dependencies:
pip install -r requirements.txt

3. Start redis
redis-server

4. Check migrations
python manage.py makemigrations
python manage.py migrate

5. Run server
daphne Yogiverse.asgi:application

#### Django admin access:
username: yogiverse
password: 11aa22ss

#### To run tests:

python manage.py test

##### To start React app:

1. Open frontend directory
cd yogiverse-frontend

2. Install dependencies
npm install     

3. Start application
npm start      
