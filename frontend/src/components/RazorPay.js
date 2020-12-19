import React, { useState } from 'react';
function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost';

export default function RazorPay(props) {
    const [name, setName] = useState('Mehul')

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('/razorpay/', 
		{ method: 'post' ,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			pay_amount:props.amount
		})
		}
		)
		.then((t) =>
			t.json()
		)
		
		console.log(data)

		const options = {
			key: __DEV__ ? process.env.R_TEST_ID : process.env.R_LIVE_ID,
			currency: data.currency,
			amount: data.amount,
			order_id: data.id,
			name: 'Foodarsh',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:1337/logo.svg',
			
			handler: function (response) {
				// alert(response.razorpay_payment_id)
				// alert(response.razorpay_order_id)
				// alert(response.razorpay_signature)
				props.onSuccess(response);
	},
			prefill: {
				name:props.name,
				email:props.email,
				phone_number: ''
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div {...props} >
				<a 
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
					PAY AMOUNT
				</a>
		</div>
	)
}


