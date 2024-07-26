import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { FormattedMessage } from 'react-intl'

const ConfirmDialog = (props) => {
	const { title, content, open, handleConfirm, handleClose } = props

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{content}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary'>
					<FormattedMessage id='common.cancel' />
				</Button>
				<Button onClick={handleConfirm} color='primary' autoFocus>
					<FormattedMessage id='common.yes' />
				</Button>
			</DialogActions>
		</Dialog>
	)
}

ConfirmDialog.propTypes = {
	title: PropTypes.any.isRequired,
	content: PropTypes.any.isRequired,
	open: PropTypes.bool.isRequired,
	handleConfirm: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
}

export default ConfirmDialog
