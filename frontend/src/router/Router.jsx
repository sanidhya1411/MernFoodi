import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import Signup from "../components/Signup";
import Order from "../pages/dashboard/Order";
import PrivateRoute from "../PrivateRoute/PrivateRouter";
import UserProfile from "../pages/dashboard/UserProfile";
import CartPage from "../pages/shop/CartPage";
import Login from "../components/Login";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import Payment from "../pages/shop/Payment"
import AllOrders from "../pages/dashboard/admin/AllOrders"
import ManageOrders from "../pages/dashboard/admin/ManageOrders"


const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/menu",
          element: <Menu/>
        },
        {
          path: "/order",
          element:<PrivateRoute><Order/></PrivateRoute>
        },
        {
          path: "/update-profile",
          element: <UserProfile/>
        },
        {
          path: "/cart-page",
          element: <CartPage/>
        },
        {
          path: "/process-checkout",
          element:<Payment/>
        }
      ]
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: 'dashboard',
      element: <DashboardLayout/>,
      children: [
        {
          path: '',
          element: <Dashboard/>
        },
        {
          path: 'users', 
          element: <Users/>
        },
        {
          path: 'add-menu',
          element: <AddMenu/>
        }, 
        {
          path: "manage-items",
          element: <ManageItems/>
        },
        {
          path: "update-menu/:id",
          element: <UpdateMenu/>,
          loader: ({params}) => fetch(`http://localhost:3000/menu/${params.id}`)
        },
        {
          path: "orders",
          element:<AllOrders/>
        },
        {
          path: "manage-orders",
          element:<ManageOrders/>
        }
      ]
    }
  ]);

  export default router;