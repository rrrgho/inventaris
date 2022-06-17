<h1>Inventaris Documentation</h1>

<h2>Success Add, Success Update, Success Delete functions</h2>
<li>These functions will trigger Toast planted on Theme Component, 
which the toast component on Theme.tsx will be fired with following string sent "success","update","delete". </li>
<li>In this case, string status to trigger toast is stored on state named <b>"toast"</b> which literally means, this state will be changed automaticaly
following which action is triggered</li>
<li>setToast() function belongs to change status value on <b>toast</b> state, which is it will be depends on what success function is being called</li>


<h2>Clear input function</h2>
<li>This function will clear all state after every actions, so when user is heading to do an action, for instance User wants to update the data, the state <b>userInput</b> will be fulfilled with
data that user send from the Inventaris Form, after this action or either the action success or not, this state needs to be cleared and set as default</li>

<h2>Get Inventaris Function</h2>
<li>This function is called whenever a changes detected on google firebase
and this function also use for get Inventaris Data on "Inventaris" collection, this function behaviour is Asynchronous, so we use Promise as typescript is really friendly with this method</li>

<h2>See Detail Inventaris</h2>
<li>This function will be called whenever user click "Lihat detail" on web, we will fulfilled <b>"inventarisInput"</b> state
in order to fill all the form that appear on screen, which literally means, this state also use to store data of user input before it sends to Google Firestore</li>


<h2>Edit Inventaris, Delete Inventaris functions</h2>
<li>This function using Post method of firebase which we get those from firestore SDK,
we use <b>updateDoc</b> to update, <b>deleteDoc</b> to delete, initialize the collectionRef in order to differentiate which collection that we are atualy heading</li>


<h2>useEffect()</h2>
<li>This will recycle react Lifecycle, which this function will be executed as per page in load right from the very begining
. Every function inside this function will be executed earlier when the page is rendered</li>