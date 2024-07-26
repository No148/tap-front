import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import Container from '@/components/Container'
import Layout from '@/components/LayoutWebapp'
import Link from '@/components/Link'

const { publicRuntimeConfig } = getConfig()
const { apiUrl } = publicRuntimeConfig

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <Layout noNavigation={true} noFooter={true}>
      <Container>
        <Breadcrumbs
          sx={(theme) => ({
            marginBottom: theme.spacing(4),
            [theme.breakpoints.only('xs')]: {
              marginBottom: theme.spacing(3),
            },
          })}
        >
          <Link color="inherit" href="/">
            <FormattedMessage id="nav.dashboard" />
          </Link>
        </Breadcrumbs>
        <Typography variant="h4">
          <FormattedMessage id="common.not_found" />
        </Typography>
      </Container>
    </Layout>
  )
}

export default NotFoundPage
