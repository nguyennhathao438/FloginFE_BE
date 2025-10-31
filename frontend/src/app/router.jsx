import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import DefaultLayout from "../layouts/DefaultLayout";
import Dashboard from "../components/Dashboard";
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
    ],
    }
])

export default router;