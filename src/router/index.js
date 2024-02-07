import Main from "../pages/Main.jsx";
import Page404 from "../pages/Page404.jsx";
import ChartPage from "../pages/ChartPage.jsx";

export const routes= [
    {
        path: '/',
        component: Main
    },
    {
        path: '/chart/:id',
        component: ChartPage,
    },
    {
        path: '/not-found',
        component: Page404,
    }
]