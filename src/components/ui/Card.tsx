import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export default function Card({
  padding = 'md',
  hover = false,
  children,
  style,
  ...props
}: CardProps) {
  const paddingMap = { sm: '1rem', md: '1.5rem', lg: '2rem' }

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #222',
        borderRadius: '8px',
        padding: paddingMap[padding],
        transition: hover ? 'border-color 0.3s, transform 0.3s' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#444'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#222'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}