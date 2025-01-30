import { Outlet } from "react-router-dom"
import MainHeader from "../MainHeader/MainHeader"
import Navbar from "../Navbar/Navbar"

const Layout = () => {
    return (
        <>
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout