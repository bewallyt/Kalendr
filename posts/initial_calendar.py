import datetime
from authentication.models import Account
from posts.models import Post
from posts.views import AccountPostsViewSet

def initialize_calendar(data):

    post_new_years = Post()
    post_new_years.author = Account.objects.get(username = data['username'])
    post_new_years.content = 'New Year\'s Day'
    post_new_years.start_time = datetime.date(2015, 1, 1)
    post_new_years.day_of_week = 'Thursday'
    post_new_years.is_holiday = True
    post_new_years.save()

    post_mlk = Post()
    post_mlk.author = Account.objects.get(username = data['username'])
    post_mlk.content = 'Martin Luther King Day'
    post_mlk.start_time = datetime.date(2015, 1, 19)
    post_mlk.day_of_week = 'Monday'
    post_mlk.is_holiday = True
    post_mlk.save()

    post_groundhog_day = Post()
    post_groundhog_day.author = Account.objects.get(username = data['username'])
    post_groundhog_day.content = 'Groundhog Day'
    post_groundhog_day.start_time = datetime.date(2015, 2, 1)
    post_groundhog_day.day_of_week = 'Monday'
    post_groundhog_day.is_holiday = True
    post_groundhog_day.save()

    post_rosa_parks = Post()
    post_rosa_parks.author = Account.objects.get(username = data['username'])
    post_rosa_parks.content = 'Rosa Parks Day'
    post_rosa_parks.start_time = datetime.date(2015, 2, 4)
    post_rosa_parks.day_of_week = 'Wednesday'
    post_rosa_parks.is_holiday = True
    post_rosa_parks.save()

    post_lincolns_bday = Post()
    post_lincolns_bday.author = Account.objects.get(username = data['username'])
    post_lincolns_bday.content = 'Lincoln\'s Birthday'
    post_lincolns_bday.start_time = datetime.date(2015, 2, 12)
    post_lincolns_bday.day_of_week = 'Thursday'
    post_lincolns_bday.is_holiday = True
    post_lincolns_bday.save()

    post_valentine = Post()
    post_valentine.author = Account.objects.get(username = data['username'])
    post_valentine.content = 'Valentine\'s Day'
    post_valentine.start_time = datetime.date(2015, 2, 14)
    post_valentine.day_of_week = 'Saturday'
    post_valentine.is_holiday = True
    post_valentine.save()

    post_presidents = Post()
    post_presidents.author = Account.objects.get(username = data['username'])
    post_presidents.content = 'President\'s Day'
    post_presidents.start_time = datetime.date(2015, 2, 16)
    post_presidents.day_of_week = 'Monday'
    post_presidents.is_holiday = True
    post_presidents.save()

    post_ash = Post()
    post_ash.author = Account.objects.get(username = data['username'])
    post_ash.content = 'Ash Wednesday Day'
    post_ash.start_time = datetime.date(2015, 2, 18)
    post_ash.day_of_week = 'Wednesday'
    post_ash.is_holiday = True
    post_ash.save()

    post_chinese = Post()
    post_chinese.author = Account.objects.get(username = data['username'])
    post_chinese.content = 'Chinese New Year'
    post_chinese.start_time = datetime.date(2015, 2, 19)
    post_chinese.day_of_week = 'Thursday'
    post_chinese.is_holiday = True
    post_chinese.save()

    post_texas = Post()
    post_texas.author = Account.objects.get(username = data['username'])
    post_texas.content = 'Texas Independence Day'
    post_texas.start_time = datetime.date(2015, 3, 2)
    post_texas.day_of_week = 'Monday'
    post_texas.is_holiday = True
    post_texas.save()

    post_employee = Post()
    post_employee.author = Account.objects.get(username = data['username'])
    post_employee.content = 'Employee Appreciation Day'
    post_employee.start_time = datetime.date(2015, 3, 6)
    post_employee.day_of_week = 'Friday'
    post_employee.is_holiday = True
    post_employee.save()

    post_daylight = Post()
    post_daylight.author = Account.objects.get(username = data['username'])
    post_daylight.content = 'Daylight Saving\'s Time'
    post_daylight.start_time = datetime.date(2015, 3, 6)
    post_daylight.day_of_week = 'Friday'
    post_daylight.is_holiday = True
    post_daylight.save()

    post_patrick = Post()
    post_patrick.author = Account.objects.get(username = data['username'])
    post_patrick.content = 'St. Patrick\'s Day'
    post_patrick.start_time = datetime.date(2015, 3, 17)
    post_patrick.day_of_week = 'Tuesday'
    post_patrick.is_holiday = True
    post_patrick.save()

    post_spring = Post()
    post_spring.author = Account.objects.get(username = data['username'])
    post_spring.content = 'Spring Solstice'
    post_spring.start_time = datetime.date(2015, 3, 20)
    post_spring.day_of_week = 'Friday'
    post_spring.is_holiday = True
    post_spring.save()

    post_friday = Post()
    post_friday.author = Account.objects.get(username = data['username'])
    post_friday.content = 'Good Friday'
    post_friday.start_time = datetime.date(2015, 4, 3)
    post_friday.day_of_week = 'Friday'
    post_friday.is_holiday = True
    post_friday.save()

    post_passover = Post()
    post_passover.author = Account.objects.get(username = data['username'])
    post_passover.content = 'Passover'
    post_passover.start_time = datetime.date(2015, 4, 4)
    post_passover.day_of_week = 'Saturday'
    post_passover.is_holiday = True
    post_passover.save()

    post_easter = Post()
    post_easter.author = Account.objects.get(username = data['username'])
    post_easter.content = 'Easter Sunday'
    post_easter.start_time = datetime.date(2015, 4, 5)
    post_easter.day_of_week = 'Sunday'
    post_easter.is_holiday = True
    post_easter.save()

    post_tax = Post()
    post_tax.author = Account.objects.get(username = data['username'])
    post_tax.content = 'Tax Day'
    post_tax.start_time = datetime.date(2015, 4, 15)
    post_tax.day_of_week = 'Wednesday'
    post_tax.is_holiday = True
    post_tax.save()

    post_cinco = Post()
    post_cinco.author = Account.objects.get(username = data['username'])
    post_cinco.content = 'Cinco de Mayo'
    post_cinco.start_time = datetime.date(2015, 5, 5)
    post_cinco.day_of_week = 'Tuesday'
    post_cinco.is_holiday = True
    post_cinco.save()

    post_mother = Post()
    post_mother.author = Account.objects.get(username = data['username'])
    post_mother.content = 'Mother\'s Day'
    post_mother.start_time = datetime.date(2015, 5, 15)
    post_mother.day_of_week = 'Sunday'
    post_mother.is_holiday = True
    post_mother.save()

    post_armed = Post()
    post_armed.author = Account.objects.get(username = data['username'])
    post_armed.content = 'Armed Forces Day'
    post_armed.start_time = datetime.date(2015, 5, 16)
    post_armed.day_of_week = 'Saturday'
    post_armed.is_holiday = True
    post_armed.save()

    post_memorial = Post()
    post_memorial.author = Account.objects.get(username = data['username'])
    post_memorial.content = 'Memorial Day'
    post_memorial.start_time = datetime.date(2015, 5, 25)
    post_memorial.day_of_week = 'Monday'
    post_memorial.is_holiday = True
    post_memorial.save()

    post_dday = Post()
    post_dday.author = Account.objects.get(username = data['username'])
    post_dday.content = 'D-Day Day'
    post_dday.start_time = datetime.date(2015, 6, 6)
    post_dday.day_of_week = 'Saturday'
    post_dday.is_holiday = True
    post_dday.save()

    post_flag = Post()
    post_flag.author = Account.objects.get(username = data['username'])
    post_flag.content = 'Flag Day'
    post_flag.start_time = datetime.date(2015, 6, 14)
    post_flag.day_of_week = 'Sunday'
    post_flag.is_holiday = True
    post_flag.save()

    post_summer = Post()
    post_summer.author = Account.objects.get(username = data['username'])
    post_summer.content = 'Summer Starts'
    post_summer.start_time = datetime.date(2015, 6, 21)
    post_summer.day_of_week = 'Sunday'
    post_summer.is_holiday = True
    post_summer.save()

    post_father = Post()
    post_father.author = Account.objects.get(username = data['username'])
    post_father.content = 'Father\'s Day'
    post_father.start_time = datetime.date(2015, 6, 21)
    post_father.day_of_week = 'Sunday'
    post_father.is_holiday = True
    post_father.save()

    post_independence = Post()
    post_independence.author = Account.objects.get(username = data['username'])
    post_independence.content = 'Independence Day'
    post_independence.start_time = datetime.date(2015, 7, 4)
    post_independence.day_of_week = 'Saturday'
    post_independence.is_holiday = True
    post_independence.save()

    post_labor = Post()
    post_labor.author = Account.objects.get(username = data['username'])
    post_labor.content = 'Labor Day'
    post_labor.start_time = datetime.date(2015, 9, 7)
    post_labor.day_of_week = 'Monday'
    post_labor.is_holiday = True
    post_labor.save()

    post_patriot = Post()
    post_patriot.author = Account.objects.get(username = data['username'])
    post_patriot.content = 'Patriot Day'
    post_patriot.start_time = datetime.date(2015, 9, 11)
    post_patriot.day_of_week = 'Friday'
    post_patriot.is_holiday = True
    post_patriot.save()

    post_constitution = Post()
    post_constitution.author = Account.objects.get(username = data['username'])
    post_constitution.content = 'Constitution Day'
    post_constitution.start_time = datetime.date(2015, 9, 17)
    post_constitution.day_of_week = 'Thursday'
    post_constitution.is_holiday = True
    post_constitution.save()

    post_fall = Post()
    post_fall.author = Account.objects.get(username = data['username'])
    post_fall.content = 'Autumnal Equinox'
    post_fall.start_time = datetime.date(2015, 9, 23)
    post_fall.day_of_week = 'Wednesday'
    post_fall.is_holiday = True
    post_fall.save()

    post_columbus = Post()
    post_columbus.author = Account.objects.get(username = data['username'])
    post_columbus.content = 'Columbus Day'
    post_columbus.start_time = datetime.date(2015, 10, 12)
    post_columbus.day_of_week = 'Monday'
    post_columbus.is_holiday = True
    post_columbus.save()

    post_halloween = Post()
    post_halloween.author = Account.objects.get(username = data['username'])
    post_halloween.content = 'Halloween'
    post_halloween.start_time = datetime.date(2015, 10, 31)
    post_halloween.day_of_week = 'Saturday'
    post_halloween.is_holiday = True
    post_halloween.save()

    post_light = Post()
    post_light.author = Account.objects.get(username = data['username'])
    post_light.content = 'Daylight Saving Time Ends'
    post_light.start_time = datetime.date(2015, 11, 1)
    post_light.day_of_week = 'Sunday'
    post_light.is_holiday = True

    post_light.save()

    post_election = Post()
    post_election.author = Account.objects.get(username = data['username'])
    post_election.content = 'Election Day'
    post_election.start_time = datetime.date(2015, 11, 3)
    post_election.day_of_week = 'Tuesday'
    post_election.is_holiday = True
    post_election.save()

    post_thanksgiving = Post()
    post_thanksgiving.author = Account.objects.get(username = data['username'])
    post_thanksgiving.content = 'Thanksgiving'
    post_thanksgiving.start_time = datetime.date(2015, 11, 26)
    post_thanksgiving.day_of_week = 'Tuesday'
    post_thanksgiving.is_holiday = True
    post_thanksgiving.save()

    post_presidents = Post()
    post_presidents.author = Account.objects.get(username = data['username'])
    post_presidents.content = 'President\'s Day'
    post_presidents.start_time = datetime.date(2015, 11, 27)
    post_presidents.day_of_week = 'Friday'
    post_presidents.is_holiday = True
    post_presidents.save()

    post_black = Post()
    post_black.author = Account.objects.get(username = data['username'])
    post_black.content = 'Black Friday'
    post_black.start_time = datetime.date(2015, 11, 27)
    post_black.day_of_week = 'Friday'
    post_black.is_holiday = True
    post_black.save()

    post_monday = Post()
    post_monday.author = Account.objects.get(username = data['username'])
    post_monday.content = 'Cyber Monday'
    post_monday.start_time = datetime.date(2015, 11, 30)
    post_monday.day_of_week = 'Monday'
    post_monday.is_holiday = True
    post_monday.save()

    post_han = Post()
    post_han.author = Account.objects.get(username = data['username'])
    post_han.content = 'Hanukkah'
    post_han.start_time = datetime.date(2015, 12, 7)
    post_han.day_of_week = 'Monday'
    post_han.is_holiday = True
    post_han.save()

    post_pearl = Post()
    post_pearl.author = Account.objects.get(username = data['username'])
    post_pearl.content = 'Pearl Harbor Remembrance Day'
    post_pearl.start_time = datetime.date(2015, 12, 7)
    post_pearl.day_of_week = 'Monday'
    post_pearl.is_holiday = True
    post_pearl.save()

    post_winter = Post()
    post_winter.author = Account.objects.get(username = data['username'])
    post_winter.content = 'Winter Solstice'
    post_winter.start_time = datetime.date(2015, 12, 22)
    post_winter.day_of_week = 'Tuesday'
    post_winter.is_holiday = True
    post_winter.save()

    post_xmas_eve = Post()
    post_xmas_eve.author = Account.objects.get(username = data['username'])
    post_xmas_eve.content = 'Christmas Eve'
    post_xmas_eve.start_time = datetime.date(2015, 12, 24)
    post_xmas_eve.day_of_week = 'Thursday'
    post_xmas_eve.is_holiday = True
    post_xmas_eve.save()

    post_xmas = Post()
    post_xmas.author = Account.objects.get(username = data['username'])
    post_xmas.content = 'Christmas Day'
    post_xmas.start_time = datetime.date(2015, 12, 25)
    post_xmas.day_of_week = 'Friday'
    post_xmas.is_holiday = True
    post_xmas.save()

    post_nye = Post()
    post_nye.author = Account.objects.get(username = data['username'])
    post_nye.content = 'New Year\'s Eve'
    post_nye.start_time = datetime.date(2015, 12, 31)
    post_nye.day_of_week = 'Thursday'
    post_nye.is_holiday = True
    post_nye.save()



