'use client'

export default function Error({
  error,
  reset,
}) {
  return (
    <>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Reset</button>
    </>
  )
} 