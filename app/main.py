from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.admin.auth import authentication_backend
from app.admin.views import TasksAdmin
from app.bitrix import bx24
from app.database import engine
from app.tasks.dao import TasksDAO
from app.users.router import router as router_user

from sqladmin import Admin

app = FastAPI()
# app.include_router(router_user)


selected_fields = ['ID', 'PARENT_ID', 'TITLE', 'DESCRIPTION', 'DATE_START', 'END_DATE_PLAN', 'CREATED_DATE',
                   'CHANGED_DATE', 'CREATOR', 'RESPONSIBLE', 'AUDITORS', "AUDITORS_DATA", "ACCOMPLICES_DATA",
                   "PRIORITY", 'ACCOMPLICES', 'STATUS', 'DEADLINE']


def function(task):
    res = bx24.callMethod('tasks.task.list',  filter={"PARENT_ID": task.get('id')})
    task['children'] = res.get('tasks')
    return task


@app.get('/tasks')
async def get_all_task(page: int = 1, limit: int = 50):
    tasks_id = await TasksDAO.get_all()
    tasks_id = list(map(lambda x: x.task_id, tasks_id))
    res = bx24.callMethod('tasks.task.list', filter={"PARENT_ID": "0", "ID": tasks_id},
                          order={"ID": 'asc'}, start=(page - 1) * limit)
    res = list(map(function, res.get('tasks')))
    return res


# @app.get('/tasks/{id}')
# async def get_task_by_id(id: int, page: int = 1, limit: int = 50):
#     task = bx24.callMethod('tasks.task.get', taskId=id)
#     res = bx24.callMethod('tasks.task.list',  filter={"PARENT_ID": id}, start=(page - 1) * limit)
#     return {
#         'task': task,
#         'children': res
#     }


admin = Admin(app, engine=engine, authentication_backend=authentication_backend)
admin.add_view(TasksAdmin)
origins = [
    "http:localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
