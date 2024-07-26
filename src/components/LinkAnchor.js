import React from 'react'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import { useTheme } from '@mui/material/styles'

const useStyles = (theme) => ({
	buttonAnchor: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		transition: 'opacity 0.2s ease-in',
		'&:hover': {
			//color: theme.palette.mode === 'dark' ? '#253CC6' : '#556cd6',
			opacity: '0.6',
			'& $icon': {
				visibility: 'visible',
			},
		},
	},
	icon: {
		content: '""',
		position: 'absolute',
		left: '-25px',
		visibility: 'hidden',
	},
})

const LinkAnchor = ({ children, id }) => {
  const theme = useTheme()
	const classes = useStyles(theme)

	const handler = () => {
		const link = document.createElement('a')
		link.href = `#${id}`
		link.click()
	}

	return (
		<span id={id} style={classes.buttonAnchor} onClick={handler}>
			<InsertLinkIcon fontSize={'small'} style={classes.icon} />
			<div>
				{children}
			</div>
		</span>
	)
}

export default LinkAnchor
