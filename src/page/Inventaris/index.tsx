import React, { FC, useEffect, useState } from "react";
import THEME from "../../theme";

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, setDoc } from 'firebase/firestore'
import { db } from "../../firebase";
import AppCollections from "../../firebase/collection";
import Generator from "../../firebase/idgenerator";

let dummy = require('./dummy.json')

const Inventaris: FC = () => {
    const inventarisCollectionRef = collection(db, AppCollections.inventaris)
    const invoicePembelianRef = collection(db, AppCollections.invoice_pembelian)
    const invoicePembelianItemRef = collection(db, AppCollections.invoice_pembelian_item)
    const customerCollectionRef = collection(db, AppCollections.supplier)
    const [inventaris, setInventaris] = useState<Array<object>>([])
    const [toast, setToast] = useState<string>("")
    const [supplierData, setSupplierData] = useState<any>()
    const supplierBarangRef = collection(db, AppCollections.supplier_barang)
    const [barang, setBarang] = useState<object | any>()
    const [inventarisInput, setInventarisInput] = useState<object | any>({
        'nama_barang': '',
        'jumlah_barang': '',
        'harga_barang': '',
        'merek_barang': '',
        'nama_supplier': '',
        'kode_barang': '',
        'id': ''
    })

    const [invoicePembelian, setInvoiePembelian] = useState<object | any>({
        supplier_id: "",
        total_pembelian: 0,
        tanggal_invoice: new Date()
    })

    const [barangDibeli, setBarangDibeli] = useState<any>([])

    // Filter
    const [filter, setFilter] = useState("")
    const [isFilter, setIsFilter] = useState(false)


    const searchInventaris = async () => {
        setIsFilter(true)
        const query_inventaris = query(inventarisCollectionRef, where("kode_barang", "==", filter))
        const querySnapshot = await getDocs(query_inventaris)
        let search_result: any = []
        querySnapshot.forEach((doc) => {
            search_result = [...search_result, [doc.data(), doc.id]]
        });
        setInventaris(search_result)
    }

    const removeSearch = () => {
        let filter_input = document.getElementById('filter_input')
        setFilter("")
        setIsFilter(false)
        getInventaris()
        // @ts-ignore
        filter_input.value = ""
    }

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

    const clearInput = () => {
        setInventarisInput((prev: object) => ({
            ...prev,
            'nama_barang': '',
            'jumlah_barang': '',
            'harga_barang': '',
            'merek_barang': '',
            'nama_supplier': '',
            'kode_barang': '',
            'id': ''
        }))
    }


    const getInventaris = () => {
        new Promise(resolve => {
            resolve(
                getDocs(inventarisCollectionRef).then(res => {
                    setInventaris(res.docs.map(doc => {
                        return [doc.data(), doc.id]
                    }))
                })
            )
        })
    }


    const addInventaris = async () => {

        let InvoiceID = Generator.invoice_pembelian
        await setDoc(doc(db, AppCollections.invoice_pembelian, InvoiceID), invoicePembelian)

        barangDibeli.map(async (item:any) => {
            const query_inventaris = query(inventarisCollectionRef, where("id", "==", item.id))
            const querySnapshot = await getDocs(query_inventaris)
            if(querySnapshot.docs.length !== 0){
                let existingData = querySnapshot.docs.map((data) => data.data())[0]
                let newDataAddToNewInvoiceItem = querySnapshot.docs.map((data) => data.data())[0]
                existingData.jumlah_barang = Number(existingData.jumlah_barang) + Number(item.jumlah_beli)
                newDataAddToNewInvoiceItem.jumlah_barang = Number(item.jumlah_barang)
                const InventarisCollection = doc(db, AppCollections.inventaris, querySnapshot.docs[0].id)
                console.log(existingData)
                await updateDoc(InventarisCollection, existingData)
                await addDoc(invoicePembelianItemRef, newDataAddToNewInvoiceItem)
            }else{
                let supplier = supplierData.filter((supplier_list:any) => supplier_list[1] === item.supplier_id)[0][0].name ?? ""
                const data = {                
                    'id': item.id,
                    'invoice_id': InvoiceID,
                    'nama_barang': item.name,
                    'jumlah_barang': item.jumlah_beli,
                    'harga_barang': item.harga_beli,
                    'supplier_id': item.supplier_id,
                    'supplier': supplier,
                }
                await setDoc(doc(db, AppCollections.inventaris, `${item.id}`), data)
                await addDoc(invoicePembelianItemRef, data)
            }
        })
        successAdd()
        setTimeout(() => {
            window.location.reload()
        },500)
    }



    const seeDetailInventaris = (obj: any) => {
        setInventarisInput((prev: object) => ({
            ...prev,
            'id': obj.id,
            'nama_barang': obj.nama_barang,
            'jumlah_barang': obj.jumlah_barang,
            'harga_barang': obj.harga_barang,
            'merek_barang': obj.merek_barang,
            'nama_supplier': obj.nama_supplier,
            'kode_barang': obj.kode_barang,
        }))
    }

    const editInventaris = () => {
        const InventarisCollection = doc(db, AppCollections.inventaris, inventarisInput.id)
        new Promise(resolve => {
            resolve(
                updateDoc(InventarisCollection, inventarisInput)
                    .then(() => {
                        clearInput()
                        getInventaris()
                        successUpdate()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            )
        })
    }



    const deleteInventaris = () => {
        const InventarisCollection = doc(db, AppCollections.inventaris, inventarisInput.id)
        new Promise(resolve => {
            resolve(
                deleteDoc(InventarisCollection)
                    .then(() => {
                        clearInput()
                        getInventaris()
                        successDelete()
                    })
            )
        })
    }

    // Supplier =====================================================================
    const getSupplierData = async () => {
        await getDocs(customerCollectionRef)
            .then((res) => {
                setSupplierData(res.docs.map(doc => {
                    return [doc.data(), doc.id]
                })
                )
            })
    }

    const getSupplierBarang = async (supplierID: string) => {
        const query_inventaris = query(supplierBarangRef, where("supplier_id", "==", supplierID))
        const querySnapshot = await getDocs(query_inventaris)
        setBarang(querySnapshot.docs.map((doc) => {
            return [doc.data(), doc.id]
        }))
        setBarangDibeli([])
        setInvoiePembelian((prev: any) => ({
            ...prev,
            supplier_id: supplierID,
        }))
    }




    useEffect(() => {
        getInventaris()
        getSupplierData()
    }, [])

    return (
        <THEME toast={toast} title={"Inventaris"} subtitle={"Lihat, edit dan kelola barang pada toko"}>
            <>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="row justify-content-between">
                            <div className="col-4">
                                <span onClick={() => {console.log(inventaris)}}>Menampilkan {inventaris.length} barang</span> <br />
                            </div>
                            <div className="col-4 d-flex">
                                <input id="filter_input" className="form-control form-control-lg" type="text"
                                    placeholder="Cari berdasarkan kode barang"
                                    aria-label=".form-control-lg example"
                                    onChange={(e) => {
                                        setFilter(e.target.value)
                                    }}
                                    defaultValue={filter}
                                />
                                <button onClick={() => {
                                    searchInventaris()
                                }} className="btn btn-primary text-white ms-2"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        {
                            isFilter &&
                            <div className="row mt-3">
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    Menampilkan hasil pencarian untuk kode barang
                                    <strong className="ms-2">{filter}</strong>
                                    <button
                                        onClick={() => {
                                            removeSearch()
                                        }}
                                        type="button" className="btn-close" data-bs-dismiss="alert"
                                        aria-label="Close"></button>
                                </div>
                            </div>
                        }

                        {/* Table menampilkan Data */}
                        <div className="row mt-3">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Nama Barang</th>
                                            <th scope="col">Kode Barang</th>
                                            <th scope="col">Jumlah Barang</th>
                                            <th scope="col">Harga Beli Barang</th>
                                            <th scope="col">Nama Supplier</th>
                                            <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            inventaris.length > 0 && inventaris.map((data: any, idx) => {
                                                data[0].id = data[1]
                                                return (
                                                    <tr key={data[0].id}>
                                                        <td>{idx + 1}</td>
                                                        <td>{data[0].nama_barang}</td>
                                                        <td>{data[0].id}</td>
                                                        <td>{data[0].jumlah_barang}</td>
                                                        <td>{data[0].harga_barang}</td>
                                                        <td>{data[0].supplier}</td>
                                                        <td><a href="#!" onClick={() => { seeDetailInventaris(data[0]) }} data-bs-toggle="modal"
                                                            data-bs-target="#modalDetailBarang">Lihat Detail</a></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {/* Element Click Tambah Barang */}
                        <div className="row justify-content-center">
                            <div className="col-2">
                                <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">Tambah barang ...</a>
                            </div>
                        </div>
                    </div>
                </div>


                {/*  Modal Tambah Barang  */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header theme-bg-blue text-white">
                                <h5 className="modal-title" id="exampleModalLabel">Tambah Barang</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12">
                                        <select onChange={(e) => { getSupplierBarang(e.target.value) }} name="" id="" className="form-control">
                                            <option value="" hidden>Pilih Supplier</option>
                                            {
                                                supplierData && supplierData.map((item: any, idx: number) => {
                                                    return (
                                                        <option key={item[1]} value={item[1]}>{item[0].name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    {barang &&
                                        barang.map((item: any, idx: number) => {
                                            return (
                                                <div key={item[1]} className="row mt-2">
                                                    <div className="col-8">
                                                        <div className="form-check form-switch">
                                                            <i className="fa fa-box me-3"></i>
                                                            <label onClick={() => { console.log(barangDibeli) }} className="form-check-label" htmlFor="flexSwitchCheckChecked">{item[0].name} | Rp. {item[0].harga_beli}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <input type="number" name="" id="" className="form-control" placeholder="Jumlah Beli"
                                                            onChange={(e) => {
                                                                let prevState = barangDibeli.filter((dataPrev: any) => dataPrev.id != item[1])
                                                                let thisPrevBarangSet = barangDibeli.filter((dataPrev: any) => dataPrev.id === item[1])
                                                                let newItem = item[0]
                                                                newItem.id = item[1]
                                                                newItem.jumlah_beli = e.target.value
                                                                newItem.total_bayar = Number(e.target.value) * Number(item[0].harga_beli)
                                                                if (e.target.value !== "0" && e.target.value !== "" && e.target.value !== undefined && Number(e.target.value) > 0) {
                                                                    console.log("sas")
                                                                    setBarangDibeli([...prevState, newItem])
                                                                    setInvoiePembelian((prev: object) => ({
                                                                        ...prev,
                                                                        total_pembelian: newItem.total_bayar + invoicePembelian.total_pembelian
                                                                    }))
                                                                } else {
                                                                    setBarangDibeli([...prevState])
                                                                    let total_pembayaran_setelah_item_dikurangi = 0
                                                                    prevState.map((dataPrev: any) => {
                                                                        total_pembayaran_setelah_item_dikurangi += Number(dataPrev.total_bayar)
                                                                    })
                                                                    setInvoiePembelian((prev: object) => ({
                                                                        ...prev,
                                                                        total_pembelian: total_pembayaran_setelah_item_dikurangi
                                                                    }))
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="row mt-3">
                                    <div className="col-6"></div>
                                    <div className="col-6">
                                        <div className="alert alert-success float-end">
                                            Total pembelian barang : <b>Rp. {invoicePembelian.total_pembelian}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => { addInventaris() }}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>


                {/*  Modal Detail Barang  */}
                <div className="modal fade" id="modalDetailBarang" tabIndex={-1}
                    aria-labelledby="modalDetailBarangLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header theme-bg-blue text-white">
                                <h5 className="modal-title" id="exampleModalLabel">Detail Barang</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-5">
                                        <label htmlFor="" className="form-label">Nama Barang</label>
                                        <input value={inventarisInput.nama_barang} type="text" className="form-control" placeholder={"Nama Barang"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    nama_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="" className="form-label">Kode Barang</label>
                                        <input value={inventarisInput.kode_barang} type="text" className="form-control" placeholder={"Kode"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    kerek_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="" className="form-label">Merek</label>
                                        <input value={inventarisInput.merek_barang} type="text" className="form-control" placeholder={"Merek"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    merek_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-4">
                                        <label htmlFor="" className="form-label">Nama Supplier</label>
                                        <input value={inventarisInput.nama_supplier} type="text" className="form-control" placeholder={"Nama Supplier"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    nama_supplier: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="" className="form-label">Harga</label>
                                        <input value={inventarisInput.harga_barang} type="number" className="form-control" placeholder={"Harga"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    harga_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4 justify-content-between">\
                                    <div className="col-6 d-flex">
                                        <span style={{ width: 200, marginTop: 20 }}>Jumlah Barang</span>
                                        <input value={inventarisInput.jumlah_barang} style={{ height: 50, marginTop: 10 }} type="number"
                                            className="form-control" placeholder={"Jumlah Barang"}
                                            onChange={(e) => {
                                                setInventarisInput((prev: object) => ({
                                                    ...prev,
                                                    jumlah_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-toggle="collapse"
                                    data-bs-target="#konfirmasiHapus">Hapus
                                </button>
                                <button type="button" onClick={() => { editInventaris() }} className="btn btn-primary">Simpan</button>
                            </div>
                            <div className="row">
                                <div className="col-12 p-5">
                                    <div className="collapse" id="konfirmasiHapus">
                                        <div className="card card-body theme-bg-red text-white">
                                            Data yang sudah dihapus tidak dapat dikembalikan

                                            <div className="col text-end">
                                                <button type="button" className="btn btn-primary me-2"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#konfirmasiHapus">Batal
                                                </button>
                                                <button type="button" className="btn btn-light" onClick={() => { deleteInventaris() }}>Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </THEME>
    )
}

export default Inventaris
