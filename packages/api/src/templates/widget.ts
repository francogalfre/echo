export function generateStandaloneWidget(publicKey: string, widgetUrl: string): string {
  return `'use client'

import { useState, type FormEvent } from 'react'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${widgetUrl}'

type Props = {
  position?: 'left' | 'right'
}

export function EchoWidget({ position = 'right' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const side = position === 'left' ? 'left-6' : 'right-6'

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(ECHO_WIDGET_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + ECHO_PUBLIC_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, feedback }),
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
            <p className="text-sm font-semibold text-gray-900">Share your feedback</p>
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
              <div>
                <label htmlFor="echo-name" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="echo-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-gray-900 transition placeholder:text-gray-400 focus:ring-1 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="echo-feedback" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Feedback
                </label>
                <textarea
                  id="echo-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                  disabled={submitting}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-gray-900 transition placeholder:text-gray-400 focus:ring-1 disabled:opacity-50"
                />
              </div>

              {error !== null && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${widgetUrl}'

type Props = {
  position?: 'left' | 'right'
}

export function EchoWidget({ position = 'right' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const side = position === 'left' ? 'left-6' : 'right-6'

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(ECHO_WIDGET_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + ECHO_PUBLIC_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, feedback }),
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
            <p className="text-sm font-semibold">Share your feedback</p>
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
              <div className="space-y-1.5">
                <Label htmlFor="echo-name">Name</Label>
                <Input
                  id="echo-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="echo-feedback">Feedback</Label>
                <Textarea
                  id="echo-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                  disabled={submitting}
                />
              </div>

              {error !== null && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
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
