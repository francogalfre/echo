export type WidgetBranding = {
  accentColor: string;
  projectName: string;
  logoUrl: string | null;
};

export type WidgetVariant = "standalone" | "shadcn";

type BuildWidgetComponentInput = {
  publicKey: string;
  widgetUrl: string;
  branding: WidgetBranding;
  variant: WidgetVariant;
};

function header(input: BuildWidgetComponentInput): string {
  const imports =
    input.variant === "shadcn"
      ? `import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'`
      : `import { useState, type FormEvent } from 'react'`;

  return `'use client'

${imports}

const ECHO_PUBLIC_KEY = '${input.publicKey}'
const ECHO_WIDGET_URL = '${input.widgetUrl}'
const ECHO_ACCENT = '${input.branding.accentColor}'
const ECHO_PROJECT = ${JSON.stringify(input.branding.projectName)}
const ECHO_LOGO = ${input.branding.logoUrl ? JSON.stringify(input.branding.logoUrl) : "null"}

const RATING_LABEL: Record<number, string> = {
  1: 'Bad',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
}

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

type Props = {
  position?: 'left' | 'right'
}`;
}

function submitHandler(): string {
  return `async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
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
  }`;
}

function starRating(variant: WidgetVariant): string {
  const strokeProps =
    variant === "shadcn"
      ? `className={filled ? '' : 'stroke-muted-foreground'}
                          stroke={filled ? ECHO_ACCENT : undefined}`
      : `stroke={filled ? ECHO_ACCENT : '#D1D5DB'}`;

  return `<div
                className="flex items-center justify-start gap-1.5"
                onMouseLeave={() => setHovered(null)}
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const filled = display >= value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHovered(value)}
                      disabled={submitting}
                      aria-label={'Rate ' + value}
                      className="rounded-full p-1 transition hover:scale-110"
                    >
                      <svg width={24} height={24} viewBox="0 0 24 24">
                        <path
                          d={STAR_PATH}
                          fill={filled ? ECHO_ACCENT : 'none'}
                          ${strokeProps}
                          strokeWidth={filled ? 0 : 1.5}
                        />
                      </svg>
                    </button>
                  )
                })}
              </div>`;
}

function commentField(variant: WidgetVariant): string {
  if (variant === "shadcn") {
    return `<Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more… (optional)"
                rows={3}
                disabled={submitting}
              />`;
  }

  return `<textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more… (optional)"
                rows={3}
                disabled={submitting}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-gray-900 transition placeholder:text-gray-400 focus:ring-1 disabled:opacity-50"
              />`;
}

function submitButton(variant: WidgetVariant): string {
  if (variant === "shadcn") {
    return `<Button
                type="submit"
                disabled={submitting || rating === null}
                style={{ backgroundColor: ECHO_ACCENT }}
                className="w-full py-2.5 text-white hover:opacity-90"
              >
                {submitting ? 'Sending...' : 'Send feedback'}
              </Button>`;
  }

  return `<button
                type="submit"
                disabled={submitting || rating === null}
                style={{ backgroundColor: ECHO_ACCENT }}
                className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send feedback'}
              </button>`;
}

function panel(variant: WidgetVariant): string {
  const isShadcn = variant === "shadcn";
  const containerClasses = isShadcn
    ? "border-border bg-background"
    : "border-gray-200 bg-white";
  const titleClass = isShadcn ? "text-sm font-medium" : "text-sm font-medium text-gray-900";
  const closeClass = isShadcn
    ? "text-sm text-muted-foreground transition-colors hover:text-foreground"
    : "text-sm text-gray-400 transition-colors hover:text-gray-600";
  const thanksTitleClass = isShadcn
    ? "text-sm font-medium"
    : "text-sm font-medium text-gray-900";
  const thanksBodyClass = isShadcn
    ? "mt-1 text-xs text-muted-foreground"
    : "mt-1 text-xs text-gray-500";
  const errorClass = isShadcn ? "text-xs text-destructive" : "text-xs text-red-500";

  return `<div className={'fixed bottom-20 ' + side + ' z-50 w-80 rounded-2xl border ${containerClasses} p-6 shadow-xl'}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {ECHO_LOGO ? (
                <img src={ECHO_LOGO} alt={ECHO_PROJECT} className="size-7 rounded-lg object-cover" />
              ) : (
                <span
                  className="flex size-7 items-center justify-center rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: ECHO_ACCENT }}
                >
                  {ECHO_PROJECT.charAt(0).toUpperCase()}
                </span>
              )}
              <p className="${titleClass}">Send us feedback</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="${closeClass}"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center">
              <p className="${thanksTitleClass}">Thanks for your feedback!</p>
              <p className="${thanksBodyClass}">We appreciate you taking the time.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              ${starRating(variant)}

              ${commentField(variant)}

              {error !== null && (
                <p className="${errorClass}">{error}</p>
              )}

              ${submitButton(variant)}
            </form>
          )}
        </div>`;
}

export function buildWidgetComponent(input: BuildWidgetComponentInput): string {
  return `${header(input)}

export function EchoWidget({ position = 'right' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const side = position === 'left' ? 'left-6' : 'right-6'
  const display = hovered ?? rating ?? 0

  ${submitHandler()}

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ backgroundColor: ECHO_ACCENT }}
        className={'fixed bottom-6 ' + side + ' z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90'}
      >
        Feedback
      </button>

      {open && (
        ${panel(input.variant)}
      )}
    </>
  )
}
`;
}
