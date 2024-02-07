import asyncio

from sqlalchemy import and_

from app.users.auth import get_hashed_password
from app.users.dao import RolesDAO, UsersDAO
from app.users.models import Role


async def seed():
    user_role = await RolesDAO.first_or_create(
        filter=and_(Role.name == "user", Role.name_ru == "пользователь"),
        name="user",
        name_ru="пользователь")
    admin_role = await RolesDAO.first_or_create(
        filter=and_(Role.name == "admin", Role.name_ru == "администратор"), name="admin",
        name_ru="администратор")
    admin = await UsersDAO.create(email="admin@admin.com",
                                  hashed_password=get_hashed_password("12345678_tmhujeji"), role_id=admin_role.id)


asyncio.run(seed())
