// @copilot-context testing
// filepath: apps/frontend/tests/mocks/react-router.ts
import { vi } from 'vitest';

export const mockReactRouter = () => ({
  useLoaderData: vi.fn(),
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  })),
  useParams: vi.fn(() => ({})),
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  NavLink: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  Outlet: () => <div>Outlet</div>,
  RouterProvider: ({ router: _, ...props }: any) => (
    <div {...props}>RouterProvider</div>
  ),
  createBrowserRouter: vi.fn(() => ({})),
});
