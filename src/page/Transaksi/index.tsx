import React, { FC, SetStateAction, useEffect, useState } from "react";
import THEME from "../../theme";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, setDoc, where } from 'firebase/firestore'
import { db } from "../../firebase";
import AppCollections from "../../firebase/collection";
import Generator from "../../firebase/idgenerator";

let dummy = require('../Inventaris/dummy.json')


const Transaksi: FC = () => {
    // Collection Initialization
    const inventarisCollectionRef = collection(db, AppCollections.inventaris)
    const customerCollectionRef = collection(db, AppCollections.customer)
    const transactionCollectionRef = collection(db, AppCollections.invoice_penjualan)
    const riwayatPembelianCollectionRef = collection(db, 'riwayat_pembelian')
    const daftarPiutangCollectionRef = collection(db, 'daftar_piutang');

    const [inventaris, setInventaris] = useState<Array<object>>([])
    const [customer, setCustomer] = useState<Array<object>>([])
    const [chart, setChart] = useState<Array<object>>([])
    const [total, setTotal] = useState<number>(0)
    const [totalManual, setTotalManual] = useState<number>(0)
    const [isInputManual, setIsInputManual] = useState<boolean>(false)
    const [toast, setToast] = useState<string>("")

    const [pembeliState, setPembeliState] = useState<any>({
        customer_id: "",
        status_pembayaran: "lunas"
    })

    // Filter
    const [filter, setFilter] = useState("")
    const [isFilter, setIsFilter] = useState(false)

    // State untuk Belum Lunas
    interface BelumLunasProps {
        nama_pembeli: string,
        keterangan: string
    }

    const [belumLunas, setBelumLunas] = useState<BelumLunasProps>({
        'nama_pembeli': '',
        'keterangan': '',
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
    const successDelete = (message: string) => {
        setToast(message ?? "delete")
        setTimeout(() => {
            setToast("")
        }, 3000)
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

    const getCustomer = () => {
        new Promise(resolve => {
            resolve(
                getDocs(customerCollectionRef).then(res => {
                    setCustomer(res.docs.map(doc => {
                        let data = doc.data()
                        data.id = doc.id
                        return data
                    }))
                })
            )
        })
    }

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

    const addToChart = (obj: object | any) => {
        obj.jumlah_beli = 1
        obj.tanggal_transaksi = new Date().toISOString()
        obj.harga_jual_barang = 0
        obj.total_harga = Number(obj.harga_jual_barang)
        var exists = chart.some((e: any) => e.id === obj.id)
        if (!exists) {
            setChart([...chart, obj])
            setTotal(total + Number(obj.harga_jual_barang))
        } else {
            setChart([...chart.filter(function (el: any) {
                return el.id != obj.id;
            })])
            setTotal(total + Number(obj.harga_jual_barang))
        }
    }

    const checkIfItemInChart = (item: object | any) => {
        return chart.some((e: any) => e.id === item.id)
    }

    const editItemHargaJualOnChartWhenCheckout = (item: any, value: string) => {
        let chartExist: any = chart
        for (let i = 0; i < chartExist.length; i++) {
            if (chartExist[i].id === item.id) {
                let tmp = total - (Number(chartExist[i].jumlah_beli) * Number(chartExist[i].harga_jual_barang))
                if (value.length != 0 && value != undefined && value !== "0" && value) {
                    chartExist[i].harga_jual_barang = Number(value);
                    chartExist[i].total_harga = Number(chartExist[i].harga_jual_barang) * Number(value)
                    tmp += Number(chartExist[i].jumlah_beli) * Number(value)
                } else {
                    chartExist[i].harga_jual_barang = 1;
                    chartExist[i].total_harga = Number(chartExist[i].harga_jual_barang)
                    tmp += Number(chartExist[i].harga_jual_barang)
                }
                setTotal(tmp)
                break
            }
        }
        setChart(chartExist)
    }

    const editItemOnChartWhenCheckout = (item: any, value: string) => {
        let chartExist: any = chart
        for (let i = 0; i < chartExist.length; i++) {
            if (chartExist[i].id === item.id) {
                let tmp = total - (Number(chartExist[i].jumlah_beli) * Number(chartExist[i].harga_jual_barang))
                if (value.length != 0 && value != undefined && value !== "0" && value) {
                    chartExist[i].jumlah_beli = value;
                    chartExist[i].total_harga = Number(chartExist[i].harga_jual_barang) * Number(value)
                    tmp += Number(chartExist[i].harga_jual_barang) * Number(value)
                } else {
                    chartExist[i].jumlah_beli = 1;
                    chartExist[i].total_harga = Number(chartExist[i].harga_jual_barang)
                    tmp += Number(chartExist[i].harga_jual_barang)
                }
                setTotal(tmp)
                break
            }
        }
        setChart(chartExist)
    }

    const deleteItemOnChartWhenCheckout = (item: object | any) => {
        let selected: any = chart.filter(function (el: any) {
            return el.id === item.id;
        })[0]
        setTotal(Number(total) - Number(selected.jumlah_beli * selected.harga_barang))

        setChart([...chart.filter(function (el: any) {
            return el.id != item.id;
        })])
    }

    const addTransaction = (status: string) => {
        const collection_id_generated = Generator.invoice_penjualan

        if (chart.length > 0) {
            setDoc(doc(db, `transaksi`, `${collection_id_generated}`), {
                doc_id: collection_id_generated,
                customer_id: pembeliState.customer_id,
                total_harga_transaksi: status === 'lunasManual' ? Number(totalManual) : Number(total),
                status: pembeliState.status_pembayaran
            }).then(() => {
                chart.map(async (item: object | any) => {
                    new Promise(resolve => {
                        resolve(
                            setDoc(doc(db, `transaksi/${collection_id_generated}/item`, `doc#${item.id}`), {
                                item
                            })
                            // .then(() => {
                            //     setDoc(doc(db, `transaksi/${collection_id_generated}/total_harga`, `doc#${collection_id_generated}`), {
                            //         total_harga_transaksi: status === 'lunasManual' ? Number(totalManual) : Number(total)
                            //     })
                            // })
                        )
                    })


                    const query_inventaris = query(inventarisCollectionRef, where("id", "==", item.id))
                    const querySnapshot = await getDocs(query_inventaris)
                    let existingData = querySnapshot.docs.map((data) => data.data())[0]
                    existingData.jumlah_barang = Number(existingData.jumlah_barang) - Number(item.jumlah_beli)
                    const InventarisCollection = doc(db, AppCollections.inventaris, querySnapshot.docs[0].id)
                    await updateDoc(InventarisCollection, existingData)
                })

                successAdd()
                setTimeout(() => {
                    window.location.reload()
                }, 500)

                // if (status === 'lunas' || status === 'lunasManual') {
                //     new Promise(resolve => {
                //         resolve(
                //             addDoc(riwayatPembelianCollectionRef, {
                //                 kode_transaksi: collection_id_generated,
                //                 nama_pembeli: '',
                //                 total_harga_transaksi: status === 'lunasManual' ? Number(totalManual) : Number(total)
                //             }).then(() => {
                //                 window.location.reload()
                //             })
                //         )
                //     })
                // }

                // if (status === 'belumLunas') {
                //     new Promise(resolve => {
                //         resolve(
                //             addDoc(daftarPiutangCollectionRef, {
                //                 kode_transaksi: collection_id_generated,
                //                 nama_pembeli: belumLunas.nama_pembeli,
                //                 keterangan: belumLunas.keterangan,
                //                 total_harga_transaksi: Number(total)
                //             }).then(() => {
                //                 window.location.reload()
                //             })
                //         )
                //     })
                // }
            })


        }
    }

    useEffect(() => {
        getInventaris()
        getCustomer()
    }, [])

    return (
        <THEME toast={toast} title={"Tansaksi"} subtitle={"Hitung total pembelian barang"}>
            <>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="row justify-content-between">
                            <div className="col-4">
                                <span>Menampilkan {inventaris.length} barang</span> <br />
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
                                                        <td>
                                                            {data[0].jumlah_barang > 0 ?
                                                                <input type="checkbox" checked={checkIfItemInChart(data[0])}
                                                                    onChange={() => {
                                                                        addToChart(data[0])
                                                                    }} /> :
                                                                <span className="text-danger">Stok Habis</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    {
                        chart.length > 0 ?
                            <div className="d-grid">
                                <button className="btn btn-primary" type="button" data-bs-toggle="modal"
                                    data-bs-target="#modalCheckout">Bayar
                                </button>
                            </div> :
                            <div className="d-grid">
                                <button className="btn btn-primary" type="button" onClick={() => {successDelete("Anda belum memilih barang apapun")}}>Bayar
                                </button>
                            </div>
                    }
                </div>


                {/* Modal Checkout */}
                <div className="modal fade" id="modalCheckout" tabIndex={-1} aria-labelledby="modalCheckoutLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary">
                                <h5 className="modal-title text-white" id="exampleModalLabel">Bayar</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Barang</th>
                                                <th>Harga Beli</th>
                                                <th>Stok</th>
                                                <th>Harga Jual</th>
                                                <th>Jumlah Beli</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                chart.length > 0 ?
                                                    chart.map((item: any) => {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td>{item.nama_barang}</td>
                                                                <td>{item.harga_barang}</td>
                                                                <td className="text-center">{item.jumlah_barang}</td>
                                                                <td>
                                                                    <input type="number" required
                                                                        placeholder={"Harga Jual anda"}
                                                                        onChange={(e) => {
                                                                            editItemHargaJualOnChartWhenCheckout(item, e.target.value)
                                                                        }} className="form-control" />
                                                                </td>
                                                                <td>
                                                                    <input type="text"
                                                                        placeholder={"Default will be 1 item"}
                                                                        onChange={(e) => {
                                                                            if (Number(e.target.value) > Number(item.jumlah_barang)) {
                                                                                editItemOnChartWhenCheckout(item, item.jumlah_barang)
                                                                            } else {
                                                                                editItemOnChartWhenCheckout(item, e.target.value)
                                                                            }
                                                                        }} className="form-control" />
                                                                </td>
                                                                <td className="text-center pointer"><i
                                                                    className="fa fa-trash" onClick={() => {
                                                                        deleteItemOnChartWhenCheckout(item)
                                                                    }}></i></td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan={6}><span>Belum ada item yang dipilih, silahkan pilih item !</span>
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-body" id="myGroup">
                                <div className="row">
                                    <div className="col-12">
                                        <select name="" id="" className="form-control" onChange={(e) => {
                                            setPembeliState((prev: object) => ({
                                                ...prev,
                                                customer_id: e.target.value
                                            }))
                                        }}>
                                            <option value="" hidden>Pilih Customer</option>
                                            {
                                                customer && customer.map((item: any) => {
                                                    return (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-7" onClick={() => { console.log(pembeliState) }}>
                                        <h3>Total Harga : Rp. {total}</h3>
                                    </div>
                                    <div className="col-5">
                                        <label htmlFor="">Status Pembayaran : </label>
                                        <select name="" id="" className="form-control" onChange={(e) => {
                                            setPembeliState((prev: object) => ({
                                                ...prev,
                                                status_pembayaran: e.target.value
                                            }))
                                        }}>
                                            <option value="lunas">Lunas</option>
                                            <option value="hutang">Hutang</option>
                                        </select>
                                    </div>
                                    {
                                        !isInputManual &&
                                        <div className="col-12 mt-4">
                                            <button onClick={() => { addTransaction("lunas") }} className="btn float-end text-white btn-info">Submit Data Penjualan</button>
                                        </div>
                                    }
                                    <div className="col-12">
                                        <div className="row">
                                            {/* <div className="col-6 d-grid">
                                                <button type="button" className="btn btn-success" data-parent="#myGroup"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#konfirmasiLunas">
                                                    Lunas
                                                </button>
                                            </div> */}
                                            <div className="col-4 d-grid">
                                                <button type="button" onClick={() => { setIsInputManual(true) }} className="btn btn-success" data-parent="#myGroup"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#inputManual">
                                                    Input Harga Manual
                                                </button>
                                            </div>
                                        </div>
                                        {/* <div className="row mt-1">
                                            <div className="col-6 d-grid">
                                                <button type="button" className="btn btn-danger" data-parent="#myGroup"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#belumLunas">
                                                    Belum Lunas
                                                </button>
                                            </div>
                                            <div className="col-6 d-grid">
                                                <button type="button" className="btn btn-danger">
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-12 p-5 accordion-group">

                                        {/* Konfirmasu Lunas */}
                                        {/* <div className="collapse" id="konfirmasiLunas">
                                            <div className="card card-body theme-bg-green text-white">
                                                <h2>Konfirmasi Lunas ?</h2>
                                                <h5>Pembelian akan dianggap telah dibayar lunas</h5>

                                                <div className="col text-end">
                                                    <button type="button" className="btn btn-primary me-2"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#konfirmasiHapus">Batal
                                                    </button>
                                                    <button type="button" className="btn btn-light" onClick={() => {
                                                        addTransaction("lunas")
                                                    }}>Lunas
                                                    </button>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* Input Manual */}
                                        <div className="collapse" id="inputManual">
                                            <div className="card card-body">
                                                <h2>Input Manual ?</h2>
                                                <h5>Input nominal pembayaran secara manual</h5>

                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    setIsInputManual(true)
                                                    addTransaction('lunasManual')
                                                }}>
                                                    <div className="form-group">
                                                        <input required={true} type="number" className="form-control"
                                                            defaultValue={Number(total)}
                                                            onChange={(e: SetStateAction<any>) => {
                                                                setTotalManual(e.target.value)
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="col text-end mt-3">
                                                        <button type="button" className="btn btn-danger me-2"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#inputManual" onClick={() => {
                                                                setIsInputManual(false)
                                                            }}>Batal

                                                        </button>
                                                        <button type="submit" className="btn btn-primary">Submit Data Penjualan dengan Harga Manual
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>


                                        {/* Belum Lunas */}
                                        <div className="collapse" id="belumLunas">
                                            <div className="card card-body">
                                                <h2>Input Manual ?</h2>
                                                <h5>Input nominal pembayaran secara manual</h5>

                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    addTransaction('belumLunas')
                                                }}>
                                                    <div className="form-group">
                                                        <input required={true} type="text" className="form-control"
                                                            onChange={(e: SetStateAction<any>) => {
                                                                setBelumLunas((prev: BelumLunasProps) => ({
                                                                    ...prev,
                                                                    nama_pembeli: e.target.value
                                                                }))
                                                            }}
                                                            placeholder="Nama Pembeli"
                                                        />
                                                    </div>

                                                    <div className="form-group mt-3">
                                                        <textarea required={true} className="form-control"
                                                            onChange={(e: SetStateAction<any>) => {
                                                                setBelumLunas((prev: BelumLunasProps) => ({
                                                                    ...prev,
                                                                    keterangan: e.target.value
                                                                }))
                                                            }}
                                                            placeholder="Keterangan"
                                                        />
                                                    </div>

                                                    <div className="col text-end mt-3">
                                                        <button type="button" className="btn btn-primary me-2"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#belumLunas">Batal

                                                        </button>
                                                        <button type="submit" className="btn btn-primary">Simpan
                                                        </button>
                                                    </div>
                                                </form>
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
export default Transaksi
