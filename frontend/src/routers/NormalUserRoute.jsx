// import { Navigate, Outlet } from "react-router-dom";

// import { useContext } from "react";

// import React from 'react'
// import { AuthContext } from "../auth/authProvider";

// export default function NormalUserRoute() {
//     const { user, loading } = useContext(AuthContext)

//     if(loading) return <>Loading</>

//     if(!user) return <Navigate to="/login" />
//     if(user.role !== "normal") return <Navigate to="/" /> 

//     return <Outlet/>
// }