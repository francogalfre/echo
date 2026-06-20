# Echo — Product Requirements Document (PRD)

## 1. Product Vision

**Echo** is feedback infrastructure for developers. A middle ground between Google Forms (too simple) and Canny (too closed).
**Mission**: Collect feedback from anywhere, analyze it with AI, showcase it everywhere.
**User**: Independent developers, small teams, indie hackers building products.

---

## 2. Core Problem

Developers need to:

- 📥 Collect feedback (forms, API, widgets)
- 🧠 Understand sentiment (manual reading sucks)
- 📊 Showcase feedback (testimonials, social proof)

---

## 3. User Personas

### Persona 1: Alex (Indie Developer)

- Building a SaaS solo
- Uses Google Forms + manual analysis
- Wants: Simple API, free tier, quick setup
- Pain: Overwhelming feedback, no insights

### Persona 2: Maya (Product Manager)

- Team of 5, funded startup
- Uses Canny but finds it expensive
- Wants: Team collaboration, AI summaries, integrations
- Pain: Cost, limited customization

### Persona 3: James (Enterprise)

- Large team, multiple products
- Needs: Multi-tenancy, SSO, dedicated support
- Wants: White-label, custom domain, advanced analytics
- Pain: Vendors lock-in, inflexible pricing

---

## 4. Product Scope (MVP → Phase 2)

### MVP (Now - Week 4)

```
✅ Authentication (email, Google, GitHub)
✅ Create organization
✅ Create project
✅ Send feedback (form + API)
✅ List feedback with sentiment
✅ Basic dashboard (charts)
```

### Phase 1 (Week 5-8)

```
✅ Weekly AI summaries (Pro only)
✅ Custom feedback form fields
✅ Team members (invite, roles)
✅ Public feedback page (with publishable key)
✅ Rate limiting
```

### Phase 2 (Week 9-12)

```
✅ RAG chat ("Ask about feedback")
✅ Polar integration (subscriptions)
✅ Custom domain
✅ Webhooks
✅ Import from Canny/Typeform
```

### Later (Phase 3+)

```
❌ White-label
❌ Advanced analytics (cohorts, funnels)
❌ AI-powered recommendations
❌ Community (feedback marketplace)
❌ Mobile app
```

---

## 5. Proposed Sidebar Structure

### Option A: Feature-based (Recommended)

```
ECHO
├── 📊 Home
│   ├── Dashboard (charts, recent feedback, quick stats)
│   └── Onboarding (setup checklist)
│
├── 💬 Feedback
│   ├── All Feedback (searchable list, filter by sentiment)
│   ├── Feedback Detail (view, edit, delete)
│   └── Add Feedback (manual entry)
│
├── ⚙️ Collect
│   ├── Feedback Page (customize form, colors, branding)
│   ├── API Setup (key management, docs, webhooks)
│   └── Widget (embed code, preview)
│
├── 👥 Team
│   ├── Members (invite, manage roles)
│   └── Projects (switch project, create new)
│
├── 📈 Settings
│   ├── Organization (name, logo, billing)
│   ├── Project Settings (plan, limits, data)
│   └── Account (password, email, preferences)
│
└── (Logout button or profile menu)
```

**Pros:**

- Clear mental model
- Scalable (easy to add features)
- Features grouped logically
- Separates "consume" (Feedback) from "configure" (Collect, Team, Settings)

---

### Option B: Project-first (Alternative)

```
ECHO
├── 📊 Home (global view)
│
├── Projects (dropdown)
│   ├── Project A
│   │   ├── Dashboard
│   │   ├── Feedback
│   │   ├── Collect (form + API)
│   │   └── Settings
│   │
│   └── Project B
│       ├── Dashboard
│       ├── Feedback
│       ├── Collect
│       └── Settings
│
├── 👥 Organization
│   ├── Team Members
│   ├── Billing
│   └── Settings
│
└── (Logout)
```

**Pros:**

- Multi-project navigation clear
- Pro users appreciate per-project settings
- Cons: More navigation overhead for single-project users

---

## 6. Recommended: Option A + Improvements

I recommend **Option A** but with improvements:

```
ECHO [Organization Logo]

📊 Home
💬 Feedback
⚙️ Collect
👥 Team
📈 Settings

[Billing status bar if on Free trial]

────────────

[User profile card at bottom]
Franco • franco@...
[Logout icon]
```

---

## 7. Page Breakdown & Features

### 📊 HOME

**Purpose:** Dashboard overview + onboarding

**What shows:**

