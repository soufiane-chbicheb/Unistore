import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppLoadingProps {
  message?: string;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const blink = keyframes`
  0% {
    opacity: 0.15;
    transform: scale(0.5) rotate(5deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────

const Overlay = styled.div<{ overlay: string }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  background: ${({ overlay }) => overlay};
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.2s ease forwards;
`;

const Card = styled.div<{ bg: string; border: string; shadow: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 48px;
  border-radius: 16px;
  animation: ${slideUp} 0.3s ease forwards;
`;

const Grid = styled.div`
  --size: 64px;
  width: var(--size);
  height: var(--size);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

const Dot = styled.span<{ color: string; delay: number }>`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: ${({ color }) => color};
  animation: ${blink} 0.7s alternate infinite ease-in-out;
  animation-delay: ${({ delay }) => delay}ms;
`;

const Message = styled.p<{ color: string; muted: string }>`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ muted }) => muted};
  margin: 0;

  span {
    color: ${({ color }) => color};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const DELAYS = [0, 150, 250, 350, 450, 600];

const AppLoading: React.FC<AppLoadingProps> = ({ message = 'Please wait' }) => {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <Overlay overlay={t.overlay}>
      <Card bg={t.modal} border={t.border} shadow={t.shadowLg}>
        <Grid>
          {DELAYS.map((delay, i) => (
            <Dot key={i} color={t.primary} delay={delay} />
          ))}
        </Grid>
        <Message color={t.text} muted={t.textMuted}>
          <span>{message}</span>
        </Message>
      </Card>
    </Overlay>
  );
};

export default AppLoading;
