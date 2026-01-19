# Development Guide

This guide covers local development setup and best practices for working on TicketHub.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- A code editor (VS Code recommended)

### Installation

```bash
git clone https://github.com/huddylatimer/tickethub.git
cd tickethub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                   # Next.js App Router routes
│   ├── (auth)/           # Login/signup
│   └── (dashboard)/      # Protected pages
├── components/           # React components
│   ├── ui/              # Button, Input, Badge, etc.
│   ├── layout/          # Navbar, Sidebar
│   ├── auth/            # Auth forms
│   ├── dashboard/       # Dashboard components
│   ├── tickets/         # Ticket components
│   └── users/           # User components
├── lib/                 # Utilities
│   ├── auth/            # Session & permissions
│   ├── db/              # Database client
│   ├── validations/     # Zod schemas
│   └── utils/           # Helpers
└── actions/             # Server actions
```

## Common Tasks

### Start Development

```bash
npm run dev
```

Hot reload is automatic. Changes refresh your browser instantly.

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
npm run lint -- --fix
```

### Database Commands

```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create migration
npm run prisma:push        # Push schema to database
npx prisma studio         # Open database GUI
npm run seed              # Run seed script
```

## Development Workflow

### Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### Test Before Pushing

```bash
npm run dev          # Start server
npm run lint         # Check code style
```

### Commit and Push

```bash
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

## Adding a New Page

1. **Create route**: `src/app/(dashboard)/mypage/page.tsx`
2. **Add permission checks**:
   ```tsx
   import { getSession, requireRole } from "@/lib/auth/session";

   export default async function MyPage() {
     const session = await getSession();
     requireRole(session, ["ADMIN"]); // Restrict to admins
     return <div>{/* content */}</div>;
   }
   ```
3. **Create components**: `src/components/mypage/MyComponent.tsx`
4. **Add to sidebar**: Edit `src/components/layout/Sidebar.tsx`

## Adding a Component

```tsx
// src/components/MyComponent.tsx
interface Props {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {onClick && <button onClick={onClick}>Click</button>}
    </div>
  );
}
```

## Testing Locally

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `password123` |
| Manager | `manager@company.com` | `password123` |
| Member | `member@company.com` | `password123` |

### Test Permission Isolation

1. Login as Member
2. Go to `/dashboard/users` → Should be denied
3. Login as Admin
4. Go to `/dashboard/users` → Should work

### Test Data Persistence

1. Create a ticket
2. Refresh the page → Ticket persists
3. Restart dev server → Data resets (mock database)

### Test Responsive Design

1. Open DevTools (F12)
2. Click mobile icon
3. Try different screen sizes

## Debugging

### View Console

```tsx
console.log("value:", something);
```

### Use Debugger

```tsx
debugger; // Execution pauses here
```

### Browser DevTools

- Console tab: See errors
- Network tab: Check API calls
- Application tab: View cookies/storage

## Styling

Using Tailwind CSS with custom theme.

Common classes:
- `p-4` (padding)
- `m-2` (margin)
- `text-sm` (font size)
- `bg-slate-900` (background)
- `dark:bg-slate-900` (dark mode)
- `rounded-lg` (border radius)

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Without these, the app uses mock auth.

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Node Modules Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npm run prisma:generate
```

## VS Code Extensions

Recommended:
- **ES7+ React/Redux snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **Prisma** - prisma.prisma

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)

## Getting Help

- Check [README.md](README.md)
- Read [CONTRIBUTING.md](CONTRIBUTING.md)


