# TicketHub

A modern support ticket management system with role-based access control. Built for teams that need a straightforward way to organize, prioritize, and resolve customer support tickets.

![TicketHub Dashboard](./dashboard.png)

## Features

- **Role-Based Access Control** - Three permission levels (Admin, Manager, Member) with granular controls
- **Ticket Management** - Create, assign, and track support tickets with status and priority
- **User Management** - Admin dashboard for managing team members and permissions
- **Activity Logs** - Complete audit trail of all system actions
- **Analytics Dashboard** - Track ticket metrics and team performance
- **Dark Mode** - Built-in light/dark theme toggle
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `password123` |
| Manager | `manager@company.com` | `password123` |
| Member | `member@company.com` | `password123` |

No database setup needed—the app runs with in-memory mock data out of the box.

## What You Get

### Admin Dashboard
- Manage all users and their roles
- View system-wide analytics
- Access complete activity audit logs
- Create and manage all tickets

### Manager Dashboard
- Create and assign tickets to team members
- View team performance metrics
- Monitor ticket resolution times
- Track ticket distribution by priority

### Member Dashboard
- View assigned tickets
- Track personal ticket status
- Submit new tickets

## Architecture

The app is built with a clean, permission-based architecture:

**UI Layer** - Role-based feature visibility and UI adjustments
**Server Layer** - Permission validation on all actions (can't bypass via API)
**Data Layer** - Mock in-memory database (swappable with Supabase)

### Permission Matrix

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| Dashboard | ✓ | ✓ | ✓ |
| Create tickets | ✓ | ✓ | ✗ |
| Manage users | ✓ | ✗ | ✗ |
| View analytics | ✓ | ✓ | ✗ |
| View activity logs | ✓ | ✗ | ✗ |

## Tech Stack

- **Framework** - [Next.js 15](https://nextjs.org) with App Router
- **Language** - [TypeScript](https://www.typescriptlang.org)
- **Styling** - [Tailwind CSS 3.4](https://tailwindcss.com)
- **Icons** - [Lucide React](https://lucide.dev)
- **Validation** - [Zod](https://zod.dev)
- **Database** - Mock (ready for [Supabase](https://supabase.com) + [Prisma](https://www.prisma.io))

## Project Layout

```
src/
├── app/
│   ├── (auth)/                    # Login/signup routes
│   ├── (dashboard)/               # Protected dashboard routes
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── layout/                    # Navbar and sidebar
│   ├── auth/                      # Auth forms
│   ├── dashboard/                 # Dashboard components
│   ├── tickets/                   # Ticket components
│   └── users/                     # User components
├── lib/
│   ├── auth/                      # Authentication logic
│   ├── db/                        # Database client
│   ├── validations/               # Zod schemas
│   └── utils/                     # Helpers
└── actions/                       # Server actions
```

## Development

### Available Scripts

```bash
npm run dev              
npm run build           
npm start               
npm run lint            
```

### Code Structure

- **Server Components** - Used for data fetching and permission checks
- **Client Components** - Used for interactivity (forms, modals, etc.)
- **Server Actions** - Handle mutations and permission validation
- **Middleware** - Protects routes and validates sessions

### Adding a New Feature

1. Define the data model in `prisma/schema.prisma`
2. Create validation schema in `lib/validations/`
3. Build server actions in `actions/`
4. Create React components in `components/`
5. Add routes in `app/(dashboard)/`
6. Add permission checks to relevant places

## Database Setup

Currently using mock in-memory data. When ready to use a real database:

### With Supabase

1. Create a [Supabase](https://supabase.com) project
2. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   ```
3. Run migrations:
   ```bash
   npx prisma db push
   npm run seed
   ```
4. Replace mock implementations:
   - `src/lib/db/prisma.ts` - Real Prisma client
   - `src/actions/auth.ts` - Real Supabase auth
   - `src/lib/auth/session.ts` - Real session management

## Testing Locally

### Test Permission Isolation

1. Login as Member and navigate to `/dashboard/users` → Should see access denied
2. Login as Manager and navigate to `/dashboard/activity` → Should see access denied
3. Login as Admin → Should have access to all pages

### Test Ticket Flow

1. Login as Admin or Manager, create a ticket
2. Assign it to a team member
3. Login as the team member and verify you see the ticket
4. Update status and verify changes persist across page reloads

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Import and deploy via Vercel Dashboard
# Set environment variables in Vercel project settings
# Deploy
```

### Environment Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] `DATABASE_URL` configured
- [ ] Database migrations applied (`npx prisma db push`)

## Contributing

Found a bug? Have a feature request? [Open an issue](https://github.com/issues).

## License

MIT - feel free to use this for personal or commercial projects.

## Support

Have questions? Check out the [documentation](https://nextjs.org/docs) for Next.js, [Supabase guides](https://supabase.com/docs), or [open an issue](https://github.com/issues).
