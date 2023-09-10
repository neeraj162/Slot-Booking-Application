import React from 'react'
import Navbar from './Navbar'
import '../css/home.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='home'>
         <Navbar/>

         <div className='home_body'>
            <div style={{paddingBottom: '40px'}}>
                <Link to='/appointments'><button className='home_button'>MY APPOINTMENTS</button></Link>
            
            </div>
           
            <Link to='/bookslot'><button className='home_button'>BOOK YOUR APPOINTMENT </button></Link>
         </div>
    </div>
  )
}

export default Home