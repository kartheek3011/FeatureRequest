# Core App Template tags

from django import template
from django.conf import settings
from django.core.files.storage import default_storage
from django.utils.timezone import is_aware, utc
from django.utils.html import avoid_wrapping
from django.utils.translation import pgettext, ugettext as _, ungettext
from django.utils.translation import ungettext_lazy
import calendar
import datetime
import pytz
import time
import re
import json
import os

register = template.Library()

@register.filter
def filter_status(features, status):
    return features.filter(status=status)


@register.filter
def extract_from_json(data):
    try:
        return json.loads(data)
    except:
        return ""


@register.filter
def flat_json(data):
    try:
        json_data = []
        for feature in data:
            json_data.append({'name': str(feature.get("name").replace("'", "")), 'weight': feature.get("weight")})
        return json.dumps(json_data)
    except:
        return data


@register.filter
def get_filename(filename):
    return os.path.splitext(filename)[0]


@register.filter
def json_dump(data):
    try:
        return json.dumps(data)
    except:
        return data


@register.filter
def json_loads(data):
    try:
        a = json.loads(data)
        return json.loads(data)
    except:
        return data


@register.filter
def multiply(a, b):
    return a * b


@register.filter
def percent(a, b):
    a = (float(len(a)) / len(b)) * 100
    return int(a)


@register.filter
def keys(data):
    return data.keys()


@register.filter
def dict_value(data, key):
    return data[key]


@register.filter
def get_media_url(name):
    return default_storage.url(name)


@register.filter
def all_user_ids(thanks):
    try:
        return [thank.get("profile").get("pk", 0) for thank in thanks]
    except AttributeError:
        return [thank.get("profile") for thank in thanks]


@register.filter
def convert_links(text):
    url_re = re.compile(r'((?<!<a href=[\',\"])http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)')
    if re.search(url_re, text):
        return re.sub(url_re, r"<a href='\1' target=\"_blank\">\1</a>", text)
    if text.find("<a href") >= 0:
        return text.replace("<a", "<a target=\"_blank\"" )
    else:
        return text


@register.filter
def string_to_datetime(date_time_string):
    try:
        date_time_object = datetime.datetime.strptime(date_time_string, '%Y-%m-%dT%H:%M:%S.%fZ')
        timezone_ = pytz.timezone(settings.TIME_ZONE)
        if is_aware(date_time_object):
            date_time_object = date_time_object.astimezone(timezone_)
        else:
            date_time_object = date_time_object.replace(tzinfo=pytz.utc).astimezone(timezone_)
        return date_time_object
    except Exception as e:
        print e
        return date_time_string


@register.filter
def string_to_timestamp(date_time_string):
    timezone_ = pytz.timezone(settings.TIME_ZONE)
    try:
        date_time_object = datetime.datetime.strptime(date_time_string, '%Y-%m-%dT%H:%M:%S.%fZ')
        if is_aware(date_time_object):
            date_time_object = date_time_object.astimezone(timezone_)
        else:
            date_time_object = date_time_object.replace(tzinfo=pytz.utc).astimezone(timezone_)
        timestamp = time.mktime(date_time_object.timetuple()) + date_time_object.microsecond/1e6
        return timestamp
    except Exception as e:
        print e
        return date_time_string


@register.filter
def feed_category_name(feed):
    return feed


TIMESINCE_CHUNKS = (
    (60 * 60 * 24 * 365, ungettext_lazy('%d year', '%d years')),
    (60 * 60 * 24 * 30, ungettext_lazy('%d month', '%d months')),
    (60 * 60 * 24 * 7, ungettext_lazy('%d week', '%d weeks')),
    (60 * 60 * 24, ungettext_lazy('%d day', '%d days')),
    (60 * 60, ungettext_lazy('%d hour', '%d hours')),
    (60, ungettext_lazy('%d minute', '%d minutes'))
)


