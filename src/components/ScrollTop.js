import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { Box, Button } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig()
const { apiUrl, imageStorage, mode } = publicRuntimeConfig
export default function ScrollToTop({ el }) {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = useCallback(() => {
    if (el && el.current) {
      el.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [el])

  useEffect(() => {
    if (el && el.current) {
      const toggleVisibility = () => {
        if (el.current.scrollTop > 192) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }

      el.current.addEventListener('scroll', toggleVisibility)

      return () => el.current?.removeEventListener('scroll', toggleVisibility)
    }
  }, [el])

  return (
    <Box
      onClick={scrollToTop}
      sx={(theme) => ({
        zIndex: '6500',
        position: 'fixed',
        bottom: 50,
        right: 50,
        width: '100px',
        background: theme.palette.mode === 'dark' ?
          '#253CC6' : mode ==='ai' ? '#FDBF1E' : '#8C1515',
        borderRadius: '100px',
      })}
    >
      {isVisible && (
        <Button
          endIcon={<KeyboardDoubleArrowUpIcon />}
          sx={(theme) => ({
            minWidth: '100px',
            borderRadius: '100px',
            color: mode ==='ai' ? '#2B2F38' : '#fff',
            '&:hover': {
              borderRadius: '100px'
            },
          })}
        >
          Go UP
        </Button>
      )}
    </Box>
  )
}
