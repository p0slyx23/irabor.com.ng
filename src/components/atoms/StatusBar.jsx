export default function StatusBar({ height = 20, color = '#fff' }) {
  return (
    <div
      style={{
        height: `${height}px`,
        width: '100%',
        backgroundColor: `${color}`,
        position: 'fixed',
        top: -14,
        left: 0,
        zIndex: 9999,
      }}
    />
  )
}
