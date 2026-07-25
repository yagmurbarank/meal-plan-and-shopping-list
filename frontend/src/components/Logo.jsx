export default function Logo({ className = "w-9 h-9", isDark = false }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} flex-shrink-0 block`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        fill={isDark ? "#4c0519" : "#e0f2fe"} 
        stroke={isDark ? "#9f1239" : "#7dd3fc"} 
        strokeWidth="4" 
      />
      
      <path 
        d="M 25 52 A 25 25 0 0 0 75 52 Z" 
        fill={isDark ? "#f43f5e" : "#0284c7"} 
      />
      
      <path 
        d="M 38 26 C 36 32, 40 36, 38 42" 
        stroke={isDark ? "#fcd34d" : "#f59e0b"} 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <path 
        d="M 50 22 C 48 30, 52 34, 50 42" 
        stroke={isDark ? "#fda4af" : "#ef4444"} 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <path 
        d="M 62 26 C 60 32, 64 36, 62 42" 
        stroke={isDark ? "#6ee7b7" : "#10b981"} 
        strokeWidth="4" 
        strokeLinecap="round" 
      />

      <path 
        d="M 24 66 H 76 M 32 74 H 68" 
        stroke={isDark ? "#fb7185" : "#0369a1"} 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
    </svg>
  )
}