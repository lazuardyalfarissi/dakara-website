import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    textTransform: 'uppercase' as const,
  },
  variant: {
    primary: { background: '#fff', color: '#000' },
    secondary: { background: 'transparent', color: '#fff', border: '1px solid #fff' },
    danger: { background: '#ff4444', color: '#fff' },
    ghost: { background: 'transparent', color: '#666', border: '1px solid #333' },
  },
  size: {
    sm: { padding: '0.4rem 1rem', fontSize: '0.75rem' },
    md: { padding: '0.65rem 1.5rem', fontSize: '0.85rem' },
    lg: { padding: '0.85rem 2rem', fontSize: '1rem' },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        ...styles.base,
        ...styles.variant[variant],
        ...styles.size[size],
        ...(disabled || loading ? styles.disabled : {}),
        ...style,
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}