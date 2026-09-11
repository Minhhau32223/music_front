import { LoaderCircle, Search, X } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { Input } from './Input'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  loading?: boolean
  onClear?: () => void
}
export function SearchInput({ loading, onClear, value, ...props }: SearchInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0
  return (
    <Input
      type="search"
      value={value}
      startIcon={<Search size={17} />}
      endAdornment={
        loading ? (
          <LoaderCircle size={16} className="button-loader" />
        ) : hasValue ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Xóa tìm kiếm"
            onClick={onClear}
          >
            <X size={15} />
          </button>
        ) : undefined
      }
      {...props}
    />
  )
}
