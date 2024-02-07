from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.users.models import User, Role


class UsersDAO(BaseDAO):
    model = User
    @classmethod
    async def find_one_or_none(cls, filter):
        async with async_session_maker() as session:
            query = select(cls.model).options(joinedload(cls.model.role)).filter(filter)
            result = await session.execute(query)
            return result.scalar_one_or_none()
    @classmethod
    async def get_all(cls, filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter).options(joinedload(cls.model.role))
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def paginate(cls, page: int, limit: int, filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter).limit(limit).offset((page - 1) * limit).options(joinedload(
                cls.model.role))
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def find_by_id(cls, model_id: int):
        async with (async_session_maker() as session):
            query = select(cls.model).filter_by(id=model_id
                                                        ).options(joinedload(cls.model.role))
            result = await session.execute(query)
            result = result.unique().scalar()
            return result



class RolesDAO(BaseDAO):
    model = Role
