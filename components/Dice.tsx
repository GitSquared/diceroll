import * as React from 'react'
import classNames from 'classnames'

declare global {
	interface Window {
		RelativeOrientationSensor: any,
		AbsoluteOrientationSensor: any,
	}
}

interface KeyDownEvent {
	code: string
}

type DiceFace = 1|2|3|4|5|6
interface DiceState {
	face: DiceFace,
	spinning: boolean,
	accelerometer: [number, number],
	hasRolled: boolean
}

const defaultDiceState: DiceState = {
	face: 1,
	spinning: false,
	accelerometer: [0.3, 0.25],
	hasRolled: false
}

class Dice extends React.Component {
	// faceViews is an array containing the X/Y/Z rotations needed to display a specific face
	faceViews: Array<[number, number, number]>
	state: DiceState

	constructor(props: any) {
		super(props)
		this.faceViews = [
			[0, 0, 0],
			[90, 0, 0],
			[0, 90, 0],
			[0, -90, 0],
			[-90, 0, 0],
			[-180, 0, 0]
		]
		this.state = defaultDiceState
	}

	componentDidMount() {
		try {
			const orientationSensor = new window.RelativeOrientationSensor({ frequency: 60, referenceFrame: 'screen' })
			orientationSensor.addEventListener('reading', () => {
				if (!this.state.spinning) {
					const accelerometer = orientationSensor.quaternion.map((x: number, i: number) => {
						if (i < 2) {
							return Math.round(x * 1000 * 1000) / (1000 * 1000)
						}
					})
					this.setState({
						accelerometer
					})
				}
			})
			orientationSensor.start()

			const gyroscope = new window.Gyroscope({ frequency: 60 })
			gyroscope.addEventListener('reading', () => {
				if ((gyroscope.x > 9 || gyroscope.z > 4) && !this.state.spinning) {
					this.random()
				}
			})
			gyroscope.start()
		} catch (e) {
			// Do nothing, most likely feature not supported
			console.warn(e)
		}

		document.addEventListener('keydown', (e: KeyDownEvent) => {
			this.handleKeyDown(e)
		})
	}

	roll(face: DiceFace) {
		this.setState({
			face: 1,
			spinning: true,
			hasRolled: true
		})

		setTimeout(() => {
			this.setState({
				face: 1,
				spinning: false
			}, () => {
				this.setState({ face })
			})
		}, 2000)
	}

	random() {
		this.roll(Math.floor(Math.random() * 6 + 1) as DiceFace)
	}

	handleClick = () => {
		this.random()
	}

	handleKeyDown = (e: KeyDownEvent) => {
		if (e.code === 'Space') {
			this.random()
		}
	}

	render() {
		const [x, y, z] = this.faceViews[this.state.face - 1]
		const [ax, ay] = this.state.accelerometer
		let rx, ry, rz

		if (this.state.spinning) {
			rx = x
			ry = y
			rz = z
		} else {
			// Calculate perspective rotation with device orientation effect
			rx = x + (ax * 40)
			if (this.state.face === 5) {
				ry = y
				rz = z + (-ay * 40)
			} else if (this.state.face === 2) {
				ry = y
				rz = z + (ay * 40)
			} else if (this.state.face === 6) {
				ry = y + (ay * 40)
				rz = z
			} else {
				ry = y + (-ay * 40)
				rz = z
			}
		}

		return (
			<div className="dice" onClick={this.handleClick}>
				<div className={classNames('helper', { enabled: (!this.state.hasRolled) })}>
					<h1>Shake your phone!</h1>
					<p>Or touch the dice</p>
				</div>
				<div className={classNames('cube', { spin: (this.state.spinning) })}>
					<div
						className={classNames('front', {
							facing: (this.state.face === 1 || this.state.spinning)
						})}
					></div>
					<div className="front filler"></div>
					<div
						className={classNames('back', {
							facing: (this.state.face === 6 || this.state.spinning)
						})}
					></div>
					<div className="back filler"></div>
					<div
						className={classNames('top', {
							facing: (this.state.face === 5 || this.state.spinning)
						})}
					></div>
					<div className="top filler"></div>
					<div
						className={classNames('bottom', {
							facing: (this.state.face === 2 || this.state.spinning)
						})}
					></div>
					<div className="bottom filler"></div>
					<div
						className={classNames('left', {
							facing: (this.state.face === 3)
						})}
					></div>
					<div className="left filler"></div>
					<div
						className={classNames('right', {
							facing: (this.state.face === 4)
						})}
					></div>
					<div className="right filler"></div>
				</div>
				<style jsx>{`
					.dice {
						perspective: 800px;
						perspective-origin: 50% 100px;
					}

					.dice::before {
						content: "";
						display: block;
						position: absolute;
						width: 200px;
						height: 200px;
						background: rgba(0, 0, 0.4);
						box-shadow: ${ay * 50}px ${ax * 50}px 30px rgba(0, 0, 0.4);
						// box-shadow: 0px 0px 30px rgba(0, 0, 0.4);
						border-radius: ${ this.state.spinning ? '50' : '0' }%;
						transform: translateZ(${ this.state.spinning ? '-50' : '0' }px);
						transition: border-radius .2s linear, transform .2s linear;
					}

					.helper {
						position: absolute;
						top: -150px;
						width: 100%;
						text-align: center;
						opacity: 0;
						transition: opacity .6s ease-out;
					}

					.helper.enabled {
						opacity: 1;
					}

					.helper * {
						margin: 0;
					}

					@keyframes softBlink {
						0%   { opacity: 0.5; }
						50%  { opacity: 1;   }
						100% { opacity: 0.5; }
					}

					h1 {
						line-height: 1.3;
						font-size: 1.2rem;
						opacity: 0.8;
						animation: softBlink 1s linear 3s infinite;
					}

					p {
						opacity: 0.5;
					}

					@keyframes spin {
						from { transform: rotateX(0deg)           rotateY(30deg) rotateZ(0deg); }
						to   { transform: rotateX(-${360 * 4}deg) rotateY(0deg)  rotateZ(0deg); }
					}

					.cube {
						position: relative;
						width: 200px;
						height: 200px;
						transform-style: preserve-3d;

						transform: rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg);
						transition: transform 3s cubic-bezier(0, .82, .47, 1);
					}

					.cube.spin {
						animation: spin 2s linear infinite;
					}

					.cube div {
						position: absolute;
						width: 200px;
						height: 200px;
						background-image: url("/dice_texture.svg");
						background-size: 415%;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 30px;
						// backface-visibility: hidden;
						transform-origin: center;
						// opacity: 0.35;
					}

					.cube div.facing {
						background-color: hsl(0, 0%, 95%);
					}

					.cube div:not(.facing) {
						background-color: hsl(0, 0%, 80%);
					}

					.cube .filler {
						// background-color: red;
						border-radius: 0;
					}

					.front {
						transform: translateZ(100px);
						background-position: 66.2% 50%;
					}
					.front.filler { transform: translateZ(70px); }
					.back {
						transform: translateZ(-100px) rotateY(180deg);
						background-position: 1% 50%;
					}
					.back.filler { transform: translateZ(-70px); }
					.top {
						transform: rotateX(90deg) translateZ(100px);
						background-position: 66.2% 0.9%;
					}
					.top.filler { transform: rotateX(90deg) translateZ(70px); }
					.bottom {
						transform: rotateX(-90deg) translateZ(100px);
						background-position: 66.2% 98.3%;
					}
					.bottom.filler { transform: rotateX(-90deg) translateZ(70px); }
					.left {
						transform: rotateY(-90deg) translateZ(100px);
						background-position: 33.4% 50%;
					}
					.left.filler { transform: rotateY(-90deg) translateZ(70px); }
					.right {
						transform: rotateY(90deg) translateZ(100px);
						background-position: 99% 50%;
					}
					.right.filler { transform: rotateY(90deg) translateZ(70px); }
				`}</style>
			</div>
		)
	}
}

export default Dice
