import React, {FC} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Login from "../page/Auth";
import Inventaris from "../page/Inventaris";
import Transaksi from "../page/Transaksi";
import Laporan from "../page/Laporan";
import ProtectedRoutes from "./protected_routes";
import Admin from "../page/Admin";


const RouterPath = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={
                    <ProtectedRoutes>
                        <Inventaris/>
                    </ProtectedRoutes>
                }/>

                <Route path="transaksi" element={
                    <ProtectedRoutes>
                        <Transaksi/>
                    </ProtectedRoutes>
                }/>

                <Route path="laporan" element={
                    <ProtectedRoutes>
                        <Laporan/>
                    </ProtectedRoutes>
                }/>

                <Route path="admin" element={
                    <ProtectedRoutes>
                        <Admin/>
                    </ProtectedRoutes>
                }/>

                <Route path="login" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterPath