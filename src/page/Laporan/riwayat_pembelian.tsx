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

    // Date Filter Storing State
    interface dateProps {
        date_from: string,
        date_to: string
    }
    const [dateFilter, setDateFilter] = useState<dateProps>({'date_from': '', 'date_to': ''})
    const [isFilter,setIsFilter] = useState<boolean>(false)

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

    const filterByDate = async () => {
        let tmp_filter_data:any = []
        await getDocs(RiwayatPembelianRef)
            .then(res => {
                setIsFilter(true)
                res.docs.map(doc => {
                    let convert_trans_id = moment(doc.data().kode_transaksi.split("#")[0]) // For Date Filter needs
                    let from = moment(dateFilter.date_from)
                    let to = moment(dateFilter.date_to)
                    if (convert_trans_id >= from && convert_trans_id <= to) {
                        tmp_filter_data = [...tmp_filter_data, doc.data()]
                    }
                })
            })
        setDataRiwayat(tmp_filter_data)
    }

    const clearFilterByDate = async () => {
        setIsFilter(true)
        let date_from_element:any = document.getElementById('date_from')
        let date_to_element:any = document.getElementById('date_to')
        date_from_element.value = null; date_to_element = null
        await setDateFilter((prev:dateProps) => ({
            ...prev,
            date_to: '',
            date_from: ''
        }))

        getRiwayatPembelian()
    }

    useEffect(() => {
        getRiwayatPembelian()
    },[])
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