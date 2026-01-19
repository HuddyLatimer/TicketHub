# Contributing to TicketHub

Thanks for considering contributing to TicketHub! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/huddylatimer/tickethub.git
   cd tickethub
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## Code Style

- Use **TypeScript** for all code
- Follow the existing code structure and patterns
- Use `const` for variables, prefer arrow functions
- Keep components small and focused
- Add comments only when logic isn't self-evident

### Component Structure

```tsx
// Imports
import { useState } from "react";
import type { Props } from "@/types";

// Props interface
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Click me</button>
    </div>
  );
}
```

### Server Action Structure

```tsx
"use server";

import { requireSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export async function myAction(data: MyInput) {
  try {
    const session = await requireSession();

    if (!hasPermission(session.profile, "required_permission")) {
      throw new Error("Permission denied");
    }

    // Do the thing
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
```

## What to Work On

### Good First Issues

- Documentation improvements
- Bug fixes (check issues labeled `bug`)
- UI/UX improvements
- Performance optimizations
- Additional validation rules

### Feature Areas

1. **Ticket System** - `src/app/(dashboard)/tickets`
2. **User Management** - `src/app/(dashboard)/users`
3. **Analytics** - `src/app/(dashboard)/analytics`
4. **Activity Logs** - `src/app/(dashboard)/activity`
5. **UI Components** - `src/components/ui`

## Testing Your Changes

1. **Run the dev server** and test manually
2. **Test permission isolation** - verify users can't access restricted features
3. **Test in both themes** - light mode and dark mode
4. **Test mobile** - check responsiveness on smaller screens
5. **Check for console errors** - fix any warnings

## Making a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a pull request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to any related issues (#issue-number)
   - Screenshots for UI changes

3. **PR Guidelines**:
   - Keep changes focused (one feature per PR)
   - Include tests or test steps
   - Update README if needed
   - No console errors or warnings

## Reporting Bugs

When reporting a bug, include:

1. Clear description of the problem
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Your environment (OS, browser, Node version)
6. Screenshots if applicable

## Development Tips

### Debugging

```tsx
// Use console.log for quick debugging
console.log("Debug info:", variable);

// Or use the debugger
debugger; // Browser will pause here (dev mode only)
```

### Testing Permissions

1. Login as different roles
2. Try accessing restricted pages
3. Try calling restricted actions
4. Verify 403 Forbidden responses

### Database

The app uses mock in-memory data. When testing:

- Create test tickets and users
- Verify changes persist across page reloads
- Note that data resets on server restart

## Questions?

- Read the [README](README.md) for architecture details

## Code of Conduct

- Be respectful to other contributors
- Assume good intent
- Report issues privately if security-related


