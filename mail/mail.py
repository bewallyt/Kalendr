from django.core.mail import EmailMessage
import datetime


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