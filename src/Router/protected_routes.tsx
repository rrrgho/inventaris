import React, {FC} from 'react'
import {Navigate} from "react-router-dom";

interface Props{
    children: any
}

const ProtectedRoutes: FC<Props> = ({children}) => {
    return (
        <>
            {
                localStorage.getItem('auth') ?
                    children
                    :
                    <Navigate to={"login"} />
            }
        </>
    );
}

export default ProtectedRoutes