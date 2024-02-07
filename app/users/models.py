
from sqlalchemy import Column,  String, ForeignKey

from app.database import Base
from sqlalchemy.orm import relationship


class Role(Base):
    name = Column(String, nullable=False)
    name_ru = Column(String, nullable=False)
    users = relationship("User", back_populates="role")

    def __str__(self):
        return f"{self.name_ru}"


class User(Base):
    email = Column(String, nullable=False, unique=True)
    avatar = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role_id = Column(ForeignKey("roles.id", ondelete="cascade"))
    role = relationship("Role", back_populates="users")

    def __str__(self):
        return f"{self.email}"
