import React, {FC, useEffect, useRef, useState} from 'react'
import {collection, getDocs, getDoc, doc, getDocsFromServer, query, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import moment from "moment";

const HasilPenjualan: FC = () => {
    const transactionCollectionRef = collection(db, 'transaksi')
    const [total, setTotal] = useState(0)
    const [terjual, setTerjual] = useState(0)
    const pendapatan: any = useRef(0)
    const soldRef: any = useRef(0)

    // Date Filter Storing State
    interface dateProps {
        date_from: string,
        date_to: string
    }
    const [dateFilter, setDateFilter] = useState<dateProps>({'date_from': '', 'date_to': ''})
    const [isFilter,setIsFilter] = useState<boolean>(false)

    const getDataTransaction = async () => {
        await getDocs(transactionCollectionRef)
            .then(res => {
                pendapatan.current = 0
                soldRef.current = 0

                let transaction_id = res.docs.map(doc => doc.id)
                transaction_id.map(async (trans_id: any) => {
                    let refHarga = collection(db, "transaksi", `${trans_id}`, 'total_harga')
                    let refItem = collection(db, "transaksi", `${trans_id}`, 'item')
                    getDocs(refHarga)
                        .then((res) => {
                            pendapatan.current += Number(res.docs.map(doc => doc.data().total_harga_transaksi))
                            setTotal(pendapatan.current)
                        })

                    getDocs(refItem)
                        .then((res) => {
                            res.docs.map(doc => {
                                soldRef.current += Number(doc.data().item.jumlah_beli)
                            })
                            setTerjual(soldRef.current)
                        })
                })
            })
    }

    const filterByDate = async () => {

        if (dateFilter.date_from.length > 0 && dateFilter.date_to.length > 0) {
            setIsFilter(true)
            pendapatan.current = 0
            soldRef.current = 0
            await getDocs(transactionCollectionRef)
                .then(res => {
                    let transaction_id = res.docs.map(doc => doc.id)
                    transaction_id.map(async (trans_id: any) => {
                        let convert_trans_id = moment(trans_id.split("#")[0]) // For Date Filter needs
                        let from = moment(dateFilter.date_from)
                        let to = moment(dateFilter.date_to)
                        let refHarga = collection(db, "transaksi", `${trans_id}`, 'total_harga')
                        let refItem = collection(db, "transaksi", `${trans_id}`, 'item')

                        if (convert_trans_id >= from && convert_trans_id <= to) {
                            getDocs(refHarga)
                                .then((res) => {
                                    pendapatan.current += Number(res.docs.map(doc => doc.data().total_harga_transaksi))
                                    setTotal(pendapatan.current)
                                })

                            getDocs(refItem)
                                .then((res) => {
                                    res.docs.map(doc => {
                                        soldRef.current += Number(doc.data().item.jumlah_beli)
                                    })
                                    setTerjual(soldRef.current)
                                })
                        }
                    })
                })
        }
    }

    const clearFilterByDate = async () => {
        setIsFilter(true)
        let date_from_element:any = document.getElementById('date_from')
        let date_to_element:any = document.getElementById('date_to')
        date_from_element.value = null
        date_to_element = null
        await setDateFilter((prev:dateProps) => ({
            ...prev,
            date_to: '',
            date_from: ''
        }))

        getDataTransaction()
    }


    useEffect(() => {
        getDataTransaction()
    }, [])
    return (
        <div className="row">
            <div className="col-5 d-flex mt-5">
                <span className="mt-1"><b>Lihat Berdasarkan</b></span>
                <button className="btn bg-white text-dark ms-5">Semua</button>
                <button className="btn btn-primary">Berdasarkan Tanggal</button>
            </div>
            <div className="col-7 d-flex mt-5">
                <div className="form-group ms-3">
                    <label htmlFor="">Dari Tanggal : </label>
                    <input id="date_from" className="ms-3 form-input" type="datetime-local"
                           onChange={(e) => {
                               setDateFilter((prev: dateProps) => ({
                                   ...prev,
                                   date_from: e.target.value
                               }))
                           }}
                    />
                </div>
                <div className="form-group ms-3">
                    <label htmlFor="">Ke Tanggal : </label>
                    <input id="date_to" defaultValue={dateFilter.date_to} className="ms-3 form-input" type="datetime-local"
                           onChange={(e) => {
                               setDateFilter((prev: dateProps) => ({
                                   ...prev,
                                   date_to: e.target.value
                               }))
                           }}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-warning ms-1" style={{marginTop: -5}} onClick={() => {
                        filterByDate()
                    }}>Apply Filter
                    </button>
                </div>
            </div>
            {
                isFilter &&
                <div className="col-12">
                    <div className="alert alert-info mt-3 alert-dismissible fade show" role="alert">
                        Menampilkan hasil dari
                        tanggal <b> {moment(dateFilter.date_from).format('MMMM Do YYYY')} </b> to <b>{moment(dateFilter.date_to).format('MMMM Do YYYY')} </b>
                        <button onClick={() => {clearFilterByDate()}} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>

            }

            <div className="col-12 mt-3">
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td onClick={() => {
                            console.log(pendapatan.current)
                        }}>Total pendapatan :
                        </td>
                        <td>Rp. {total}</td>
                    </tr>
                    <tr>
                        <td>Total barang terjual :</td>
                        <td>{terjual} Barang Terjual</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HasilPenjualan