import React, {FC, useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import {Navigate} from "react-router-dom";

const Login:FC =  () => {
    const AdminCollectionRef = collection(db, 'admin')
    const [inProcess, setInProcess] = useState<boolean>(false)
    const [wrongPassword, setWrongPassword] = useState<boolean>(false)

    interface UserInputProps{
        password: string
    }
    const [userInput, setUserInput] = useState<UserInputProps>({password:""})

    const clearProcess = () => {
        setUserInput((prev:UserInputProps) => ({
            ...prev,
            password: ""
        }))
        setInProcess(false)
    }

    const loginFailed = () => {
        setWrongPassword(true)
        setInProcess(false)
        setTimeout(() => {
            setWrongPassword(false)
        },2000)
    }


    useEffect(() => {
        if(localStorage.getItem('auth'))
            window.location.href = '/'
    },[])


    const handleLogin = async () => {
        setInProcess(true)
        let success = false
        await getDocs(AdminCollectionRef)
            .then((res:any) => {
                res.docs.map((doc:any) => {
                    if(doc.data().password === userInput.password){
                        success = true
                        localStorage.setItem("auth", doc.data().password)
                        window.location.href = "/"
                        return
                    }
                })
            })

        if(success)
            return
        else
            loginFailed()

    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-6 vh-100 text-center justify-content-center align-items-center d-flex">
                        <div className="theme-auth-title">Masuk</div>
                    </div>
                    <div className="col-6 vh-100">
                        <div className="row justify-content-center">
                            <div className="col-7" style={{marginTop:'45vh'}}>
                                <div className="form-group">
                                    {
                                        wrongPassword && <label htmlFor="" className="text-danger">Password Salah</label>
                                    }
                                    <input type="password" placeholder="password" className="form-control mt-2"
                                        onChange={(e) => {
                                            setUserInput((prev:UserInputProps) => ({
                                                ...prev,
                                                password: e.target.value
                                            }))
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary text-white float-end mt-2" onClick={() => { handleLogin() }}>
                                        {inProcess ? "Loading ..." : "Masuk"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login