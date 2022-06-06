import React, {FC, useEffect, useState} from "react";
import THEME from "../../theme";

import {collection, getDocs, addDoc, doc, updateDoc, deleteDoc} from 'firebase/firestore'
import {db} from "../../firebase";

let dummy = require('./dummy.json')

const Inventaris: FC = () => {
    const inventarisCollectionRef = collection(db, 'Inventaris')
    const [inventaris, setInventaris] = useState<Array<object>>([])
    const [inventarisInput, setInventarisInput] = useState<object | any>({
        'nama_barang': '',
        'jumlah_barang': '',
        'harga_barang': '',
        'merek_barang': '',
        'nama_supplier': '',
        'kode_barang': '',
        'id' : ''
    })

    const clearInput = () => {
        setInventarisInput((prev:object) => ({
            ...prev,
            'nama_barang': '',
            'jumlah_barang': '',
            'harga_barang': '',
            'merek_barang': '',
            'nama_supplier': '',
            'kode_barang': '',
            'id' : ''
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


    const addInventaris = () => {
        new Promise( resolve => {
            resolve(
                addDoc(inventarisCollectionRef, inventarisInput)
                    .then((res) => {
                        clearInput()
                        getInventaris()
                    })
                    .catch(err => console.log(err))
            )
        })
    }



    const seeDetailInventaris = (obj:any) => {
        setInventarisInput((prev:object) => ({
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
        const InventarisCollection = doc(db, 'Inventaris', inventarisInput.id)
        new Promise(resolve => {
            resolve(
                updateDoc(InventarisCollection, inventarisInput)
                    .then(() => {
                        clearInput()
                        getInventaris()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            )
        })
    }



    const deleteInventaris = () => {
        const InventarisCollection = doc(db, 'Inventaris', inventarisInput.id)
        new Promise(resolve => {
            resolve(
                deleteDoc(InventarisCollection)
                    .then(() => {
                        clearInput()
                        getInventaris()
                    })
            )
        })
    }



    useEffect(() => {
        getInventaris()
    }, [])

    return (
        <THEME title={"Inventaris"} subtitle={"Lihat, edit dan kelola barang pada toko"}>
            <>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="row justify-content-between">
                            <div className="col-4">
                                <span onClick={() => {
                                    console.log(inventaris)
                                }}>Menampilkan {dummy.data.length} barang</span>
                            </div>
                            <div className="col-4">
                                <input className="form-control form-control-lg" type="text" placeholder="Cari barang"
                                       aria-label=".form-control-lg example"/>
                            </div>
                        </div>

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
                                        <th scope="col">Harga Barang</th>
                                        <th scope="col">Merek Barang</th>
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
                                                    <td>{data[0].kode_barang}</td>
                                                    <td>{data[0].jumlah_barang}</td>
                                                    <td>{data[0].harga_barang}</td>
                                                    <td>{data[0].merek_barang}</td>
                                                    <td>{data[0].nama_supplier}</td>
                                                    <td><a href="#!" onClick={() => {seeDetailInventaris(data[0])}} data-bs-toggle="modal"
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
                                    <div className="col-5">
                                        <label htmlFor="" className="form-label">Nama Barang</label>
                                        <input type="text" className="form-control" placeholder={"Nama Barang"}
                                            onChange={(e) => {
                                                setInventarisInput((prev:object) => ({
                                                    ...prev,
                                                    nama_barang: e.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="" className="form-label">Kode Barang</label>
                                        <input type="text" className="form-control" placeholder={"Kode"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
                                                       ...prev,
                                                       kode_barang: e.target.value
                                                   }))
                                               }}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="" className="form-label">Merek</label>
                                        <input type="text" className="form-control" placeholder={"Merek"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
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
                                        <input type="text" className="form-control" placeholder={"Nama Supplier"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
                                                       ...prev,
                                                       nama_supplier: e.target.value
                                                   }))
                                               }}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="" className="form-label">Harga</label>
                                        <input type="number" className="form-control" placeholder={"Harga"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
                                                       ...prev,
                                                       harga_barang: e.target.value
                                                   }))
                                               }}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4 justify-content-between">\
                                    <div className="col-6 d-flex">
                                        <span style={{width: 200, marginTop: 20}}>Jumlah Barang</span>
                                        <input style={{height: 50, marginTop: 10}} type="number"
                                               className="form-control" placeholder={"Jumlah Barang"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
                                                       ...prev,
                                                       jumlah_barang: e.target.value
                                                   }))
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => {addInventaris()}}>Save changes</button>
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
                                                   setInventarisInput((prev:object) => ({
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
                                                   setInventarisInput((prev:object) => ({
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
                                                   setInventarisInput((prev:object) => ({
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
                                                   setInventarisInput((prev:object) => ({
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
                                                   setInventarisInput((prev:object) => ({
                                                       ...prev,
                                                       harga_barang: e.target.value
                                                   }))
                                               }}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4 justify-content-between">\
                                    <div className="col-6 d-flex">
                                        <span style={{width: 200, marginTop: 20}}>Jumlah Barang</span>
                                        <input value={inventarisInput.jumlah_barang} style={{height: 50, marginTop: 10}} type="number"
                                               className="form-control" placeholder={"Jumlah Barang"}
                                               onChange={(e) => {
                                                   setInventarisInput((prev:object) => ({
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
                                <button type="button" onClick={() => {editInventaris()}} className="btn btn-primary">Simpan</button>
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
                                                <button type="button" className="btn btn-light" onClick={() => {deleteInventaris()}}>Hapus</button>
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