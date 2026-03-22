export const duration = {
  fast: 0.1,
  base: 0.2,
  slow: 0.35,
  slower: 0.6,
} as const

export const ease = {
  out: 'easeOut',
  inOut: 'easeInOut',
  outQuart: [0.25, 0.46, 0.45, 0.94] as const,
} as const

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: duration.base, ease: ease.inOut },
}

export const cardHover = {
  whileHover: { borderColor: 'rgba(59,130,246,0.5)', y: -1 },
  transition: { duration: duration.fast, ease: ease.out },
}

export const buttonTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: duration.fast },
}

export const resourcePulse = {
  initial: { scale: 1.3 },
  animate: { scale: 1 },
  transition: { duration: duration.slow, ease: ease.out },
}

export const shakeAnimation = {
  x: [0, -4, 4, -4, 4, 0],
  transition: { duration: duration.slow },
}
