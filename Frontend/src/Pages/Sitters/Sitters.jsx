import React from "react";
import './Sitters.css'
import MainHeader from '../../Components/MainHeader/MainHeader'
import Navbar from '../../Components/Navbar/Navbar'
import SitterCard from '../../Components/SitterCard/SitterCard'

const Sitters = () => {
    return (
        <>
            <div className="sitters-header-container">
                <MainHeader />
                <Navbar />
            </div>
            <div className="sitters-cards-container">
                <SitterCard />
                <SitterCard />
                <SitterCard />
                <SitterCard />
                <SitterCard />
                <SitterCard />
            </div>
        </>
    )
}

export default Sitters;