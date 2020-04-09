import React from 'react';
import twitter from '../../assets/twitter.svg'
import instagram from '../../assets/instagram.svg'
import email from '../../assets/email.svg'


function Credits(props)  {
	return (
		<div className="credits" style={{height: `${props.dialogHeight}px`}}>
			<div className='text'>
				<p style={{color: '#FF2D55'}}>Who is on the other end?</p> 
				<p>Bot or Not is a chat interface meant to act as a Turing test experience for chatbots. We conceived of this because ____.</p> 			
				   
				<p>We are grateful to the Mozilla Foundation for their support of this project with a Creative Media Award in 2019. (Thank all our contacts there?).  This project as conceived and executed by FOREIGN OBJECTS, a Design and Research studio engaged with contemporary technological change. </p> 
				
				<p style={{color: '#FF2D55'}}>Share </p>
				<span className='share'>
					<a href="" target="_blank" > <img src={twitter} alt='twitter share' /> </a>
					<a href="" target="_blank" ><img src={instagram} alt='instagram share' /> </a>
					<a href="" target="_blank" > <img src={email} alt='email' /> </a>
				</span>
			</div>
		</div>
	);
}

export default Credits;