```
┌─────────────────────────────────────┐
│ Welcome back, Franco! 👋            │
│                                     │
│ [Onboarding checklist if new]      │
│ 🔲 Collect first feedback          │
│ 🔲 Invite team members             │
│ 🔲 Customize form page             │
│                                     │
├─────────────────────────────────────┤
│ This Month                          │
│ Feedback: 247 | Positive: 180 (73%)│
│ Weekly avg: 61.75 feedbacks        │
│                                     │
│ [Chart: Sentiment over time]       │
│ [Chart: Feedback source]           │
│                                     │
├─────────────────────────────────────┤
│ Recent Feedback                     │
│ • "Your product is amazing!" (pos) │
│ • "Slow on mobile" (neg)           │
│ • [See all →]                      │
│                                     │
├─────────────────────────────────────┤
│ Quick Actions                       │
│ [+ Add Feedback] [📋 Copy API key] │
│ [👥 Invite team] [⚙️ Settings]     │
└─────────────────────────────────────┘
```

**Features:**

- Stats card (feedback count, sentiment ratio, trends)
- Charts (sentiment over time, by source, by field)
- Recent feedback list (5 items)
- Onboarding checklist (disappears after complete)
- Quick action buttons

---

### 💬 FEEDBACK

**Purpose:** Browse, search, filter all feedback

**Sub-pages:**

#### 💬 Feedback → All Feedback

```
┌─────────────────────────────────────┐
│ Feedback                            │
│ [Search box] [Filters ▼]           │
│ [Sentiment: All ▼] [Source: All ▼] │
│ [Sort: Newest ▼]                   │
├─────────────────────────────────────┤
│ Showing 247 results                 │
│                                     │
│ [🟢] "Amazing product!" — Alice    │
│      form · 2 days ago              │
│      [View] [Edit] [Delete]        │
│                                     │
│ [🔴] "Slow on mobile" — Bob        │
│      api · 1 day ago                │
│      [View] [Edit] [Delete]        │
│                                     │
│ [⚪] "feature request: X" — Carol   │
│      form · 1 hour ago              │
│                                     │
│ [Previous] [1] [2] [3] [Next]      │
└─────────────────────────────────────┘
```

**Features:**

- Searchable by text
- Filter by: sentiment, source (api/form/widget), date range
- Sentiment color indicators (green/red/gray)
- Bulk actions (select multiple → delete/export/tag)
- Pagination or infinite scroll
- Quick view modal (click → see full feedback)

#### 💬 Feedback → Detail View

```
┌─────────────────────────────────────┐
│ ← Back to Feedback                  │
├─────────────────────────────────────┤
│ [🟢] Sentiment: Positive            │
│                                     │
│ "Your product changed my life!"    │
│                                     │
│ Author: Alice Cooper               │
│ Source: Form (echo.app/proj_...)   │
│ Date: March 15, 2026               │
│ Category: Feature Request (AI)     │
│                                     │
├─────────────────────────────────────┤
│ Actions:                            │
│ [Edit] [Change sentiment]           │
│ [Tag] [Delete] [Export]            │
│                                     │
│ [Similar feedback ↓]               │
│ • "Life-changing tool" (pos)       │
│ • "Best product I've used" (pos)   │
│                                     │
│ [Reply / Add note]                 │
│ (Team members can collaborate)     │
└─────────────────────────────────────┘
```

---

### ⚙️ COLLECT

**Purpose:** Manage how feedback comes in (form, API, widget)

**Sub-pages:**

#### ⚙️ Collect → Feedback Page

```
┌─────────────────────────────────────┐
│ Your Feedback Form                  │
│ Live at: echo.app/feedback/proj_... │
│ [Copy link] [Preview] [Open in new] │
├─────────────────────────────────────┤
│ Customization                       │
│                                     │
│ Form Title                          │
│ [Your feedback matters!]           │
│                                     │
│ Form Description                    │
│ [Help us improve...]               │
│                                     │
│ Fields (Pro feature)                │
│ ☑ Author Name (required)           │
│ ☑ Feedback Content (required)      │
│ ☑ Email (optional)                 │
│ ☐ Company (optional)               │
│ ☐ Product using (optional)         │
│ [+ Add custom field]               │
│                                     │
│ Branding                            │
│ Primary color: [#6B5CE7] ◼         │
│ Logo: [Upload]                     │
│                                     │
│ Redirect after submit:             │
│ [Thank you page / Custom URL]      │
│                                     │
│ [Save changes] [Reset]             │
└─────────────────────────────────────┘
```

**Features:**

- Customize title, description
- Add optional fields (Pro only)
- Color branding
- Logo upload
- Preview in real-time
- Publish/unpublish toggle
- View response count

#### ⚙️ Collect → API Setup

