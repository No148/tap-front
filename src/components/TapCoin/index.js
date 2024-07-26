import { Box, keyframes } from "@mui/material";
import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import Sparkles from 'react-sparkle'
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import platform from 'platform';
import { useDebounce } from "@/helpers/utils";

const pulse = keyframes`
  0% {
      transform: scale(1);
  }
  50% {
      transform: scale(0.9);
  }
  100% {
      transform: scale(1);
  }
`

const fadeOutUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-150px);
  }
`

const TapCoin = ({ onTap, longScreen, energy, power, turbo }) => {  
  const [touches, setTouches] = useState([])
  const tapsRef = useRef(0)
  const pendingTaps = useRef(0)
  
  const isTouchDevice = useIsTouchDevice()
  const handleTap = useCallback((event) => {
    let newTouches = [];
    let validTap = false;
    if (isTouchDevice && event.type === 'touchstart') {
      if (energy < power * event.touches.length) return

      newTouches = Array.from(event.touches).map((touch, i) => ({
        id: platform.os.family === 'iOS' ? touch.identifier : `${Date.now()}${touch.clientX}${touch.clientY}`,
        x: touch.clientX - 120,
        y: touch.clientY - 40,
      }));
      tapsRef.current += 1;
      validTap = true
    } else if (!isTouchDevice && event.type === 'click') {
      if (energy < power) return
      newTouches = [{
        id: Date.now(),
        x: event.clientX - 120,
        y: event.clientY - 40,
      }];
      tapsRef.current += 1;
      validTap = true
    }

    if (validTap) {
        if (platform.os.family === 'iOS') {
          window?.Telegram.WebApp.HapticFeedback.impactOccurred('heavy')
        } else {
          window.navigator?.vibrate?.(80)
        }

        setTouches(prevTouches => {
        const filteredNewTouches = newTouches.filter(newTouch => !prevTouches.some(prevTouch => prevTouch.id === newTouch.id));
        filteredNewTouches.length > 0 && (pendingTaps.current += filteredNewTouches.length);
        return [...prevTouches.slice(-20), ...filteredNewTouches]
      });
    }
  }, [energy, power, isTouchDevice, platform.os]);

  const handleTapDebounce = useDebounce(handleTap, 0)

  useEffect(() => {
    if (pendingTaps.current > 0) {
      onTap?.(pendingTaps.current);
      pendingTaps.current = 0;
    }
  }, [touches])

  const handleTouchStart = useCallback((event) => {
    handleTapDebounce(event)
  }, [])

  const handleClick = (event) => {
    handleTap(event)
  }

  return (
    <>
      <Box>
          {touches.map(touch => (
            <Box
              key={touch.id}
              sx={{
                touchAction: 'pan-x',
                position: 'absolute',
                zIndex: 1000,
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                pointerEvents: 'none',
                userSelect: 'none',
                opacity: 1,
                animation: `${fadeOutUp} 1s forwards`,
                top: touch.y, left: touch.x
              }}
            >
              +{power}
            </Box>
          ))}
      </Box>
      <Box
        key={tapsRef.current}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        sx={{
          zIndex: 999,
          position: 'relative',
          width: '100%',
          height: '100%',
          background: `no-repeat url('/images/secret-guardian.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          userSelect: 'none',
          animation: `${pulse} 500ms ease`,
        }}
      >
      </Box>
      {turbo && (
        <Box sx={{
          position: 'fixed',
          top: '60px',
          left: '30px',
          width: '380px',
          height: '450px',
          overflow: 'hidden',
          userSelect: 'none',
        }}>
          <Sparkles flicker={false} />
        </Box>
      )}
    </>
  );
};

export default memo(TapCoin);
