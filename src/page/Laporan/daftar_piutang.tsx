import React, {FC, useEffect, useState} from 'react'
import {collection, getDocs, doc, deleteDoc, addDoc} from "firebase/firestore";
import {db} from "../../firebase";
import moment from "moment";
import transaksi from "../Transaksi";


const DaftarPiutang: FC = () => {
    const DaftarPiutangRef = collection(db, 'daftar_piutang')
    const riwayatPembelianCollectionRef = collection(db, 'riwayat_pembelian')
    const [dataPiutang, setDataPiutang] = useState<any>([])
    const [itemTransaksi, setItemTransaksi] = useState<any>()
    const [transaksi, setTransaksi] = useState<any>()
    const [objectPiutangSelected, setObjectPiutangSelected] = useState<any>({
        id: ''
    })

    const getDaftarPiutang = async () => {
        await getDocs(DaftarPiutangRef)
            .then(res => {
                setDataPiutang([...res.docs.map(doc => [doc.data(), doc.id])])
            })
    }

    const setLunasPiutang = async () => {
        await addDoc(riwayatPembelianCollectionRef, {
            kode_transaksi: transaksi.kode_transaksi,
            nama_pembeli: transaksi.nama_pembeli,
            keterangan: transaksi.keterangan,
            total_harga_transaksi: transaksi.total_harga_transaksi
        }).then(() => {
            hapusPiutang()
        })
    }

    const hapusPiutang = async () => {
        const DaftarPiutangRef = doc(db, 'daftar_piutang', objectPiutangSelected.id)
        await deleteDoc(DaftarPiutangRef)
            .then((res) => {
                window.location.reload()
            })
    }

    const getTransaksi = async (obj:any) => {
        setObjectPiutangSelected((prev:any) => ({
            ...prev,
            id: obj.id
        }))
        const TransaksiRef = collection(db, 'transaksi', obj.kode_transaksi, 'item')
        await getDocs(TransaksiRef)
            .then((res) => {
                setItemTransaksi(res.docs.map(doc => doc.data() ))
                setTransaksi(obj)
            })

    }

    useEffect(() => {
        getDaftarPiutang()
    },[])
    return (
        <div className="row">

            <div className="col-12 mt-4">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Tanggal Transaksi</th>
                        <th>Total Harga</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        dataPiutang.length > 0 &&
                        dataPiutang.map((item:any) => {
                            item[0].id = item[1]
                            return (
                                <tr key={item[0].kode_transaksi}>
                                    <td>{moment(item[0].kode_transaksi.split('#')[0]).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    <td>Rp. {item[0].total_harga_transaksi}</td>
                                    <td>
                                        <a onClick={() => {getTransaksi(item[0])}} href="#!"data-bs-toggle="modal" data-bs-target="#lihatRiwayatPembelian">Lihat</a>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>


            {/* Modal Pop Up Lihat riwayat pembelian */}
            <div className="modal fade" id="lihatRiwayatPembelian" tabIndex={-1} aria-labelledby="lihatRiwayatPembelianLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header theme-bg-blue text-white">
                            <h5 className="modal-title" id="lihatRiwayatPembelianLabel">Riwayat Pembelian</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <b>Nama Pembeli</b> <br/>
                                    {transaksi && transaksi.nama_pembeli}
                                </div>
                                <div className="col-6">
                                    <b>Tanggal Transaksi</b> <br/>
                                    {itemTransaksi && moment(itemTransaksi[0].item.tanggal_transaksi).format('MMMM Do YYYY')}
                                </div>
                                <div className="col-12 mt-4">
                                    <b>Keterangan</b><br/>
                                    {transaksi && transaksi.keterangan}
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>Nama Barang</th>
                                            <th>Kode Barang</th>
                                            <th>Harga</th>
                                            <th>Stok</th>
                                            <th>Jumlah Beli</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            itemTransaksi &&
                                            itemTransaksi.map((item:any) => {
                                                return (
                                                    <tr key={item.item.kode_barang}>
                                                        <td>{item.item.nama_barang}</td>
                                                        <td>{item.item.kode_barang}</td>
                                                        <td>Rp. {item.item.harga_barang}</td>
                                                        <td>{item.item.jumlah_barang}</td>
                                                        <td>{item.item.jumlah_beli}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3>Total Harga : Rp. {transaksi && transaksi.total_harga_transaksi}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => {hapusPiutang()}} className="btn theme-bg-red text-white" >Hapus</button>
                            <button type="button" onClick={() => {setLunasPiutang()}} className="btn theme-bg-green text-white" >Lunas</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DaftarPiutang