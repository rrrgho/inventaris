import React, {FC, useEffect, useState} from 'react'
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import moment from "moment";
import transaksi from "../Transaksi";


const RiwayatPembelian: FC = () => {
    const RiwayatPembelianRef = collection(db, 'riwayat_pembelian')
    const [dataRiwayat, setDataRiwayat] = useState<any>([])
    const [itemTransaksi, setItemTransaksi] = useState<any>()
    const [transaksi, setTransaksi] = useState<any>()

    const getRiwayatPembelian = async () => {
        await getDocs(RiwayatPembelianRef)
            .then(res => {
                setDataRiwayat([...res.docs.map(doc => doc.data())])
            })
    }

    const getTransaksi = async (obj:any) => {
        const TransaksiRef = collection(db, 'transaksi', obj.kode_transaksi, 'item')
        await getDocs(TransaksiRef)
            .then((res) => {
                setItemTransaksi(res.docs.map(doc => doc.data() ))
                setTransaksi(obj)
            })

    }

    useEffect(() => {
        getRiwayatPembelian()
    },[])
    return (
        <div className="row">
            <div className="col-6 d-flex mt-5">
                <span className="mt-1" ><b>Lihat Berdasarkan</b></span>
                <button className="btn bg-white text-dark ms-5">Hari</button>
                <button className="btn btn-primary">Bulan</button>
            </div>
            <div className="col-6 d-flex mt-5">
                <span className="mt-1"><b>Periode</b></span>
                <button className="btn bg-white text-dark ms-5">Hari</button>
                <button className="btn btn-primary">Bulan</button>
            </div>

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
                            dataRiwayat.length > 0 &&
                            dataRiwayat.map((item:any) => {
                                return (
                                    <tr key={item.kode_transaksi}>
                                        <td>{moment(item.kode_transaksi.split('#')[0]).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>Rp. {item.total_harga_transaksi}</td>
                                        <td>
                                            <a onClick={() => {getTransaksi(item)}} href="#!"data-bs-toggle="modal" data-bs-target="#lihatRiwayatPembelian">Lihat</a>
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
                                    <b onClick={() => { console.log(transaksi) }}>Nama Pembeli</b>
                                </div>
                                <div className="col-6">
                                    <b>Tanggal Transaksi</b> <br/>
                                    {itemTransaksi && moment(itemTransaksi[0].item.tanggal_transaksi).format('MMMM Do YYYY')}
                                </div>
                                <div className="col-12 mt-4">
                                    <b>Keterangan</b>
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiwayatPembelian