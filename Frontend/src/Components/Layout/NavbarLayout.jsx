import { Outlet } from "react-router-dom"
import Navbar from "../Navbar/Navbar"

const NavbarLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default NavbarLayout