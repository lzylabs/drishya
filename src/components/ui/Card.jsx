import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  delay = 0,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`
        card-glass rounded-2xl p-6
        ${glow ? 'hover:shadow-[var(--shadow-glow-violet)]' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
