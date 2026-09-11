export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}
export function CardSkeleton() {
  return (
    <div className="skeleton-card" aria-label="Đang tải thẻ nhạc">
      <Skeleton className="skeleton-square" />
      <Skeleton className="skeleton-line" />
      <Skeleton className="skeleton-line short" />
    </div>
  )
}
export function SongSkeleton() {
  return (
    <div className="skeleton" style={{ width: '100%', height: 56 }} aria-label="Đang tải bài hát" />
  )
}
export function AvatarSkeleton() {
  return <Skeleton className="avatar md" />
}
