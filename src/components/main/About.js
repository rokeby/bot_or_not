import React from 'react';

function About(props)  {
	return (
		<div className={props.aboutClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}rem`}}>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A condimentum vitae sapien pellentesque. Et malesuada fames ac turpis egestas. Dictum varius duis at consectetur lorem donec massa. In ante metus dictum at tempor commodo ullamcorper a. Pretium quam vulputate dignissim suspendisse in est ante. </p> 			
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A condimentum vitae sapien pellentesque. Et malesuada fames ac turpis egestas. Dictum varius duis at consectetur lorem donec massa. In ante metus dictum at tempor commodo ullamcorper a. Pretium quam vulputate dignissim suspendisse in est ante. </p> 
			</div>
		</div>
	);
}

export default About;


