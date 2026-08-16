import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to backend
    setSubmitted(true);
  };

  return (
    <section
      style={{
        padding: '5rem 5vw',
        background: 'var(--currenththeme-bgSecondary)',
        borderTop: '1px solid var(--currenththeme-border)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--currenththeme-accent)',
          marginBottom: 8,
        }}
      >
        Stay in the loop
      </p>
      <h2
        style={{
          fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
          fontSize: '2.6rem',
          fontWeight: 600,
          color: 'var(--currenththeme-text)',
          marginBottom: 10,
        }}
      >
        Join the Inner Circle
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--currenththeme-textMuted)',
          marginBottom: '2rem',
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.7,
        }}
      >
        Early access to sales, exclusive drops &amp; editorials — curated just for you.
      </p>

      {submitted ? (
        <p
          style={{
            fontSize: 14,
            color: 'var(--currenththeme-accent)',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.2rem',
          }}
        >
          Welcome to the circle. ✦
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            maxWidth: 460,
            margin: '0 auto',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              flex: 1,
              background: 'var(--currenththeme-bg)',
              border: '1px solid var(--currenththeme-border)',
              borderRight: 'none',
              padding: '12px 18px',
              color: 'var(--currenththeme-text)',
              fontFamily: 'inherit',
              fontSize: 13,
              outline: 'none',
              borderRadius: 'var(--currenththeme-border-radius, 8px) 0 0 var(--currenththeme-border-radius, 8px)',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--currenththeme-accent)',
              color: '#fff',
              border: 'none',
              padding: '12px 22px',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '0 var(--currenththeme-border-radius, 8px) var(--currenththeme-border-radius, 8px) 0',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'var(--currenththeme-accentHover)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'var(--currenththeme-accent)')
            }
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
};

export default NewsletterSection;
