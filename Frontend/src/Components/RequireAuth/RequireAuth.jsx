import { useLocation, Navigate, Outlet } from "react-router"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth()
    const location = useLocation()

    return (
        // auth?.role?.find(role => allowedRoles?.includes(role))
        allowedRoles?.includes(auth?.role)
            ? <Outlet />
            : auth?.userId
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/authentication/login" state={{ from: location }} replace />
    )
}

export default RequireAuth