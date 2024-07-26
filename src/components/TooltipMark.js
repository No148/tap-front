import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/styles'

export default function TooltipMark({ title }) {
	const theme = useTheme()
	return (
		<Tooltip title={title} style={{ marginLeft: 10 }} >
			<svg
				width='18'
				height='18'
				viewBox='0 0 18 18'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M9 0.249999C4.16797 0.25 0.25 4.16797 0.250001 9C0.250001 13.832 4.16797 17.75 9 17.75C13.832 17.75 17.75 13.832 17.75 9C17.75 4.16797 13.832 0.249999 9 0.249999ZM9 14.0781C8.56836 14.0781 8.21875 13.7285 8.21875 13.2969C8.21875 12.8652 8.56836 12.5156 9 12.5156C9.43164 12.5156 9.78125 12.8652 9.78125 13.2969C9.78125 13.7285 9.43164 14.0781 9 14.0781ZM10.2285 9.79102C10.0516 9.85932 9.89944 9.97934 9.79179 10.1354C9.68413 10.2915 9.62601 10.4764 9.625 10.666L9.625 11.1094C9.625 11.1953 9.55469 11.2656 9.46875 11.2656L8.53125 11.2656C8.44531 11.2656 8.375 11.1953 8.375 11.1094L8.375 10.6895C8.375 10.2383 8.50586 9.79297 8.76367 9.42187C9.01562 9.05859 9.36719 8.78125 9.78125 8.62305C10.4453 8.36719 10.875 7.81055 10.875 7.20312C10.875 6.3418 10.0332 5.64062 9 5.64062C7.9668 5.64062 7.125 6.3418 7.125 7.20313L7.125 7.35156C7.125 7.4375 7.05469 7.50781 6.96875 7.50781L6.03125 7.50781C5.94531 7.50781 5.875 7.4375 5.875 7.35156L5.875 7.20313C5.875 6.43555 6.21094 5.71875 6.82031 5.18555C7.40625 4.67188 8.17969 4.39062 9 4.39062C9.82031 4.39062 10.5937 4.67383 11.1797 5.18555C11.7891 5.71875 12.125 6.43555 12.125 7.20312C12.125 8.33203 11.3809 9.34766 10.2285 9.79102Z'
					fill={theme.palette.mode === 'dark' ? '#C2C1F9' : '#000'}
				/>
			</svg>
		</Tooltip>
	)
}
