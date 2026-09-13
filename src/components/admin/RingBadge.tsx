const RingBadge = ({
  percent,
  color,
  size = 44,
}: {
  percent: number;
  color: string;
  size?: number;
}) => {
  const clamped = Math.max(0, Math.min(100, percent));

  const strokeWith = 4;
  const radius = (size - strokeWith) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-admin-border)"
          strokeWidth={strokeWith}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWith}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-admin-ink">
        {Math.round(clamped)}%
      </span>
    </div>
  );
};

export default RingBadge;
