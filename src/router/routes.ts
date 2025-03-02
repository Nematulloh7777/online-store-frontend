import CreateEditProduct from "../pages/CreateEditProduct";
import DetailsCard from "../pages/DetailsCard";
import Favorites from "../pages/Favorites";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import ProfileUser from "../pages/ProfileUser";
import Register from "../pages/Register";

export const allRoutes = [
    {path: '/', component: Home},
    {path: '/favorites', component: Favorites},
    {path: '/create-product', component: CreateEditProduct},
    {path: '/edit-product/:id', component: CreateEditProduct},
    {path: '/details-product/:id', component: DetailsCard},
    {path: '/settings/profile', component: ProfileUser},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '*', component: NotFoundPage},
]