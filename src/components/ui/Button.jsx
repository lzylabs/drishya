import { motion } from 'framer-motion'

/**
 * Minimal, text-based button system.
 * primary   — underline link style
 * pill      — thin border pill
 * ghost     — no decoration, hover underline
 */
const variants = {
  primary: `
    inline-flex items-center gap-2
    text-sm font-body font-light tracking-widest uppercase
    text-[var(--text)] hover:text-[var(--text-2)]
    pb-px border-b border-[var(--text)] hover:border-[var(--text-2)]
    transition-colors duration-200
  `,
  pill: `
    inline-flex items-center gap-2
    px-6 py-2.5
    text-sm font-body font-light tracking-widest uppercase
    text-[var(--text)] border border-[var(--line-2)]
    hover:border-[var(--text)]
    transition-colors duration-200 rounded-none
  `,
  ghost: `
    inline-flex items-center gap-2
    text-sm font-body font-light tracking-widest uppercase
    text-[var(--text-2)] hover:text-[var(--text)]
    transition-colors duration-200
  `,
}

const sizes = { sm: '', md: '', lg: 'text-base' }

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  target,
  rel,
  onClick,
  type = 'button',
  disabled = false,
  ...rest
}) {
  const cls = `${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-40 pointer-events-none' : ''}`

  const motion_props = {
    whileHover: { opacity: 0.8 },
    transition: { duration: 0.15 },
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={cls}
        {...motion_props}
        {...rest}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      {...motion_props}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
