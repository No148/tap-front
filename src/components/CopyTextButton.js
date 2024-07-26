import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { Box, IconButton, Snackbar, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { copyTextToClipboard } from '@/helpers/utils'
import WalletAddress from './WalletAddress'
import { CopyIcon } from './icons/CopyIcon'
import Link from '@/components/Link'

const useStyles = (theme) => ({
  copiedAddress: {
    display: 'inline-block',
    marginTop: 15,
    marginBottom: 10,
    padding: '10px 10px',
    background: '#e0e0e0',
    borderRadius: 1000,
    fontSize: 10,
    lineHeight: '14px',
  },
  copiedAddressValue: {
    color: '#8C1515',
  },
  snackbarText: {
    minWidth: 'unset',
    background: '#e0e0e0',
    color: '#0F1421',
  },
})

const CopyTextButton = ({
  label,
  textToClipboard,
  addressWallet,
  addressWalletWithLink,
  link,
  transactionHash,
}) => {
  const router = useRouter()
  const intl = useIntl()
  const theme = useTheme()
  const dex = `${router.query.dex || 'uniswap'}`
  const classes = useStyles(theme)

  const [openSnackbar, setOpenSnackbar] = useState(false)

  return (
    <Box style={classes.copiedAddress}>
      <span>{label}</span>
      <span style={classes.copiedAddressValue}>
        {link && (
          <Link href={link} style={classes.copiedAddressValue}>
            <Box display={'inline-block'} mr={2} ml={1}>
              <WalletAddress address={addressWalletWithLink} noCss />
            </Box>
          </Link>
        )}

        {addressWallet && (
          <Box display={'inline-block'} mr={2} ml={1}>
            <WalletAddress noCss address={addressWallet} />
          </Box>
        )}

        {transactionHash && (
          <Box display={'inline-block'} mr={2} ml={1}>
            <em>
              {transactionHash.substring(0, 5) +
                '...' +
                transactionHash.slice(-5)}
            </em>
          </Box>
        )}

        <Tooltip
          title={intl.formatMessage({ id: 'common.list.copyAddress' })}
        >
          <IconButton
            aria-describedby="filter-popover-tags"
            onClick={() => {
              setOpenSnackbar(true)
              copyTextToClipboard(textToClipboard)
            }}
            sx={{ padding: 0 }}
            size="large"
          >
            <CopyIcon color={theme.palette.mode === 'dark' ? '#fff' : '#000'} />
          </IconButton>
        </Tooltip>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={<FormattedMessage id="common.snackbar" />}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          ContentProps={{
            classes: {
              root: classes.snackbarText,
            },
          }}
          sx={{
            zIndex: '10000',
          }}
        />
      </span>
    </Box>
  )
}
export default CopyTextButton
