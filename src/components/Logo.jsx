export default function Logo({ className = "w-8 h-8", isDark = false }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arka Plan Dairesi */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        className={isDark ? "fill-rose-950/80 stroke-rose-800" : "fill-sky-100 stroke-sky-300"} 
        strokeWidth="3" 
      />
      
      {/* Tabak / Kase Derinliği */}
      <path 
        d="M 25 52 A 25 25 0 0 0 75 52 Z" 
        className={isDark ? "fill-rose-500" : "fill-sky-600"} 
      />
      
      {/* Buhar / Çatal Çizgileri */}
      <path 
        d="M 38 28 C 36 34, 40 38, 38 44" 
        className={isDark ? "stroke-amber-300" : "stroke-amber-500"} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 50 24 C 48 32, 52 36, 50 44" 
        className={isDark ? "stroke-rose-300" : "stroke-rose-500"} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 62 28 C 60 34, 64 38, 62 44" 
        className={isDark ? "stroke-emerald-300" : "stroke-emerald-500"} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />

      {/* Alışveriş Sepeti Tabandaki Liste Çizgisi */}
      <path 
        d="M 22 68 H 78 M 30 76 H 70" 
        className={isDark ? "stroke-rose-400/80" : "stroke-sky-800/80"} 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
    </svg>
  )
}