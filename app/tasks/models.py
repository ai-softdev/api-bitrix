from sqlalchemy import Column, String, ForeignKey

from app.database import Base
from sqlalchemy.orm import relationship, declared_attr


class Tasks(Base):
    task_id = Column(String, nullable=False)

    def __str__(self):
        return f"{self.task_id}"





