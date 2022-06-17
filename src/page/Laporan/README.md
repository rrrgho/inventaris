<h1>Laporan Documentation</h1>
<h2>Note: Codes in daftar_piutang, riwayat_pembelian are having same explaination as Inventaris Documentation, read it extra care so that you can easily read those lines of code</h2>
<hr>

<h2> Hasil Penjualan </h2>
<li>There are 3 getDocs function just to get transactions data and all its items.
it happens because Transaction collection has more than 1 Node Collections, which literally means there is posiblity to include subcollection.
</li>
<li>We can't get items that easy in subcollection, so we need to get first collection first, and then after we get every ID on first collection, so we can use it to get items on subcollections, because to access all the things inside subcollections, we need to have
ID of parrent collections.</li>

<li>As mentioned above, Item and Harga can only be called when we get Parrent ID of collection, so this code is executed after first getDoc is completely work, see "THEN" on line 14.</li>



<h2>DATE FILTER</h2>
<li>Date filter uses 2 textfield with type "date" which literally represent date and hours in "Datepicker form" so
it makes user can easly pick the date that they want</li>
<li>The value of date input will be stored in state "dateFilter" which is including the object named "date_from" and "date_to" which literally means
"date_from" will represent the first date range choosen and vice versa.</li>
<li>The value that stored on "dateFilter" state which is represented by object "date_from" and "date_to" will be convert to readable date time supported by
moment.js and will be executed conditinaly following the date of data transaction.</li>
<li>When the DATE FILTER is triggered, request data from Firebase will only be executed as it is match with the condition required by date range represented by "date_from" and "date_to"</li>

