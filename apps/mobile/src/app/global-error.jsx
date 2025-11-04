'use client'

export default function GlobalError({
  error,
  reset,
}) {
  return (
    <p>Error: {error.message}</p>
  )
} 