export default function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  return (
    <span className="tabular-nums">
      {prefix}{Number(end).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
