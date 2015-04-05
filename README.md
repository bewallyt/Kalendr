# kalendr
Senior design project, Spring 2015.

This app is best displayed on screen with a minimum resolution of 1280px X 800px; it has not been optimized for mobile!

Check it out at https://kalendr458.herokuapp.com/

To run the application, clone the repository and navigate into it.

1. $ pip install -r requirements.txt (if access errors pop up, you can always sudo, but we recommened you fix the access errors instead of using sudo)

2. $ npm install (you will need Node.js to already be installed on your computer)

3. $ npm install -g bower

4. $ bower install (if you are prompted to choose an angular.js version, we recommend choosing the latest release)

5. $ python manage.py makemigrations

6. $ python manage.py migrate

7. $ python manage.py runserver

If you run into migration issues (circular dependencies etc.), please read below:
