import React, { FC, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import THEME from "../../theme";
import { useLocation } from 'react-router-dom'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import AppCollections from "../../firebase/collection";
import { db } from "../../firebase";

const SupplierDetail: FC = () => {
    const supplierBarangRef = collection(db, AppCollections.supplier_barang)
    const location = useLocation()
    const supplierID = location.pathname.split("/")[2]
    const [toast, setToast] = useState<string>("")
    const [barang, setBarang] = useState<object | any>()

    const [supplierDataInput, setSupplierDataInput] = useState<object>({
        supplier_id: supplierID,
        name: "",
        harga_beli: "",
        tanggal_beli: new Date(),
    })

    const successAdd = () => {
        setToast("success")
        setTimeout(() => {
            setToast("")
        }, 3000)
    }

    const successUpdate = () => {
        setToast("update")
        setTimeout(() => {
            setToast("")
        }, 3000)
    }
    const successDelete = () => {
        setToast("delete")
        setTimeout(() => {
            setToast("")
        }, 3000)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        await addDoc(supplierBarangRef, supplierDataInput)
            .then(() => {
                successAdd()
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            })
    }

    const getSupplierBarang = async () => {
        const query_inventaris = query(supplierBarangRef, where("supplier_id", "==", supplierID))
        const querySnapshot = await getDocs(query_inventaris)
        setBarang(querySnapshot.docs.map((doc) => {
            return [doc.data(), doc.id]
        }))
    }

    useEffect(() => {
        getSupplierBarang()
    }, [])
    return (
        <THEME toast={toast} title={"Supplier Detail Barang"} subtitle={"Tambah barang yang dijual customer"}>
            <>
                <div className="row mt-5">
                    <div className="col-12">
                        <button className="btn btn-info float-end text-white theme-bg-blue" data-bs-toggle="modal" data-bs-target="#tambahCustomer">
                            <i className="fa fa-plus"></i> Tambah Supplier Barang
                        </button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-light">
                                    <tr>
                                        <th onClick={() => {console.log(barang)}}>#</th>
                                        <th>Nama Barang</th>
                                        <th>Harga Beli</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {barang && barang.map((item:any, idx:number) => {
                                        return (
                                            <tr key={item[1]}>
                                                <td>{idx + 1}</td>
                                                <td>{item[0].name}</td>
                                                <td>{item[0].harga_beli}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="tambahCustomer" tabIndex={-1} aria-labelledby="tambahCustomerLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Tambah Barang</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <form action="#" onSubmit={(e) => handleSubmit(e)}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <input type="text" placeholder="Nama Barang" required className="form-control"
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="input-group mb-3 mt-4">
                                        <span className="input-group-text" id="basic-addon1">Rp</span>
                                        <input type="number" className="form-control" placeholder="Harga Barang" required aria-label="Username" aria-describedby="basic-addon1"
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    harga_beli: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </THEME>
    )
}

export default SupplierDetail