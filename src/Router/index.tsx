import React, {FC} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from "../App";
import Login from "../page/Auth";
import Inventaris from "../page/Inventaris";
import Transaksi from "../page/Transaksi";


const RouterPath = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inventaris/>}/>
                <Route path="transaksi" element={<Transaksi/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterPath