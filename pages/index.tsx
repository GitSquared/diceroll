import { NextPage } from 'next'
import IntroModal from '../components/IntroModal'
import Dice from '../components/Dice'

const Home: NextPage = () => (
	<div className="root">
		<IntroModal/>
		<Dice/>
		<style jsx>{`
			.root {
				width: 100vw;
				height: 100vh;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #82ccdd;
				color: white;
			}

			h1 {
				margin: 0;
			}
		`}</style>
		<style jsx global>{`
			html, body {
				margin: 0;
				padding: 0;
			}

			body {
				font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
				color: #444;
			}
		`}</style>
	</div>
)

export default Home
