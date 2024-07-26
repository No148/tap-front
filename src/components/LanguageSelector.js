import React, { useState } from 'react'
import { useTheme } from '@mui/styles'
import {
	Select,
	FormControl,
	InputLabel,
	MenuItem,
} from '@mui/material'

export default function Selector({ notDefault, onChange }) {
	const [lang, setLang] = useState(window.localStorage.getItem('language') || 'en')
	const theme = useTheme()

	return (
    <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
      <InputLabel id="demo-select-small-label">Language</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={lang}
        label="Language"
        onChange={(e) => {
        	onChange(e)
        	setLang(e.target.value)
        }}
      >
        <MenuItem value='en'>English</MenuItem>
        <MenuItem value='ru'>Русский</MenuItem>
        <MenuItem value='cn'>中文</MenuItem>
        <MenuItem value='in'>हिन्दी</MenuItem>
        <MenuItem value='ir'>فارسی</MenuItem>
      </Select>
    </FormControl>
 	)
}
