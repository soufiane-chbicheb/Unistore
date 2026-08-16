import React from 'react';

interface Banner {
  image: string;
  tag: string;
  title: string;
  cta: string;
  span?: 'large' | 'normal';
  overlayStrength?: number;
}

const BANNERS: Banner[] = [
  {
    image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Limited — 48hrs only',
    title: 'Summer Sale\nUp to 40% Off',
    cta: 'Shop the Sale',
    span: 'large',
    overlayStrength: 0.55,
  },
  {
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'New Arrivals',
    title: 'Linen\nCollection',
    cta: 'Discover',
  },
  {
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: "Men's Edit",
    title: 'Suiting\nSeason',
    cta: 'Explore',
  },
  {
    image: 'https://images.pexels.com/photos/2422276/pexels-photo-2422276.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'Gift Ideas',
    title: 'For Her',
    cta: 'Browse',
  },
  {
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'Beauty',
    title: 'Skincare\nRitual',
    cta: 'Shop Now',
  },
];

const BannerCard: React.FC<{ banner: Banner; style?: React.CSSProperties }> = ({
  banner,
  style,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const strength = banner.overlayStrength ?? 0.45;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--currenththeme-border-radius, 0px)',
        cursor: 'pointer',
        ...style,
      }}
    >
      <img
        src={banner.image}
        alt={banner.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.55s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(160deg, rgba(0,0,0,${strength + 0.1}) 0%, rgba(0,0,0,${strength - 0.1}) 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.6rem',
          transition: 'background 0.3s',
        }}
      >
        <p
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--currenththeme-accent)',
            marginBottom: 6,
            fontWeight: 400,
          }}
        >
          {banner.tag}
        </p>
        <h3
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: banner.span === 'large' ? '2.2rem' : '1.4rem',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
            marginBottom: 12,
          }}
        >
          {banner.title}
        </h3>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.5)',
            paddingBottom: 2,
            width: 'fit-content',
            transition: 'border-color 0.2s',
          }}
        >
          {banner.cta} →
        </span>
      </div>
    </div>
  );
};

const PromoBanners: React.FC = () => {
  return (
    <section style={{ padding: '4rem 5vw 0' }}>
      {/* Section header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--currenththeme-accent)',
            marginBottom: 4,
          }}
        >
          This Week
        </p>
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: '2.2rem',
            fontWeight: 600,
            color: 'var(--currenththeme-text)',
            lineHeight: 1.1,
          }}
        >
          Featured Offers
        </h2>
      </div>

      {/* Banner grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '220px 220px',
          gap: 0,
        }}
      >
        <BannerCard
          banner={BANNERS[0]}
          style={{ gridRow: '1 / 3' }}
        />
        <BannerCard banner={BANNERS[1]} />
        <BannerCard banner={BANNERS[2]} />
        <BannerCard banner={BANNERS[3]} />
        <BannerCard banner={BANNERS[4]} />
      </div>
    </section>
  );
};

export default PromoBanners;
