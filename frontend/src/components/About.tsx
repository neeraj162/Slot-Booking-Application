import React from 'react';
import Navbar from './Navbar'
import '../css/about.css'
import { Link } from 'react-router-dom'

const logo =  require("../img/about.png");

const About = () => {
  return (
    <div className='about_back'>
        <Navbar/>
        <section className="about_comp">
            <div className="about_heading">
                <h2>About Us</h2>
            </div>
            <div className="about_container">
                <div className="about_content">
                    <h2>Welcome to AppointEase</h2>
                    <p>Your hassle-free appointment booking solution! We understand the importance of managing your time efficiently, and that's why we've created a seamless platform that lets you effortlessly schedule and manage your appointments.</p>
                    <Link to='/bookslot'><button className="about_button">Get started</button></Link>
                </div>
                <div className="about_image">
                    <img src={logo} alt="calendar buddy" />
                </div>
            </div>
        </section>

    </div>
  )
}

export default About    