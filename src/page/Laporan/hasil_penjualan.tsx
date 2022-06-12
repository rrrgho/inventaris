import React, {FC, useEffect, useRef, useState} from 'react'
import {collection, getDocs, getDoc, doc, getDocsFromServer, query, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";

const HasilPenjualan: FC = () => {
    const transactionCollectionRef = collection(db, 'transaksi')
    const [total, setTotal] = useState(0)
    const [terjual, setTerjual] = useState(0)
    const pendapatan: any = useRef(0)
    const soldRef: any = useRef(0)

    const getDataTransaction = async () => {
        await getDocs(transactionCollectionRef)
            .then(res => {
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


    useEffect(() => {
        getDataTransaction()
    }, [])
    return (
        <div className="row">
            <div className="col-6 d-flex mt-5">
                <span className="mt-1"><b>Lihat Berdasarkan</b></span>
                <button className="btn bg-white text-dark ms-5">Hari</button>
                <button className="btn btn-primary">Bulan</button>
            </div>
            <div className="col-6 d-flex mt-5">
                <span className="mt-1"><b>Periode</b></span>
                <button className="btn bg-white text-dark ms-5">Hari</button>
                <button className="btn btn-primary">Bulan</button>
            </div>

            <div className="col-12 mt-3">
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td onClick={() => {console.log(pendapatan.current)}}>Total pendapatan :</td>
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