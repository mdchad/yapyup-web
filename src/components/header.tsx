import { Link } from '@tanstack/react-router'

export default function Header({ isAuthenticated }) {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 [&.active]:font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 [&.active]:font-bold">
          <Link to="/demo/tanstack-query">TanStack Query</Link>
        </div>

        { isAuthenticated ? (
          <div className="[&.active]:font-bold">
            <Link to="/dashboard">Dashboard</Link>
          </div>
        ) : (
          <div className="px-2 [&.active]:font-bold">
            <Link to="/sign-in">Log In</Link>
          </div>
        )}
      </nav>
    </header>
  )
}
