import React, { useRef, useState, useEffect } from 'react'
import ReactCountdown, { zeroPad } from 'react-countdown'

function Countdown({ countMS = 30000, trigger }) {
	const [countdown, setCountDown] = useState(Date.now())

	useEffect(() => {
		setCountDown(Date.now())
	}, [trigger])

	const renderer = ({ hours, minutes, seconds, completed, api, props }) => {
		if (countMS < 60_000)
			return (
				<span
					style={{
						marginLeft: 5,
						whiteSpace: 'nowrap',
						color: '#545c66',
						fontSize: 12,
						lineHeight: '14px',
					}}
				>
					{zeroPad(seconds)} sec
				</span>
			)

		return (
			<span
				style={{
					marginLeft: 5,
					whiteSpace: 'nowrap',
					color: '#545c66',
					fontSize: 12,
					lineHeight: '14px',
				}}
			>
				{zeroPad(minutes)}:{zeroPad(seconds)} sec
			</span>
		)
	}

	return (
		<ReactCountdown
			date={countdown + countMS}
			key={countdown}
			renderer={renderer}
		/>
	)
}

export default Countdown
