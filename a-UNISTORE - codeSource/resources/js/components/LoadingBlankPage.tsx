import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import LoaderBySpinners from './ui/LoaderBySpinners';

const LoadingBlankPage = ({ containerRef }:{containerRef : React.RefObject<HTMLDivElement | null>}) => {
  if (!containerRef?.current) return null;

  return createPortal(
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <LoaderBySpinners style="scale" color='blue'  size={50} />
    </div>,
    containerRef.current
  );
};

export default LoadingBlankPage;



