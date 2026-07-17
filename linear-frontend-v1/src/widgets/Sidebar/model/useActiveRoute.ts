import { useLocation, matchPath } from 'react-router-dom'

export function useActiveRoute(): {
  isActive: (path: string) => boolean
  currentPath: string
} {
  const location = useLocation()

  function isActive(path: string): boolean {
    return matchPath({ path, end: false }, location.pathname) !== null
  }

  return { isActive, currentPath: location.pathname }
}
