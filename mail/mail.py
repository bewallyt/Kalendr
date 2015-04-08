from django.core.mail import EmailMessage
import datetime
from subprocess import call


def send_post(post):
    when = post.day_of_week + ', ' + post.show_date
    if post.not_all_day:
        when = when + ' at ' + post.show_begin_time
    email = EmailMessage(to=[post.author.email])
    email.template_name = 'post'
    email.global_merge_vars = {
        'content': post.content,
        'description': post.description_event,
        'location': post.location_event,
        'when': when
    }
    email.send_at = post.notify_when
    email.use_template_subject = True
    email.use_template_from = False
    email.send(fail_silently=False)

    response = email.mandrill_response[0]
    print response
    return response

    
def send_shared_post(post, email_address, send_time):
    when = post.day_of_week + ', ' + post.show_date
    if post.not_all_day:
        when = when + ' at ' + post.show_begin_time
    email = EmailMessage(to=[email_address])
    email.template_name = 'post'
    email.global_merge_vars = {
        'content': post.content,
        'description': post.description_event,
        'location': post.location_event,
        'when': when
    }
    email.send_at = send_time
    email.use_template_subject = True
    email.use_template_from = False
    email.send(fail_silently=False)

    response = email.mandrill_response[0]
    print response
    return response


def send_pud(pud):
    email = EmailMessage(to=[pud.author.email])
    email.template_name = 'pud'
    email.global_merge_vars = {
        'content': pud.content,
        'priority': pud.priority
    }

    email.send_at = pud.created_at + datetime.timedelta(days=pud.notify_when)

    email.use_template_subject = True
    email.use_template_from = False
    email.send(fail_silently=False)

    if pud.need_repeat:
        if pud.repeat == 'Daily':
            email.send_at = email.send_at + datetime.timedelta(days=1)
        elif pud.repeat == 'Weekly':
            email.send_at = email.send_at + datetime.timedelta(weeks=1)
        email.send(fail_silently=False)

    response = email.mandrill_response[0]
    print response
    return response
    

def send_text_schedule(posts, start_date, end_date, email_address):
    content = 'Events from {0} to {1}:\n\n'.format(start_date.date().isoformat(), end_date.date().isoformat())
    for post in posts:
        when = post.day_of_week + ', ' + post.show_date
        if post.not_all_day:
            when = when + ' at ' + post.show_begin_time
        content = content + 'Event: {0}\nWhen: {1}\nWhere: {2}\n Description: {3}\n\n'.format(post.content, when, post.location_event, post.description_event)
        
    email = EmailMessage(subject='Your schedule from Kalendr', body=content, to=[email_address])
    email.send(fail_silently=False)
    response = email.mandrill_response[0]
    return response
    

def send_graphical_schedule(posts, start_date, end_date, email_address, username):
    s0 = r'\documentclass{article}\usepackage{fullpage}\usepackage{booktabs}\begin{document}\title{Kalendr Schedule}\author{'
    s1 = r'}\date{'
    s2 = r' -- '
    s3 = r'}\maketitle\section*{}\begin{tabular*}{\textwidth}{@{\extracolsep{\fill}}llllll}\toprule Date & Begin Time & End Time & Event & Description & Location \\\toprule '
    s4 = r'\\\bottomrule\end{tabular*}\end{document}'
    
    event_tex = ['{0}&{1}&{2}&{3}&{4}&{5}'.format(post.show_date, post.show_begin_time, post.show_end_time, post.content, post.description_event, post.location_event) for post in posts]
    
    content = s0 + username + s1 + start_date.strftime('%B %d, %Y') + s2 + end_date.strftime('%B %d, %Y') + s3 + r'\\\midrule '.join(event_tex) + s4
    
    f = open('email_schedule.tex', 'w')
    f.write(content)
    f.close()

    call('pdflatex email_schedule.tex', shell=True)
    
    email_address = 'ej48@duke.edu'
    email = EmailMessage(subject='Your schedule from Kalendr', to=[email_address])
    #email.attach_file('obama.gif')
    email.attach_file('email_schedule.pdf')
    email.send(fail_silently=False)
    response = email.mandrill_response[0]
    return response
    