def timesince(d, now=None, reversed=False):
    """
    Takes two datetime objects and returns the time between d and now
    as a nicely formatted string, e.g. "10 minutes".  If d occurs after now,
    then "0 minutes" is returned.
    Units used are years, months, weeks, days, hours, and minutes.
    Seconds and microseconds are ignored.  Up to one adjacent unit will be
    displayed.  For example, "2 weeks" and "1 year" are
    possible outputs.
    """
    # Convert datetime.date to datetime.datetime for comparison.
    if not isinstance(d, datetime.datetime):
        d = datetime.datetime(d.year, d.month, d.day)
    if now and not isinstance(now, datetime.datetime):
        now = datetime.datetime(now.year, now.month, now.day)

    if not now:
        now = datetime.datetime.now(utc if is_aware(d) else None)

    delta = (d - now) if reversed else (now - d)

    # Deal with leapyears by subtracing the number of leapdays
    delta -= datetime.timedelta(calendar.leapdays(d.year, now.year))

    # ignore microseconds
    since = delta.days * 24 * 60 * 60 + delta.seconds
    if since <= 0:
        # d is in the future compared to now, stop processing.
        return avoid_wrapping(_('0 minutes'))
    for i, (seconds, name) in enumerate(TIMESINCE_CHUNKS):
        count = since // seconds
        if count != 0:
            break
    result = avoid_wrapping(name % count)
    return result

@register.filter
def natural_time(value):
    """
    For date and time values shows how many seconds, minutes or hours ago
    compared to current timestamp returns representing string.
    """
    if not isinstance(value, datetime.date):  # datetime is a subclass of date
        return value

    now = datetime.datetime.now(utc if is_aware(value) else None)
    if value < now:
        delta = now - value
        if delta.days != 0:
            return pgettext(
                'natural_time', '%(delta)s ago'
            ) % {'delta': timesince(value, now)}
        elif delta.seconds == 0:
            return _('now')
        elif delta.seconds < 60:
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'a second ago', '%(count)s seconds ago', delta.seconds
            ) % {'count': delta.seconds}
        elif delta.seconds // 60 < 60:
            count = delta.seconds // 60
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'a minute ago', '%(count)s minutes ago', count
            ) % {'count': count}
        else:
            count = delta.seconds // 60 // 60
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'an hour ago', '%(count)s hours ago', count
            ) % {'count': count}
    else:
        delta = value - now
        if delta.days != 0:
            return pgettext(
                'natural_time', '%(delta)s from now'
            ) % {'delta': timesince(value, now, reversed=True)}
        elif delta.seconds == 0:
            return _('now')
        elif delta.seconds < 60:
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'a second from now', '%(count)s seconds from now', delta.seconds
            ) % {'count': delta.seconds}
        elif delta.seconds // 60 < 60:
            count = delta.seconds // 60
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'a minute from now', '%(count)s minutes from now', count
            ) % {'count': count}
        else:
            count = delta.seconds // 60 // 60
            return ungettext(
                # Translators: please keep a non-breaking space (U+00A0)
                # between count and time unit.
                'an hour from now', '%(count)s hours from now', count
            ) % {'count': count}

@register.filter
def split_value(value):
    print value
    try:
        return value.split(',')
    except:
        return value

@register.filter
def users_list(profiles):
    links_list = ["<a target='_blank' href='/user_details/" + str(user.blocked_profile.pk) + "'>" + user.blocked_profile.user.first_name + " " + user.blocked_profile.user.last_name + "</a>"
                  for user in profiles]
    return ", ".join(links_list)

@register.filter
def common_interests(interests, suggestion_interests):
    try:
        interests = interests.split(",")
        suggestion_interests = suggestion_interests.split(",")
    except:
        return []
    if not interests or not suggestion_interests:
        return []

    return set(interests).intersection(set(suggestion_interests))


@register.filter
def show_condition(classifier):
    if classifier.get("f1_score"):
            if classifier.get("f1_score") > 0.7:
                return True
            else:
                return False
    elif classifier.get("accuracy"):
        if classifier.get("accuracy") > 0.7:
            return True
        else:
            return False
    else:
        return False
