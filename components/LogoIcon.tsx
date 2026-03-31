export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="28" x2="17" y2="13" stroke="#1a9e8f" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="13" x2="31" y2="28" stroke="#4ab8ae" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="30" x2="31" y2="30" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,2" />
      <circle cx="7" cy="29" r="5" fill="#0f2a4a" stroke="#1a9e8f" strokeWidth="1.5" />
      <circle cx="19" cy="11" r="7" fill="#1a9e8f" />
      <circle cx="31" cy="29" r="5" fill="#0f2a4a" stroke="#1a9e8f" strokeWidth="1.5" />
    </svg>
  )
}
