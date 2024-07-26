import getConfig from 'next/config'
import { getHeaders } from '@/helpers/utils'

const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

// try to get info about lead in pipedrive
export const loadProfile = async (lead) => {
  return false  // disabled now

  const m =
    localStorage.getItem('known_manager') || localStorage.getItem('tg_username')

  // TODO: load here data!!  lead telegram will be in router.query.tg
  if (!lead || !m) return false

  let url = `/api/crm-search?search=${lead}&from=${m}`
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  const p = new RegExp(`(${lead})`, 'ig')
  if (data.status) {
    console.log(data.status, 'failed')
    return false
  }

  const result = data?.length ? data[0] : {}

  if (result && result.item) {
    let url = `/api/crm-lead-data/?no_history=1&type=${result.item.type}&id=${result.item.id}&from=${m}`
    const response2 = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response2.ok) {
      return false
    }

    const data = await response2.json()
    return data
  }

  return false
}
