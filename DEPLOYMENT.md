# Deployment Guide

This guide covers deploying TicketHub to production.

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Analytics configured (optional)

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your TicketHub repository
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   DATABASE_URL
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Select environments (Production, Preview, Development)
4. Click "Save"

### Step 4: Deploy

1. Return to the Overview tab
2. Click "Deploy"
3. Wait for build to complete (usually 2-5 minutes)
4. Visit your deployment URL

## Database Setup (Supabase)

### Create Project

1. Visit [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a region close to your users
4. Set a strong database password
5. Wait for project to initialize

### Get Connection Details

From your Supabase dashboard:

1. Go to Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to Settings → Database
6. Copy connection string → `DATABASE_URL`

### Run Migrations

After setting environment variables:

```bash
npx prisma db push --skip-generate
npm run seed
```

## Domain Setup

### Configure Custom Domain

1. In Vercel Dashboard, go to Settings → Domains
2. Enter your domain name
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually 24 hours)

### Update Environment Variables

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Redeploy for changes to take effect.

## Monitoring

### Enable Vercel Analytics

1. Vercel Dashboard → Settings → Analytics
2. Enable Web Analytics
3. View real-time metrics

### Check Database

```bash
# Connect to production database
npx prisma studio --data-proxy

# View logs
# Supabase Dashboard → Logs
```

## Rollback

If something goes wrong:

```bash
# Revert to previous deployment
# Vercel Dashboard → Deployments → Select previous deployment → Click "..."
# → Promote to Production
```

## Performance Optimization

### Enable Caching

In `next.config.ts`:

```typescript
export default {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'cache-control',
          value: 'public, max-age=60',
        },
      ],
    },
  ],
}
```

### Database Query Optimization

1. Add indexes to frequently queried columns
2. Use pagination for large result sets
3. Monitor slow queries in Supabase

## Security Checklist

- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables secured
- [ ] RLS policies enabled in Supabase
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] No hardcoded secrets in code
- [ ] Dependencies updated and audited

## Scaling

### Horizontal Scaling

Vercel automatically scales based on traffic. No additional configuration needed.

### Database Scaling

Monitor in Supabase:

1. Dashboard → Database → Usage
2. Consider upgrading if approaching limits
3. Supabase bills based on usage

## Logging & Monitoring

### Application Logs

```bash
# View real-time logs
# Vercel Dashboard → Logs

# View builds
# Vercel Dashboard → Deployments
```

### Database Logs

```bash
# Supabase Dashboard → Logs
```

## Disaster Recovery

### Backup Database

Enable automated backups in Supabase:

1. Dashboard → Backups
2. Enable daily backups
3. Store backups in Supabase (included in plan)

### Database Restore

```bash
# Restore from a backup point
# Contact Supabase support for manual restoration
```

## Troubleshooting

### Build Fails

1. Check Vercel logs for specific error
2. Verify environment variables are set
3. Run `npm run build` locally to reproduce

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Verify IP whitelist (if configured)

### Performance Issues

1. Check Vercel Analytics for bottlenecks
2. Profile database queries
3. Enable caching where appropriate

## Getting Help

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Open an issue](https://github.com/huddylatimer/tickethub/issues)

---

**Questions?** Check the main [README](README.md) or [open an issue](https://github.com/huddylatimer/tickethub/issues).
