export function generateStandaloneWidget(publicKey: string, widgetUrl: string): string {
  return `'use client'

import { useState, type FormEvent } from 'react'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${widgetUrl}'

const RATING_OPTIONS = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😀' },
  { value: 5, emoji: '😍' },
]

const RATING_LABEL: Record<number, string> = {
  1: 'Bad',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
}

type Props = {
  position?: 'left' | 'right'
}

export function EchoWidget({ position = 'right' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const side = position === 'left' ? 'left-6' : 'right-6'

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (rating === null) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(ECHO_WIDGET_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + ECHO_PUBLIC_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Anonymous',
          feedback: comment.trim().length > 0 ? comment : RATING_LABEL[rating],
          rating,
        }),
      })

      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Failed to send feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={'fixed bottom-6 ' + side + ' z-50 flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90'}
      >
        Feedback
      </button>

      {open && (
        <div className={'fixed bottom-20 ' + side + ' z-50 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl'}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">How was your experience?</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-400 transition-colors hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center">
              <p className="text-sm font-medium text-gray-900">Thanks for your feedback!</p>
              <p className="mt-1 text-xs text-gray-500">We appreciate you taking the time.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                {RATING_OPTIONS.map((item) => {
                  const selected = rating === item.value
                  const base = 'text-2xl rounded-full p-2 transition '
                  const state = selected
                    ? 'ring-2 ring-black bg-gray-100 scale-110'
                    : 'opacity-60 hover:opacity-100'
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRating(item.value)}
                      disabled={submitting}
                      aria-label={'Rate ' + item.value}
                      className={base + state}
                    >
                      {item.emoji}
                    </button>
                  )
                })}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more… (optional)"
                rows={3}
                disabled={submitting}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-gray-900 transition placeholder:text-gray-400 focus:ring-1 disabled:opacity-50"
              />

              {error !== null && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || rating === null}
                className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
`;
}

export function generateShadcnWidget(publicKey: string, widgetUrl: string): string {
  return `'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${widgetUrl}'

const RATING_OPTIONS = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😀' },
  { value: 5, emoji: '😍' },
]

const RATING_LABEL: Record<number, string> = {
  1: 'Bad',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
}

type Props = {
  position?: 'left' | 'right'
}

export function EchoWidget({ position = 'right' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const side = position === 'left' ? 'left-6' : 'right-6'

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (rating === null) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(ECHO_WIDGET_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + ECHO_PUBLIC_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Anonymous',
          feedback: comment.trim().length > 0 ? comment : RATING_LABEL[rating],
          rating,
        }),
      })

      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Failed to send feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={'fixed bottom-6 ' + side + ' z-50 flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-opacity hover:opacity-90'}
      >
        Feedback
      </button>

      {open && (
        <div className={'fixed bottom-20 ' + side + ' z-50 w-80 rounded-2xl border border-border bg-background p-5 shadow-xl'}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">How was your experience?</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center">
              <p className="text-sm font-medium">Thanks for your feedback!</p>
              <p className="mt-1 text-xs text-muted-foreground">We appreciate you taking the time.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                {RATING_OPTIONS.map((item) => {
                  const selected = rating === item.value
                  const base = 'text-2xl rounded-full p-2 transition '
                  const state = selected
                    ? 'ring-2 ring-ring bg-muted scale-110'
                    : 'opacity-60 hover:opacity-100'
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRating(item.value)}
                      disabled={submitting}
                      aria-label={'Rate ' + item.value}
                      className={base + state}
                    >
                      {item.emoji}
                    </button>
                  )
                })}
              </div>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more… (optional)"
                rows={3}
                disabled={submitting}
              />

              {error !== null && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={submitting || rating === null} className="w-full">
                {submitting ? 'Sending...' : 'Send feedback'}
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
`;
}
