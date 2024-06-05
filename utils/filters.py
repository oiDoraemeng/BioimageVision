from datetime import datetime
def datetime_format(value,format='%Y年%m月%d日 %H:%M'):
    return value.strftime(format)


def Msgdatetime_format(value, format='%m月%d日 %H:%M'):
    """
    格式化日期时间，根据日期显示相对时间（如昨天，前天，一周前等）
    :param value: datetime对象
    :param format: 默认格式化字符串
    :return: 格式化后的日期字符串
    """
    now = datetime.now()
    if isinstance(value, str):
        value = datetime.strptime(value, "%Y/%m/%d %H:%M:%S")

    delta = now - value

    if delta.days == 0:
        return value.strftime('%H:%M')
        return '昨天 '
    elif delta.days == 2:
        return '前天 '
    elif delta.days < 7:
        return '{}天前 '.format(delta.days)
    elif delta.days > 7:
        return value.strftime('%H:%M')
    else:
        return value.strftime(format)