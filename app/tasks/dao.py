

from app.dao.base import BaseDAO
from app.tasks.models import Tasks


class TasksDAO(BaseDAO):
    model = Tasks
