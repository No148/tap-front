import useMediaQuery from '@mui/material/useMediaQuery'

export function useMaxWidth(px) {
  return useMediaQuery(`(max-width: ${px}px)`)
}

export function useMinWidth(px) {
  return useMediaQuery(`(min-width: ${px}px)`)
}

export function useMediaMobile() {
  return useMediaQuery(`(max-width: 600px)`)
}

export function useMediaTablet() {
  return useMediaQuery(`(max-width: 900px)`)
}

export function useMediaDesktop() {
  return useMediaQuery(`(max-width: 1024px)`)
}

export function useMediaWide() {
  return useMediaQuery(`(min-width: 1600px)`)
}
