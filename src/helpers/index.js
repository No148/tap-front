import { pythonApiGet } from '@/helpers/baserow'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { pythonApiUrl } = publicRuntimeConfig

export const getEmployees = async () => {
  return await pythonApiGet(`https://${pythonApiUrl}/employees/by-params`)
}
