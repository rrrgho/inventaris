import React, {FC} from 'react'
import THEME from "../../theme";

const Admin: FC = () => {
    return (
        <THEME title={"Admin"} subtitle={"Kelola Data Toko"}>
            <div className="row">
                <div className="col-12 mt-5">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" role="button"
                           aria-expanded="false" aria-controls="collapseExample">
                            Ganti Password
                        </a>
                    </p>
                    <div className="collapse" id="collapseExample">
                        <div className="card card-body">
                            Some placeholder content for the collapse component. This panel is hidden by default but
                            revealed when the user activates the relevant trigger.
                        </div>
                    </div>
                </div>
            </div>
        </THEME>
    )
}

export default Admin