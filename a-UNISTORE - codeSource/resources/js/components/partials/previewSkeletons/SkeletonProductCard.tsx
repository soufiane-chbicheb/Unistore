import React from 'react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

const SkeletonProductCard: React.FC = () => {
  const { state: { currentTheme } } = useStoreConfigCtx();

  return (
    <div
      style={{
        background: currentTheme.card,
        borderRadius: currentTheme.borderRadius,
        padding: '12px',
        boxShadow: currentTheme.shadow,
      }}
    >
      {/* Image skeleton */}
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: '8px',
          background: currentTheme.border,
          opacity: 0.2,
          marginBottom: '12px',
        }}
      />

      {/* Title skeleton */}
      <div
        style={{
          width: '80%',
          height: '12px',
          borderRadius: '4px',
          background: currentTheme.textMuted,
          opacity: 0.3,
          marginBottom: '8px',
        }}
      />

      {/* Price skeleton */}
      <div
        style={{
          width: '60%',
          height: '10px',
          borderRadius: '4px',
          background: currentTheme.border,
          opacity: 0.2,
          marginBottom: '12px',
        }}
      />

      {/* Button skeleton */}
      <div
        style={{
          width: '100%',
          height: '36px',
          borderRadius: '6px',
          background: currentTheme.secondary,
        }}
      />
    </div>
  );
};

export default SkeletonProductCard;
