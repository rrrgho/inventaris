import React, { FC, useEffect, useState } from "react";
import THEME from "../../theme";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from "../../firebase";
import AppCollections from "../../firebase/collection";
import { Link } from "react-router-dom";

const Supplier = () => {
    const customerCollectionRef = collection(db, AppCollections.supplier)
    const [supplierData, setSupplierData] = useState<any>()
    const [supplierDataInput, setSupplierDataInput] = useState<object>({
        name: "",
        phone: "",
        email: "",
        address: "",
    })
    const [toast, setToast] = useState<string>("")

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
        await addDoc(customerCollectionRef, supplierDataInput)
            .then(() => {
                successAdd()
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            })
    }


    const getSupplierData = async () => {
        await getDocs(customerCollectionRef)
            .then((res) => {
                setSupplierData(res.docs.map(doc => {
                    return [doc.data(), doc.id]
                })
                )
            })
    }

    useEffect(() => {
        getSupplierData()
    }, [])

    return (
        <THEME toast={toast} title={"Customer"} subtitle={"Manage customer dihalaman ini"}>
            <>
                <div className="row mt-5">
                    <div className="col-12">
                        <button className="btn btn-info float-end text-white theme-bg-blue" data-bs-toggle="modal" data-bs-target="#tambahCustomer">
                            <i className="fa fa-plus"></i> Tambah Supplier
                        </button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-light">
                                    <tr>
                                        <th onClick={() => { console.log(supplierData) }}>#</th>
                                        <th>Nama Supplier</th>
                                        <th>Handphone</th>
                                        <th>Alamat</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplierData && supplierData.map((item: any, idx: number) => {
                                        return (
                                            <tr key={item[1]}>
                                                <td>{idx + 1}</td>
                                                <td>{item[0].name}</td>
                                                <td>{item[0].phone}</td>
                                                <td>{item[0].email}</td>
                                                <td>{item[0].address}</td>
                                                <td>
                                                    <Link to={`/supplier/${item[1]}`}>
                                                        <button className="btn btn-success">
                                                            Detail
                                                        </button>
                                                    </Link>
                                                </td>
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
                                <h5 className="modal-title" id="exampleModalLabel">Tambah Supplier</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <form action="#" onSubmit={(e) => handleSubmit(e)}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <input type="text" placeholder="Nama Supplier" required className="form-control"
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="input-group mb-3 mt-4">
                                        <span className="input-group-text" id="basic-addon1">+62</span>
                                        <input type="number" className="form-control" placeholder="Nomor Hp" required aria-label="Username" aria-describedby="basic-addon1"
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    phone: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>

                                    <div className="input-group mb-3 mt-4">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                        <input type="email" className="form-control" placeholder="Email" required aria-label="Email" aria-describedby="basic-addon1"
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    email: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>

                                    <div className="input-group mt-4">
                                        <span className="input-group-text">Alamat</span>
                                        <textarea className="form-control" required aria-label="With textarea" defaultValue={""}
                                            onChange={(e) => {
                                                setSupplierDataInput((prev: object) => ({
                                                    ...prev,
                                                    address: e.target.value
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

export default Supplier