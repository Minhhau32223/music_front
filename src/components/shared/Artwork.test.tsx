import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Artwork } from './Artwork'
describe('Artwork', () => {
  it('uses fallback for missing and broken artwork', () => {
    const { rerender } = render(<Artwork alt="Album cover" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    rerender(<Artwork src="broken.jpg" alt="Album cover" />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
