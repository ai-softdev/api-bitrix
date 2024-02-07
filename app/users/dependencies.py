from datetime import datetime

from fastapi import Request, Depends
from jose import jwt, JWTError

from app.config import settings
from app.exceptions import (
    TokenExpiredException,
    IncorrectTokenException,
    UserIsNotPresentException, UserIsNotAdminException
)
from app.users.dao import UsersDAO


def get_token(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        token = request.headers.get("Authorization")
        if not token:
            raise IncorrectTokenException
    return token


async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.KEY, settings.ALGORITHM)
    except JWTError:
        raise IncorrectTokenException
    expire: str = payload.get("exp")
    if (not expire) or (int(expire) < datetime.utcnow().timestamp()):
        raise TokenExpiredException
    user_id: str = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException
    user = await UsersDAO.find_by_id(int(user_id))
    if not user:
        raise UserIsNotPresentException
    return user


async def get_admin(
        user=Depends(get_current_user),
        token=None
):
    if token is None:
        if user.role.name != 'admin':
            raise UserIsNotAdminException
        return user
    else:
        user = await get_current_user(token)
        if user.role.name != 'admin':
            raise UserIsNotAdminException
        return user

