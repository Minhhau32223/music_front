import { CircleAlert, Disc3, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { isApiError } from '@/lib/api/api-error'

export function DetailPageSkeleton() {
  return (
    <div className="page detail-page" aria-label="Đang tải trang chi tiết">
      <div className="detail-skeleton-hero">
        <div className="skeleton detail-skeleton-art" />
        <div className="detail-skeleton-copy">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton detail-skeleton-title" />
          <div className="skeleton skeleton-line" />
        </div>
      </div>
      <div className="detail-skeleton-list">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="skeleton detail-skeleton-row" key={index} />
        ))}
      </div>
    </div>
  )
}

export function DetailErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const status = isApiError(error) ? error.status : 0
  const title = status === 403 ? 'Không có quyền truy cập' : 'Không thể tải nội dung'
  const message =
    status === 403
      ? 'Tài khoản hiện tại không thể xem nội dung này.'
      : status === 0
        ? 'Không thể kết nối tới NOCTURNE. Hãy kiểm tra kết nối và thử lại.'
        : 'NOCTURNE đang gặp sự cố. Hãy thử lại sau ít phút.'
  return (
    <div className="page">
      <div className="state-card" role="alert">
        <div>
          <CircleAlert size={34} color="var(--error)" />
          <h1>{title}</h1>
          <p>{message}</p>
          <Button variant="secondary" onClick={onRetry}>
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DetailNotFoundState({ entity }: { entity: string }) {
  return (
    <div className="page">
      <div className="state-card" role="status">
        <div>
          <SearchX size={34} color="var(--text-muted)" />
          <h1>Không tìm thấy {entity}</h1>
          <p>Liên kết có thể không hợp lệ hoặc nội dung đã được gỡ.</p>
          <Link className="button secondary-variant" to="/home">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export function DetailSectionState({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
}: {
  loading: boolean
  error: boolean
  empty: boolean
  emptyMessage: string
  onRetry: () => void
}) {
  if (loading) {
    return (
      <div className="detail-section-state" role="status">
        <span className="button-loader" /> Đang tải…
      </div>
    )
  }
  if (error) {
    return (
      <div className="detail-section-state" role="alert">
        <CircleAlert size={19} /> Không thể tải mục này.
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    )
  }
  if (empty) {
    return (
      <div className="detail-section-state">
        <Disc3 size={19} /> {emptyMessage}
      </div>
    )
  }
  return null
}
