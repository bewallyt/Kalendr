import datetime
from posts.models import Post
from dateutil.relativedelta import relativedelta


def repeat_events(event):
    start_time = event.start_time
    end_repeat_date = event.end_repeat
    repeat_type = event.repeat

    num_repeat = find_repeat(start_time, end_repeat_date, repeat_type)


    for x in range(1, num_repeat + 1):
        temp_event = Post()
        temp_event.author = event.author
        temp_event.content = event.content
        temp_event.notification = event.notification
        temp_event.notify_when = event.notify_when
        temp_event.location_event = event.location_event
        temp_event.description_event = event.description_event
        temp_event.begin_time = event.begin_time
        temp_event.end_time = event.end_time
        temp_event.end_repeat = event.end_repeat
        temp_event.need_repeat = False
        temp_event.start_time = event.start_time
        temp_event.not_all_day = event.not_all_day
        temp_event.repeat = event.repeat


        if repeat_type == 'Daily':
            temp_event.start_time = temp_event.start_time + datetime.timedelta(days=x)
            temp_event.notify_when = temp_event.notify_when + datetime.timedelta(days=x)
            print 'datetime.timedelta' + str(datetime.timedelta(days=x))
        elif repeat_type == 'Monthly':
            temp_event.start_time = temp_event.start_time + relativedelta( months = +x )
            temp_event.notify_when = temp_event.notify_when + relativedelta( months = +x )
        elif repeat_type == 'Weekly':
            temp_event.start_time = temp_event.start_time + datetime.timedelta(days=7) * x
            temp_event.notify_when = temp_event.notify_when + datetime.timedelta(days=7) * x

        if temp_event.start_time.weekday() == 0:
            temp_event.day_of_week = 'Monday'
        elif temp_event.start_time.weekday() == 1:
            temp_event.day_of_week = 'Tuesday'
        elif temp_event.start_time.weekday() == 2:
            temp_event.day_of_week = 'Wednesday'
        elif temp_event.start_time.weekday() == 3:
            temp_event.day_of_week = 'Thursday'
        elif temp_event.start_time.weekday() == 4:
            temp_event.day_of_week = 'Friday'
        elif temp_event.start_time.weekday() == 5:
            temp_event.day_of_week = 'Saturday'
        elif temp_event.start_time.weekday() == 6:
            temp_event.day_of_week = 'Sunday'

        print 'Temp_Event Date: ' + str(temp_event.start_time)
        print 'Temp Event Day of Week: ' + str(temp_event.day_of_week)

        temp_event.show_date = str(temp_event.start_time)[5:7] + "/" + str(temp_event.start_time)[8:10] + "/" + str(temp_event.start_time)[0:4]
        temp_event.show_begin_time = str(temp_event.begin_time)[11:16]
        temp_event.show_end_time = str(temp_event.begin_time)[11:16]
        temp_event.is_date_set = True

        temp_event.is_week_set = True
        if temp_event.day_of_week == 'Sunday':
            temp_event.week_num = temp_event.start_time.isocalendar()[1] + 1
        else:
            temp_event.week_num = temp_event.start_time.isocalendar()[1]
        print 'in repeat py day of week: ' + str(temp_event.week_num)

        temp_event.save()



def find_repeat(start_time, end_repeat_date, repeat_type):
    time_delta = end_repeat_date - start_time
    num_repeat = 0
    if repeat_type == 'Monthly':
        num_repeat = time_delta.days / 30
        print 'num_repeat: ' + str(num_repeat)

    elif repeat_type == 'Weekly':
        num_repeat = time_delta.days / 7

    elif repeat_type == 'Daily':
        num_repeat = time_delta.days


    return num_repeat
