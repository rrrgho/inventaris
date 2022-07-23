import React, {FC, useState} from 'react'
import THEME from "../../theme";
import HasilPenjualan from "./hasil_penjualan";
import RiwayatPembelian from "./riwayat_pembelian";
import DaftarPiutang from "./daftar_piutang";

const Laporan: FC = () => {
    const [buttonActive, setButtonActive] = useState<string>("HASIL PENJUALAN")

    const ComponentWillBeMount = () => {
        switch (buttonActive) {
            case "HASIL PENJUALAN":
                return <HasilPenjualan />
            case "RIWAYAT PEMBELIAN":
                return <RiwayatPembelian />
            case "DAFTAR PIUTANG":
                return <DaftarPiutang />
            default:
                return <HasilPenjualan />
        }

    }

    return (
        <THEME title={"Laporan"} subtitle={"Lihat hasil penjualan, riwayat pembelian, dan daftar piutang"}>
            <div className="row">
                <div className="col-12 text-end border-bottom p-3">
                    <button onClick={() => {setButtonActive('HASIL PENJUALAN')}} className={`btn ${buttonActive === 'HASIL PENJUALAN' ? 'btn-dark' : 'btn-primary'} ms-2`}>Hasil Penjualan</button>
                    <button onClick={() => {setButtonActive('RIWAYAT PEMBELIAN')}} className={`btn ${buttonActive === 'RIWAYAT PEMBELIAN' ? 'btn-dark' : 'btn-primary'} ms-2`}>Riwayat Pembelian</button>
                    <button onClick={() => {setButtonActive('DAFTAR PIUTANG')}} className={`btn ${buttonActive === 'DAFTAR PIUTANG' ? 'btn-dark' : 'btn-primary'} ms-2`}>Daftar Piutang</button>
                </div>
                <div className="col-12">
                    {
                        <ComponentWillBeMount />
                    }
                </div>
            </div>
        </THEME>
    )
}

export default Laporan