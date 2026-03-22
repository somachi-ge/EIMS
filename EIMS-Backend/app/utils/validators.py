"""数据验证"""
import re


def validate_email(email: str) -> bool:
    """验证电子邮件地址"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> bool:
    """验证密码强度"""
    # 至少8个字符，包含字母和数字
    if len(password) < 8:
        return False
    if not re.search(r'[a-zA-Z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    return True


def validate_username(username: str) -> bool:
    """验证用户名"""
    # 3-50个字符，只包含字母、数字和下划线
    pattern = r'^[a-zA-Z0-9_]{3,50}$'
    return re.match(pattern, username) is not None