```
┌─────────────────────────────────────┐
│ API Documentation                   │
│ [Copy endpoint] [View docs]        │
├─────────────────────────────────────┤
│ Keys                                │
│                                     │
│ Secret Key (for server)            │
│ echo_sk_3jk2h1k2j3k12j3k1...      │
│ [Copy] [Regenerate] [Delete]       │
│                                     │
│ Publishable Key (for frontend)     │
│ echo_pk_2jk2h1k2j3k12j3k1...      │
│ [Copy] [Regenerate] [Delete]       │
├─────────────────────────────────────┤
│ Quick Example                       │
│                                     │
│ curl -X POST https://api.echo.app/ │
│   feedback \                        │
│   -H "Authorization: Bearer echo_sk" │
│   -d '{"content":"...","source":"api"}' │
│                                     │
│ [Copy] [See full docs]             │
├─────────────────────────────────────┤
│ Rate Limits (Free)                 │
│ 100 requests/month                 │
│ You've used: 47/100                │
│                                     │
│ [Upgrade to Pro for unlimited]     │
└─────────────────────────────────────┘
```

**Features:**

- Display both secret and publishable keys
- One-click copy
- Key regeneration
- Code examples (curl, js, python)
- Rate limit usage
- Link to full API docs
- Webhook setup (Phase 2)

#### ⚙️ Collect → Widget (if we add it)

```
Embed code, preview, customization options
(This can come in Phase 2 if needed)
```

---

### 👥 TEAM

**Purpose:** Manage team members and projects

**Sub-pages:**

#### 👥 Team → Members

```
┌─────────────────────────────────────┐
│ Team Members                        │
│ [+ Invite team member]             │
├─────────────────────────────────────┤
│ Franco Galfré (you)                │
│ franco@echo.app                    │
│ Owner • Joined March 1             │
│                                     │
│ Alice Cooper                        │
│ alice@example.com                  │
│ Admin • Joined March 5             │
│ [Change role ▼] [Remove]           │
│                                     │
│ [Pending invites...]               │
│ bob@example.com (Invited yesterday) │
│ [Resend] [Cancel]                  │
│                                     │
│ Roles:                              │
│ • Owner: Full access, billing      │
│ • Admin: Full access except billing │
│ • Member: View only (Pro+)         │
│ • Viewer: Read-only (Pro+)         │
└─────────────────────────────────────┘
```

**Features:**

- List all members + their role
- Invite form (email)
- Resend invite
- Change role
- Remove member
- Role descriptions

#### 👥 Team → Projects

```
┌─────────────────────────────────────┐
│ Projects                            │
│ [+ Create project]                 │
├─────────────────────────────────────┤
│ My SaaS (active)                   │
│ 247 feedback • Positive: 73%       │
│ Created: Jan 2026                  │
│ [Switch to this] [Settings]        │
│                                     │
│ API Tool (archived)                │
│ 12 feedback • Positive: 80%        │
│ Created: Nov 2025                  │
│ [Switch to] [Archive] [Delete]     │
│                                     │
│ Usage:                              │
│ • Free plan: 1 active project      │
│ • Pro plan: 5 active projects      │
│                                     │
│ [Upgrade for more projects]        │
└─────────────────────────────────────┘
```

**Features:**

- List projects (active + archived)
- Quick stats per project
- Switch between projects
- Create new project
- Archive/unarchive
- Delete (after confirmation)

---

### 📈 SETTINGS

**Purpose:** Configure organization, project, and account

**Sub-pages:**

#### 📈 Settings → Organization

```
┌─────────────────────────────────────┐
│ Organization Settings               │
├─────────────────────────────────────┤
│ Organization Name                   │
│ [My Company]                        │
│                                     │
│ Organization Slug                   │
│ [my-company]                        │
│ (Used in URLs and billing)         │
│                                     │
│ Logo                                │
│ [Upload]                            │
│                                     │
│ Billing Plan                        │
│ Free • 1 project, 100 fb/month     │
│ [Upgrade to Pro → $9/month]        │
│                                     │
│ Payment Method                      │
│ [Manage via Polar →]               │
│                                     │
│ Danger Zone                         │
│ [Delete organization] (⚠️ permanent) │
│ [Save]                              │
└─────────────────────────────────────┘
```

#### 📈 Settings → Project Settings

