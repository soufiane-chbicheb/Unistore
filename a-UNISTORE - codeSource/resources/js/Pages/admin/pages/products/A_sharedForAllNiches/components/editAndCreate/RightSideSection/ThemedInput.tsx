import { Input } from '@/components/ui/input';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function ThemedInput({ className = '', ...props }: ThemedInputProps) {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  return (
    <Input
      {...props}
         onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${currentTheme.border}`;
        e.currentTarget.style.borderColor = currentTheme.accent;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.borderColor = currentTheme.border;
      }}
    />
  );
}


interface ThemedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function ThemedTextarea({ className = '', ...props }: ThemedTextareaProps) {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm transition-colors resize-none themed-scroll ${className} `}
      style={{
        backgroundColor: currentTheme.bgSecondary,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: currentTheme.borderRadius,
        color: currentTheme.text,
        boxShadow: currentTheme.shadow,
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${currentTheme.primary}`;
        e.currentTarget.style.borderColor = currentTheme.primary;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.borderColor = currentTheme.border;
      }}
    />
  );
}

interface ThemedLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export function ThemedLabel({ htmlFor, children }: ThemedLabelProps) {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1"
      style={{ color: currentTheme.text }}
    >
      {children}
    </label>
  );
}

