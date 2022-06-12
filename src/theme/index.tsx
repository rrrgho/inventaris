import React, {FC} from "react";
import {Link, useLocation} from 'react-router-dom';
import './theme.css'


interface Props {
    children: React.ReactElement,
    title: string,
    subtitle: string,
    toast?: string
}

const THEME: FC<Props> = ({children, title, subtitle, toast}) => {
    const Route = useLocation()

    const Logout = async () => {
        await localStorage.removeItem('auth')
        window.location.href = "/login"
    }
    return (
        <>
            <div className="row justify-content-between">
                <div className="col-2 theme-sidebar theme-bg-blue">
                    <div className="theme-top-sidebar">
                        <Link to="/">
                            <div
                                className={`theme-sidebar-menu ${Route.pathname === '/' ? 'theme-sidebar-menu-active' : ''} mt-2`}>
                                <i className="fa fa-box"></i>
                                <span className="ms-3">Inventaris</span>
                            </div>
                        </Link>
                        <Link to="/transaksi">
                            <div
                                className={`theme-sidebar-menu ${Route.pathname === '/transaksi' ? 'theme-sidebar-menu-active' : ''} mt-2`}>
                                <i className="fa fa-calculator"></i>
                                <span className="ms-3">Transaksi</span>
                            </div>
                        </Link>
                        <Link to="/laporan">
                            <div
                                className={`theme-sidebar-menu ${Route.pathname === '/laporan' ? 'theme-sidebar-menu-active' : ''} mt-2`}>
                                <i className="fa fa-file"></i>
                                <span className="ms-3">Laporan</span>
                            </div>
                        </Link>
                    </div>
                    <div className="theme-bottom-sidebar">
                        <Link to="/admin">
                            <div
                                className={`theme-sidebar-menu ${Route.pathname === '/admin' ? 'theme-sidebar-menu-active' : ''} mt-2`}>
                                <i className="fa fa-user"></i>
                                <span className="ms-3">Admin</span>
                            </div>
                        </Link>
                        <div className="theme-sidebar-menu mt-2" onClick={() => {
                            Logout()
                        }}>
                            <i className="fa fa-sign-out"></i>
                            <span className="ms-3">Log Out</span>
                        </div>
                    </div>
                </div>
                <div className="col-10 p-5">
                    <div className="row mt-5">
                        <div className="col-12 theme-title">
                            {title}
                        </div>
                        <div className="col-12 theme-subtitle">
                            {subtitle}
                        </div>
                        <div className="col-12">
                            <a href="">Baca Panduan</a>
                        </div>
                    </div>
                    {children}
                </div>
            </div>


            {
                toast !== "" &&
                toast === "update" &&
                <div className="toast-update">
                    <i className="fa fa-check"></i>
                    <span className="ms-2">Berhasil diupdate</span>
                </div>

            }
            {
                toast !== "" &&
                toast === "success" &&
                <div className="toast-tambah">
                    <i className="fa fa-check"></i>
                    <span className="ms-2">Berhasil ditambahkan</span>
                </div>


            }
            {
                toast !== "" &&
                toast === "delete" &&
                <div className="toast-hapus">
                    <i className="fa fa-check"></i>
                    <span className="ms-2">Berhasil dihapus</span>
                </div>

            }
        </>
    )
}

export default THEME