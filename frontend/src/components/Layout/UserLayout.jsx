import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
    {/* {Header} */}
    <Header/>
    {/* {Main Content} */}
    <main>
      {/* Renders the matching child route of a parent route or nothing if no child route matches */}
      <Outlet/>
    </main>
    
       {/* {Footer} */}
       <Footer/>

    </>
  )
}

export default UserLayout