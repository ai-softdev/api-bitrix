import os
import shutil


from fastapi import APIRouter, Response, Depends, UploadFile, Form
from secrets import token_hex

from slugify import slugify

from app.exceptions import UserAlreadyExistsException, IncorrectEmailOrPassword
from app.users.auth import (
    get_hashed_password,
    verify_password,
    authenticate_user,
    create_access_token,
)
from app.users.dao import UsersDAO, RolesDAO
from app.users.dependencies import get_current_user
from app.users.models import User, Role
from app.users.schemas import SUserAuth,  SCurrentUser, SUserRegister

router = APIRouter(prefix="/auth", tags=["Авторизация"])


@router.post("/register")
async def register_user(user_data: SUserRegister, response: Response):
    existing_user = await UsersDAO.find_one_or_none(User.email == user_data.email)
    if existing_user:
        raise UserAlreadyExistsException
    hashed_password = get_hashed_password(user_data.password)
    role = await RolesDAO.find_one_or_fail(Role.name == 'user')
    user = await UsersDAO.create(email=user_data.email,
                                 hashed_password=hashed_password, role_id=role.id)
    access_token = create_access_token({"sub": str(user.id)})
    response.set_cookie("access_token", access_token, httponly=True)
    return {"status": 201, "detail": "register is successful", 'access_token': access_token, 'user': user}


@router.post("/login")
async def login(response: Response, user_data: SUserAuth):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorrectEmailOrPassword
    access_token = create_access_token({"sub": str(user.id)})
    response.set_cookie("access_token", access_token, httponly=True)

    return {'access_token': access_token, 'data': user}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"detail": "success"}


@router.get("/current-user")
async def current_user(user: User = Depends(get_current_user)) -> SCurrentUser:
    return user


@router.post('/change-password')
async def change_password(user: User = Depends(get_current_user), new_password: str = Form()):
    hashed_password = get_hashed_password(new_password)
    await UsersDAO.update(model_id=user.id, hashed_password=hashed_password)
    return {"detail": "change_password", 'status': 200}


@router.patch('/user')
async def update_user(
        avatar: UploadFile = None, fio: str = Form(), user: User = Depends(get_current_user)):
    file_name = token_hex(16)
    if avatar is not None:
        try:
            os.remove(path=f"{user.avatar}")
        except Exception as e:
            print(e)
        folders = f"media/users/{slugify(user.email)}/"
        path = f"{folders}{file_name}.webp"
        os.makedirs(os.path.dirname(folders), exist_ok=True)
        with open(path, "wb+") as file_object:
            shutil.copyfileobj(avatar.file, file_object)
            await UsersDAO.update(model_id=user.id, fio=fio, avatar=path)
            return {"detail": "changed user data", 'status': 200}
    else:
        await UsersDAO.update(model_id=user.id, fio=fio)
