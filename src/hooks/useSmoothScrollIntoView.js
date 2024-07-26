const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);


export const useSmoothScrollIntoView = (element) => {
    const scrollToElement = (target, { offsetTop = 0 } = {}) => {
          if (element && target) {
            const start = element.scrollTop;
            const end = target.offsetTop;
            const distance = end - start - element.clientHeight / 2;
            const duration = 500;
            let startTime;
      
            const step = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = timestamp - startTime;
              const fraction = Math.min(progress / duration, 1);
      
              const newScrollY = start + distance * easeInOutQuad(fraction) - offsetTop;
      
              element.scrollTop = newScrollY;
      
              if (progress < duration) {
                requestAnimationFrame(step);
              }
            };
      
            requestAnimationFrame(step);
        }
    }
    return {scrollToElement}
}
