# kalendr
Senior design project, Spring 2015.

If you create an new app using 'python manage.py startapp', always the add the migrations folder to the .gitignore, add and commit ONLY the .gitignore (but do not push), then add and commit the remaining files.

This rule applies to all files that should be ignored, ignore them first!

To run the application, clone the repository and navigate into it.

1. $ pip install -r requirements.txt (if access errors pop up, you can always sudo, but we recommened you fix the access errors instead of using sudo)

2. $ npm install (you will need Node.js to already be installed on your computer)

3. $ npm install -g bower

4. $ bower install

5. $ python manage.py makemigrations

6. $ python manage.py migrate

7. $ python manage.py runserver
