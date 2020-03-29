import * as React from 'react'
import classNames from 'classnames'

declare global {
	interface Window {
		Accelerometer: any,
		AmbientLightSensor: any,
		Gyroscope: any
	}
}

class IntroModal extends React.Component {
	state: {
		showModal: boolean,
		smartphoneRedirect: boolean
	}

	constructor(props: any) {
		super(props)
		this.state = {
			showModal: false,
			smartphoneRedirect: false
		}
	}

	handleClick = () => {
		this.setState({
			showModal: false
		})
	}

	handlePermissionRefusal(perm: string) {
		// alert(`refused: ${perm ?? 'unknown'}`)
	}

	componentDidMount() {
		try {
			navigator.permissions.query({ name: 'accelerometer' }).then(result => {
				if (result.state === 'denied') { this.handlePermissionRefusal('accelerometer') }
			})

			navigator.permissions.query({ name: 'gyroscope' }).then(result => {
				if (result.state === 'denied') { this.handlePermissionRefusal('gyroscope') }
			})
		} catch(e) {
			console.warn(e)
		}

		if (window.screen.width > 1050) {
			this.setState({
				showModal: true,
				smartphoneRedirect: true
			})
		}
	}

	render() {
		return (
			<div
				className={classNames('introModal', { enabled: (this.state.showModal)})}
				onClick={this.handleClick}
			>
				<div className={classNames({ enabled: (this.state.smartphoneRedirect) })}>
					<h1>📣 Heads up!</h1>
					<h2>📱 This site works best on smartphones</h2>
					<img src="/qr-redirect.svg" alt="https://diceroll.gaby.dev"/>
					<p>
						Scan this QR code to open Diceroll on your phone.<br/>
						Or click anywhere to dismiss this message, and use <strong>spacebar</strong> to roll the dice!
					</p>
				</div>
				<style jsx>{`
					.introModal {
						position: fixed;
						top: 0;
						left: 0;
						width: 100vw;
						height: 100vh;
						background: rgba(0, 0, 0, 0.5);
						z-index: -1;
						display: none;
					}

					.introModal.enabled {
						z-index: 1000;
						display: flex;
					}

					.introModal > div {
						margin: auto;
						background: white;
						color: black;
						border-radius: 30px;
						width: 400px;
						max-width: 95vw;
						padding: 30px;
						cursor: pointer !important;

						display: none;
					}

					.introModal > div.enabled {
						display: block;
					}

					h1 {
						font-size: 2.3rem;
						margin: 0;
						margin-bottom: 1rem;
					}

					h2 {
						font-weight: normal;
						font-size: 1.3rem;
						margin: 0;
					}

					img {
						display: block;
						margin: 2rem auto;
						width: 150px;
						max-width: 80vw;
					}

					p {
						font-size: 1rem;
						line-height: 1.6;
					}

					strong {
						font-weight: bold;
						background: #222;
						color: white;
						padding: 1px 7px;
						border-radius: 3px;
					}
				`}</style>
			</div>
		)
	}
}

export default IntroModal
