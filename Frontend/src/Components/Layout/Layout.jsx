import { Outlet } from "react-router-dom"
import MainHeader from "../MainHeader/MainHeader"

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