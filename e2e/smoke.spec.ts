import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockBackend } from './fixtures'

test('playlist create/add/remove and accessibility dialog', async ({ page }) => {
  const requests = await mockBackend(page)
  await page.goto('/library')
  await page
    .getByRole('main')
    .getByRole('button', { name: 'Tạo playlist', exact: true })
    .last()
    .click()
  await page.getByLabel('Tên playlist', { exact: true }).fill('Smoke playlist')
  const audit = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(audit.violations).toEqual([])
  await page.getByRole('dialog').getByRole('button', { name: 'Tạo playlist', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goto('/search?q=test')
  await page.getByRole('button', { name: 'Tùy chọn cho Test song', exact: true }).click()
  await page.getByRole('menuitem', { name: 'Thêm vào playlist', exact: true }).click()
  await page.getByRole('dialog').getByText('Smoke playlist', { exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goto('/playlist/1')
  await page.getByRole('button', { name: 'Tùy chọn cho Test song', exact: true }).click()
  await page.getByRole('menuitem', { name: 'Xóa khỏi playlist', exact: true }).click()
  await expect(
    page.getByText('Playlist đang trống. Dùng menu của một bài hát để thêm vào đây.'),
  ).toBeVisible()
  expect(requests).toContain('POST /playlists/1/songs')
  expect(requests).toContain('DELETE /playlists/1/songs/1')
})

test('favorite then logout removes private UI and requires login', async ({ page }) => {
  const requests = await mockBackend(page)
  await page.goto('/search?q=test')
  await page.getByRole('button', { name: 'Yêu thích Test song', exact: true }).click()
  await expect.poll(() => requests.includes('POST /favorites/1')).toBe(true)
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Sign in to listen' })).toBeVisible()
  await page.goto('/liked-songs')
  await expect(page.getByRole('heading', { name: 'Sign in to listen' })).toBeVisible()
  await expect(page.getByText('Test song', { exact: true })).toHaveCount(0)
})

test('admin approves pending application', async ({ page }) => {
  await mockBackend(page, 'ADMIN')
  await page.goto('/admin')
  await page.getByRole('button', { name: 'Duyệt', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page
    .getByRole('combobox', { name: 'Trạng thái', exact: true })
    .first()
    .selectOption('approved')
  await expect(page.getByRole('cell', { name: 'Đã duyệt', exact: true })).toBeVisible()
})

test('accessibility artist multipart form', async ({ page }) => {
  await mockBackend(page, 'ARTIST')
  await page.goto('/studio')
  await page.getByRole('button', { name: 'Tạo mới', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const result = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

test('guest catalog, bounded Home requests and search debounce', async ({ page }) => {
  const requests = await mockBackend(page, 'USER', false)
  await page.goto('/home')
  await expect(page.getByRole('heading', { name: 'Latest songs' })).toBeVisible()
  expect(
    requests.filter((path) =>
      /GET \/(songs\/filter|artists\/|albums\/|recommendations\/)/.test(path),
    ).length,
  ).toBeLessThanOrEqual(6)
  await page.goto('/search')
  await page.getByRole('searchbox').fill('test')
  await expect(page.getByRole('heading', { name: 'Songs', exact: true })).toBeVisible()
  expect(requests.filter((path) => path === 'GET /search')).toHaveLength(1)
  await page.goto('/missing-page')
  await expect(page.getByRole('heading', { name: /404/ })).toBeVisible()
})
test('login resolves real role; artist form and admin role boundaries', async ({ page }) => {
  await mockBackend(page, 'ARTIST', false)
  await page.goto('/studio')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  await page.getByLabel('Password', { exact: true }).fill('TestPassword123!')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page.getByRole('heading', { name: 'Studio nghệ sĩ' })).toBeVisible()
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Không có quyền truy cập' })).toBeVisible()
})
test('application submits contract and disables duplicate form', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/artist-application')
  await page.getByLabel('Tên nghệ sĩ').fill('Test applicant')
  await page.getByLabel('Giới thiệu').fill('Test biography')
  await page.getByLabel('URL ảnh đại diện').fill('https://example.com/test.png')
  await page.getByRole('button', { name: 'Gửi hồ sơ' }).click()
  await expect(page.getByText('Chờ duyệt', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Gửi hồ sơ' })).toHaveCount(0)
})
test('admin rejects with reason then displays session result', async ({ page }) => {
  await mockBackend(page, 'ADMIN')
  await page.goto('/admin')
  await page.getByRole('button', { name: 'Từ chối', exact: true }).click()
  await page.getByLabel('Lý do từ chối').fill('Missing details')
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page
    .getByRole('combobox', { name: 'Trạng thái', exact: true })
    .first()
    .selectOption('rejected')
  await expect(page.getByText('Missing details', { exact: true })).toBeVisible()
})
test('metadata duration, real playing history and route continuity', async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit' && process.platform === 'win32',
    'Windows WebKit media backend does not reliably decode test audio; run this case on Linux/macOS WebKit.',
  )
  const requests = await mockBackend(page)
  await page.goto('/search?q=test')
  await page.getByRole('button', { name: 'Phát Test song', exact: true }).click()
  if (isMobile) await page.getByRole('group', { name: 'Trình phát thu gọn' }).click()
  await expect(page.getByRole('slider', { name: 'Tiến độ bài hát' })).toBeEnabled()
  await expect
    .poll(() => requests.filter((path) => path === 'POST /recently-played/play').length)
    .toBe(1)
  await page.getByRole('button', { name: 'Tạm dừng', exact: true }).click()
  await page.getByRole('button', { name: 'Phát', exact: true }).last().click()
  expect(requests.filter((path) => path === 'POST /recently-played/play')).toHaveLength(1)
  if (isMobile) await page.getByRole('button', { name: 'Thu gọn trình phát' }).click()
  await page.getByRole('link', { name: 'Home', exact: true }).last().click()
  await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible()
  expect(
    requests.filter((path) => path === 'GET /stream/song/1/play').length,
  ).toBeGreaterThanOrEqual(1)
})
for (const [path, role] of [
  ['/home', 'USER'],
  ['/search', 'USER'],
  ['/studio', 'ARTIST'],
  ['/admin', 'ADMIN'],
] as const) {
  test(`accessibility ${path}`, async ({ page }) => {
    await mockBackend(page, role)
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(result.violations).toEqual([])
  })
}
