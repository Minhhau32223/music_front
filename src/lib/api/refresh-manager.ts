export class RefreshManager<T> {
  private activeRefresh: Promise<T> | null = null

  run(factory: () => Promise<T>): Promise<T> {
    if (!this.activeRefresh) {
      this.activeRefresh = factory().finally(() => {
        this.activeRefresh = null
      })
    }
    return this.activeRefresh
  }
}

export const accessTokenRefreshManager = new RefreshManager<string>()
