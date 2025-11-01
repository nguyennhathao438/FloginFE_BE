import { createBrowserRouter } from "react-router-dom";
import Login from "./Login";
import DefaultLayout from "./DefaultLayout";
import Dashboard from "./Dashboard";
import ProductAdd from "./ProductAdd";
const router = createBrowserRouter([
    {
    path: "/",
    element: <DefaultLayout />,
    children: [
        { 
            path: "login", 
            element: <Login />
        },
        { 
            path: "dashboard",
            element: <Dashboard />
        },
        {
            path: "add",
            element: <ProductAdd/>
        },
    ],
    }
])

export default router;