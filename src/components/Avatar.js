import MuiAvatar from '@mui/material/Avatar'
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Avatar({name, sx, src, ...props}) {

  const [loadedSrc, setLoadedSrc] = useState(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setLoadedSrc(src);
        }
      });
    });

    if (avatarRef.current) {
      observer.observe(avatarRef.current);
    }

    return () => {
      if (avatarRef.current) {
        observer.unobserve(avatarRef.current);
      }
    };
  }, [src]);

  const stringToColor = useCallback((string) => {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }, [])

  const getFirstLetters = useCallback((name) => {
    if (!name || typeof name !== 'string') return ''

    return name
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s\s+/g, ' ')
      .trimStart()
      .split(' ')
      .slice(0, 2)
      .map((name) => name[0])
      .filter((name) => name?.length > 0)
      .join('')
      .toUpperCase();
  }, []);
  
  const stringAvatar = (name = '') => {
    const fls = getFirstLetters(name)
    const bgcolor = stringToColor(name)

    return {
      sx: {
        ...sx,
        bgcolor,
      },
      children: fls,
    };
  }
  
  return <MuiAvatar
    ref={avatarRef}
    {...(name ? stringAvatar(name): {sx})}
    {...props}
    src={loadedSrc}
  />
}

Avatar.propTypes = {
  name: PropTypes.string,
  sx: PropTypes.object
}
