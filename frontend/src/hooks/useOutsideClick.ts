import { useEffect } from 'react';

export const useOutsideClick = <T extends React.RefObject<any>>(ref: T, callback: (...params: any[]) => any) => {
  useEffect(() => {
    /* If clicked on outside of element */
    function handleClickOutside(event: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    /* Bind the event listener */
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
};
