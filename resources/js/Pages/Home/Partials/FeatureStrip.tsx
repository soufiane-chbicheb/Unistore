import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';

const FEATURES = [
  {
    icon: <Truck size={20} />,
    title: 'Free Shipping',
    sub: 'On orders over $150',
  },
  {
    icon: <RotateCcw size={20} />,
    title: 'Easy Returns',
    sub: '30-day return policy',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Secure Checkout',
    sub: '256-bit SSL encryption',
  },
  {
    icon: <Award size={20} />,
    title: 'Authenticity Guaranteed',
    sub: 'All products verified',
  },
];

const FeatureStrip: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid var(--currenththeme-border)',
        borderBottom: '1px solid var(--currenththeme-border)',
      }}
    >
      {FEATURES.map((f, i) => (
        <div
          key={i}
          style={{
            padding: '1.6rem 1.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderRight: i < FEATURES.length - 1 ? '1px solid var(--currenththeme-border)' : 'none',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid var(--currenththeme-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--currenththeme-accent)',
            }}
          >
            {f.icon}
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--currenththeme-text)',
                marginBottom: 2,
              }}
            >
              {f.title}
            </p>
            <p style={{ fontSize: 11, color: 'var(--currenththeme-textMuted)' }}>
              {f.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureStrip;
