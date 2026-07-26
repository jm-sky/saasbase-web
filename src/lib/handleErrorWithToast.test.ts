import { beforeEach, describe, expect, it, vi } from 'vitest'

const toastError = vi.fn()

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: Object.assign(vi.fn(), {
      error: toastError,
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    }),
  }),
  toast: Object.assign(vi.fn(), {
    error: toastError,
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

vi.mock('@/i18n', () => ({
  i18n: {
    global: {
      t: (key: string) => key,
    },
  },
}))

describe('handleErrorWithToast', () => {
  beforeEach(() => {
    toastError.mockClear()
  })

  it('shows axios response message as description', async () => {
    const { handleErrorWithToast } = await import('@/lib/handleErrorWithToast')
    const { AxiosError } = await import('axios')

    const error = new AxiosError('Request failed')
    error.response = {
      data: { message: 'Backend says no' },
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: { headers: {} as never },
    }

    handleErrorWithToast('Could not save', error)

    expect(toastError).toHaveBeenCalledWith('Could not save', {
      description: 'Backend says no',
    })
  })

  it('falls back to common.unknownError for non-axios errors', async () => {
    const { handleErrorWithToast } = await import('@/lib/handleErrorWithToast')

    handleErrorWithToast('Could not save', new Error('boom'))

    expect(toastError).toHaveBeenCalledWith('Could not save', {
      description: 'common.unknownError',
    })
  })
})