```
┌─────────────────────────────────────┐
│ Project Settings                    │
├─────────────────────────────────────┤
│ Project Name                        │
│ [My SaaS]                           │
│                                     │
│ Project Slug                        │
│ [my-saas]                           │
│                                     │
│ Description (optional)              │
│ [What is this project about?]      │
│                                     │
│ Data & Privacy                      │
│ Feedback retention: 90 days        │
│ [Change retention ▼]               │
│                                     │
│ Auto-delete after [30] days        │
│ (Pro feature: customize)           │
│                                     │
│ Usage (this month)                  │
│ Feedback: 47/100 (Free limit)      │
│ AI analyses: 12/100                │
│                                     │
│ Danger Zone                         │
│ [Archive project]                  │
│ [Delete project] (⚠️ permanent)    │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

#### 📈 Settings → Account

```
┌─────────────────────────────────────┐
│ Account Settings                    │
├─────────────────────────────────────┤
│ Profile                             │
│ Name: [Franco Galfré]              │
│ Email: franco@echo.app (verified)  │
│                                     │
│ Password                            │
│ [Change password]                   │
│                                     │
│ Two-Factor Authentication           │
│ Status: Disabled                    │
│ [Enable 2FA]                        │
│                                     │
│ Sessions                            │
│ Active sessions: 2                  │
│ [View all] [Sign out everywhere]   │
│                                     │
│ Connected Apps                      │
│ Google: connected                   │
│ [Disconnect]                        │
│                                     │
│ Email Preferences                   │
│ ☑ Weekly summary                   │
│ ☑ Feedback notifications           │
│ ☐ Marketing emails                 │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

---

## 8. Feature Distribution by Plan

| Feature            | Free          | Pro       | Custom    |
| ------------------ | ------------- | --------- | --------- |
| Projects           | 1             | 5         | Unlimited |
| Team members       | 1 owner       | 5         | Unlimited |
| Feedback/month     | 100           | 2,000     | Unlimited |
| AI analyses        | Included      | Included  | Included  |
| Weekly summary     | —             | ✅        | ✅        |
| Custom form fields | —             | ✅        | ✅        |
| Custom domain      | —             | ✅        | ✅        |
| Webhooks           | —             | ✅        | ✅        |
| RAG chat           | —             | (Phase 2) | ✅        |
| API access         | Public (read) | Full      | Full      |
| Support            | Email         | Priority  | Dedicated |

---

## 9. Navigation Flow (Happy Path)

```
Sign up / Sign in
    ↓
Create Organization
    ↓
Create Project
    ↓
HOME (see empty dashboard)
    ↓
COLLECT → Feedback Page (copy link)
    ↓
COLLECT → API Setup (copy key)
    ↓
FEEDBACK → Add first feedback
    ↓
HOME (see chart update)
    ↓
TEAM → Invite team member
    ↓
(Loop: Collect feedback daily)
    ↓
SETTINGS → View usage / upgrade
```

---

## 10. Summary: Best Sidebar

**Recommended structure:**

```
ECHO

📊 Home
💬 Feedback
  ├─ All Feedback
  ├─ Add Feedback
  └─ (Detail view opens modal)

⚙️ Collect
  ├─ Feedback Page
  ├─ API Setup
  └─ Widget (Phase 2)

👥 Team
  ├─ Members
  └─ Projects

📈 Settings
  ├─ Organization
  ├─ Project
  └─ Account

────────────
[User profile card]
[Logout]
```

**Why this works:**

- Clear separation: consume (Feedback) vs configure (Collect, Team, Settings)
- Home is entry point, shows why you're here
- Collect is where setup happens (onboarding path)
- Team for collaboration
- Settings for everything else
- Scales well (easy to add Phase 2 features)

---

## 11. Implementation Order

```
Week 1:
✅ Auth (done)
✅ Home (charts, recent feedback)
✅ Feedback (list, detail modal)

Week 2:
✅ Collect → Feedback Page
✅ Collect → API Setup

Week 3:
✅ Team → Members
✅ Team → Projects
✅ Project switcher (top of sidebar)

Week 4:
✅ Settings (all 3 pages)
✅ Billing integration (Polar)
✅ Launch
```

---

## 12. Database Tables (Scope)

```
Auth:
├── users
├── sessions
├── accounts
└── organizations, organization_members

Core:
├── projects
├── feedback
├── feedback_sentiment (AI)
└── api_keys

Team:
├── team_members (invites)
└── project_members

Settings:
├── organization_settings
└── project_settings
```

---

## 13. Success Metrics (North Star)

- 🎯 **Feedback collected**: Total feedbacks across all projects
- 🎯 **Active projects**: Projects with feedback in last 7 days
- 🎯 **Users retaining**: Users coming back weekly
- 🎯 **API usage**: Requests per day (indicator of integration)
- 🎯 **Plan upgrades**: Free → Pro conversions

---

## 14. Final PRD Summary

```
✅ Vision: Feedback infrastructure (API-first, AI, simple)
✅ MVP scope: Auth → Dashboard → Feedback → Collect → Team
✅ Sidebar: Home | Feedback | Collect | Team | Settings
✅ Pages: 8 main pages (Home, 2x Feedback, 3x Collect, 2x Team, 3x Settings)
✅ Features: Clearly distributed by plan and timeline
✅ Implementation: 4-week sprint to launch
```

**Start building.** 🚀
