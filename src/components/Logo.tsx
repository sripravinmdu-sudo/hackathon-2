// AttendGuard Logo Component - Abstract geometric symbol

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 32, showWordmark = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Abstract geometric icon: hexagonal trajectory symbol */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagonal frame */}
        <path
          d="M16 3 L27 9.5 L27 22.5 L16 29 L5 22.5 L5 9.5 Z"
          stroke="rgba(99,102,241,0.35)"
          strokeWidth="1"
          fill="none"
        />
        {/* Inner frame */}
        <path
          d="M16 7 L24 11.5 L24 20.5 L16 25 L8 20.5 L8 11.5 Z"
          stroke="rgba(99,102,241,0.2)"
          strokeWidth="0.75"
          fill="rgba(99,102,241,0.05)"
        />
        {/* Trajectory arrow - upward trend */}
        <path
          d="M9 20 L14 13 L19 16.5 L23 10"
          stroke="#6366f1"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Endpoint dot */}
        <circle cx="23" cy="10" r="2" fill="#6366f1" />
        {/* Origin dot */}
        <circle cx="9" cy="20" r="1.25" fill="rgba(99,102,241,0.5)" />
      </svg>

      {showWordmark && (
        <span
          className="font-bold tracking-tight text-white"
          style={{ fontSize: size * 0.56, letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif' }}
        >
          Attend<span className="text-indigo-400">Guard</span>
        </span>
      )}
    </div>
  );
}
