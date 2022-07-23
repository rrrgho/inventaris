const Generator = {
    invoice_pembelian: "INV" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
    invoice_penjualan: new Date().toISOString() + '#' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
}

export default Generator