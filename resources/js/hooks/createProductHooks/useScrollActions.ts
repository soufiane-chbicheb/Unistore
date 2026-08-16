


import React, { RefObject, useEffect } from 'react'

export function useCloseDropDownOnScroll(isOpen : boolean , onChange : (bool : boolean) => void , inputRef : RefObject<HTMLInputElement | null>  , dropdownRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
  if (!isOpen) return;

  const handleScroll = (e : Event) => {
    const target = e.target as Node;
    if (
      dropdownRef.current?.contains(target) 
    ) {
      return;
    }
    onChange(false);
    inputRef.current?.blur()
  };

  window.addEventListener('scroll', handleScroll, true);

  return () => {
    window.removeEventListener('scroll', handleScroll, true);
  };
}, [isOpen]);
}

