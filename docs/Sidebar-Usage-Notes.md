## Sidebar Usage Notes (Workspace)

### Current Sidebar in Use
- The active workspace navigation sidebar is `UnifiedSidebar` in `studio/components/unified-sidebar.tsx`.
- It is rendered by `studio/app/workspace/layout.tsx` for all `/workspace/*` routes.

### Legacy/Deprecated Sidebars
- `studio/components/admin-sidebar.tsx` exists but is not imported anywhere in `studio`.
- `studio/components/user-sidebar.tsx` is only used in `studio/app/_deprecated-dashboard/layout.tsx`.
- `studio/app/_deprecated-dashboard/*` is deprecated and not part of the current `/workspace` layout.

### Why Sidebars May Appear “Cached”
Next.js (dev) can serve stale bundles when the dev server stays running across file changes.
If you still see a sidebar that is not in use:

1) Stop the Next.js dev server.
2) Clear the build cache:
   - In `studio/` (cmd):
     - `rmdir /s /q .next`
3) Restart the dev server:
   - `npm run dev -- -p 3002`
4) Hard refresh the browser:
   - `Ctrl+Shift+R`

### Important
- Renaming `admin-sidebar.tsx` is unnecessary because it has no imports.
- If a legacy sidebar appears, it is coming from deprecated routes or a stale bundle.

