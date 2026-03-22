"""辅助函数"""
import uuid
from datetime import datetime


def generate_request_id() -> str:
    """生成请求ID"""
    return str(uuid.uuid4())


def format_datetime(dt: datetime) -> str:
    """格式化日期时间"""
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def sanitize_input(input_str: str) -> str:
    """清理输入字符串"""
    # 这里可以添加输入清理逻辑，防止SQL注入等安全问题
    return input_str.strip()
