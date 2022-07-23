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
import Customer from "../page/Customer";
import Supplier from "../page/Supplier";
import SupplierDetail from "../page/SupplierDetail";


const RouterPath = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={
                    <ProtectedRoutes>
                        <Inventaris/>
                    </ProtectedRoutes>
                }/>

                <Route path="customer" element={
                    <ProtectedRoutes>
                        <Customer/>
                    </ProtectedRoutes>
                }/>

                <Route path="supplier" element={
                    <ProtectedRoutes>
                        <Supplier/>
                    </ProtectedRoutes>
                }/>

                <Route path="supplier/:slug" element={
                    <ProtectedRoutes>
                        <SupplierDetail/>
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