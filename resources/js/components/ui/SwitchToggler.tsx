import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import React from 'react';


interface SwitchTogglerProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const SwitchToggler: React.FC<SwitchTogglerProps> = ({ 
  checked, 
  onChange, 
  id = 'switch' 
}) => {

  const {state :{currentTheme}} = useStoreConfigCtx()

  return (
    <>
      <style>{`
        .switch-wrap {
          z-index: 20;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          width: calc(var(--w-switch) + calc(var(--p) * 2));
          height: calc(var(--h-switch) + calc(var(--p) * 2));
          --round: 1.5rem;
          --scale-x: calc(1.35 * var(--round));
          --p: calc(calc(6.25 / 100) * var(--round));
          --checked: calc(100% - calc(var(--round) + var(--p)));
          --sz-marbles: calc(var(--w-switch) + calc(var(--p) * 2));
          --h-switch: calc(var(--round) + calc(var(--p) * 2));
          --w-switch: calc(calc(var(--round) * 2) + calc(var(--p) * 2));
        }
        .switch-wrap .switch-input {
          display: none;
          background: transparent none;
          visibility: hidden;
        }
        .switch-label {
          cursor: pointer;
          user-select: none;
          position: relative;
          z-index: 20;
          width: var(--w-switch);
          height: var(--h-switch);
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          /* OFF state: muted/dim background */
          background-color: ${currentTheme.border};
          border-radius: 9999px;
          border: 2px solid ${currentTheme.border};
          transition: all linear 300ms;
        }
        .switch-label::after {
          position: absolute;
          display: block;
          content: "";
          width: var(--round);
          height: var(--round);
          left: var(--p);
          border-radius: 9999px;
          /* OFF knob: dimmer color */
          background-color: ${currentTheme.accent};
          will-change: left, width, margin, padding;
          transition: left 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
            width 300ms ease, padding 300ms ease, margin 300ms ease,
            background-color 300ms ease;
        }
        .switch-input + .switch-label:active::after {
          width: var(--scale-x);
        }
        /* ON state: use primary color so it pops */
        .switch-input:checked + .switch-label {
          background-color: ${currentTheme.bg};
          border-color: ${currentTheme.border};
        }
        /* ON knob: bright contrasting color */
        .switch-input:checked + .switch-label::after {
          background-color: ${currentTheme.accent};
          left: var(--checked);
        }
        .switch-input:checked + .switch-label:active::after {
          margin-left: calc(calc(var(--checked) - var(--scale-x)) - var(--p));
        }
        .switch-marbles {
          width: 100%;
          height: 100%;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 9999px;
          pointer-events: none;
        }
        .switch-marbles::before {
          content: "";
          height: var(--sz-marbles);
          width: var(--sz-marbles);
          position: absolute;
          border-radius: 9999px;
          z-index: -1;
          background: ${currentTheme.primary};
          filter: blur(20px);
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .switch-input:checked ~ .switch-marbles::before {
          opacity: 0.7;
          animation: rotate 4000ms linear running infinite;
        }
        @keyframes rotate {
          to {
            rotate: 360deg;
          }
        }

        /* Badge */
        .switch-badge {
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 9999px;
          background-color: #fef08a33;
          border: 1.5px solid #facc1566;
          color: #facc15aa;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          white-space: nowrap;
          pointer-events: none;
          z-index: 30;
          transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .switch-badge::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: #e8ca4f75;
          flex-shrink: 0;
          transition: background-color 300ms ease, box-shadow 300ms ease;
        }
        .switch-input:checked ~ .switch-badge {
          background-color: #16a34a33;
          border-color: #22c55e99;
          color: #22c55e;
        }
        .switch-input:checked ~ .switch-badge::before {
          background-color: #22c55e;
          box-shadow: 0 0 6px 2px #22c55e88;
          animation: pulse-badge 2s ease infinite;
        }
        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 6px 2px #22c55e88; }
          50% { box-shadow: 0 0 10px 4px #22c55ecc; }
        }
      `}</style>
      <div className="switch-wrap">
        <input
          className="switch-input"
          aria-label="switch"
          name={id}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="switch-label" htmlFor={id}></label>
        <span className="switch-marbles"></span>
        <span className="switch-badge">{checked ? 'Active' : 'Inactive'}</span>
      </div>
    </>
  );
};

export default SwitchToggler;
