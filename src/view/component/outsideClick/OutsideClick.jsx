import React, { useRef, useEffect } from "react";

function OutsideClick({ children, handleClickOutside }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClickOutside]);

  return (
    <div ref={ref} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

export default OutsideClick;
