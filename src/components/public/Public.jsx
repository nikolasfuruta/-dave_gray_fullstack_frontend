import React from 'react';
import { Link } from 'react-router-dom';

const Public = () => {
	const content = (
		<section className='public'>
			<header>
				<h1>
					Welcome to <span className='nowrap'>Nikolas Repairs!</span>
				</h1>
			</header>
			<main className='public__main'>
				<p>
					Located in Beatiful Downtown Foo City, Nikolas Repairs provides a
					trained ready to meet your tech repair needs.
				</p>
        <address className='public__addr'>
        Nikolas Repairs <br/>
        555 Foo  Drive <br/>
        Foo City, FOO 12345 <br/>
        <a href="#">(55)555-5555</a>
        </address>
				<br/>
				<p>Owner: Nikolas</p>
			</main>
			<footer>
				<Link to='/login'>Employee Login</Link>
			</footer>
		</section>
	);

	return content;
};

export default Public;
