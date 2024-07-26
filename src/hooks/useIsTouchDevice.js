const useIsTouchDevice = () => {
    const isTouchDevice = 'ontouchstart' in window && navigator.maxTouchPoints > 1;
    return isTouchDevice;
  };
  
  export default useIsTouchDevice;
  