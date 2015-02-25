from django.core.mail import EmailMessage


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