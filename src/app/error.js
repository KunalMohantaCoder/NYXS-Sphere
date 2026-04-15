'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Something went wrong</h1>
      <button onClick={reset}>Try again</button>
    </div>
  )
}