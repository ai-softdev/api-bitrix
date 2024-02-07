from sqlalchemy import select, insert, delete, func

from app.database import async_session_maker
from app.exceptions import ModelNotFoundException


class BaseDAO:
    model = None

    @classmethod
    async def get_all(cls, filter=None):
        async with async_session_maker() as session:
            if filter is not None:
                query = select(cls.model).filter(filter)
            else:
                query = select(cls.model)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def paginate(cls, page: int, limit: int, filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter).limit(limit).offset((page - 1) * limit)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def count(cls, filter):
        async with async_session_maker() as session:
            query = select(func.count(cls.model.id)).filter(filter)
            result = await session.execute(query)
            return result.scalar()

    @classmethod
    async def find_one_or_none(cls, filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_fail(cls, filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter)
            result = await session.execute(query)
            result = result.scalar_one_or_none()
            if result is None:
                raise ModelNotFoundException
            return result

    @classmethod
    async def find_by_id(cls, model_id: int):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=model_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_by_id_or_fail(cls, model_id: int):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=model_id)
            result = await session.execute(query)
            result = result.scalar_one_or_none()
            if result is None:
                raise ModelNotFoundException
            return result

    @classmethod
    async def create(cls, **data):
        async with async_session_maker() as session:
            query = insert(cls.model).values(**data).returning(cls.model)
            res = await session.execute(query)
            await session.commit()
            return res.scalar()

    @classmethod
    async def first_or_create(cls, filter, **data):
        async with async_session_maker() as session:
            query = select(cls.model).filter(filter)
            result = await session.execute(query)
            result = result.scalar_one_or_none()
            if not result:
                result = await cls.create(**data)
            return result

    @classmethod
    async def update(cls, model_id, **data):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=model_id)
            result = await session.execute(query)
            result = result.scalar_one_or_none()
            for key, value in data.items():
                setattr(result, key, value) if value else None
            if not result:
                raise ModelNotFoundException
            await session.commit()
            return result

    @classmethod
    async def delete(cls, filter):
        async with async_session_maker() as session:
            query = delete(cls.model).filter(filter)
            await session.execute(query)
            await session.commit()
