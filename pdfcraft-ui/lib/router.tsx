import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/dashboard',
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
});

export function useRouter() {
  const ctx = useContext(RouterContext);
  return {
    push: ctx.push,
    replace: ctx.replace,
    back: ctx.back,
    refresh: () => window.location.reload(),
  };
}

export function usePathname(): string {
  const ctx = useContext(RouterContext);
  return ctx.pathname;
}

export function useSearchParams(): URLSearchParams {
  const ctx = useContext(RouterContext);
  return ctx.searchParams;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, children, onClick, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !props.target && e.button === 0 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/dashboard';
    const path = window.location.pathname;
    if (path === '/' || path === '') return '/dashboard';
    return path;
  };

  const [pathname, setPathname] = useState<string>(getInitialPath);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const handleLocationChange = () => {
      let path = window.location.pathname;
      if (path === '' || path === '/') {
        path = '/dashboard';
      }
      setPathname(path);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const push = useCallback((href: string) => {
    const [path, search] = href.split('?');
    const normalizedPath = path || '/dashboard';
    window.history.pushState(null, '', href);
    setPathname(normalizedPath);
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo(0, 0);
  }, []);

  const replace = useCallback((href: string) => {
    const [path, search] = href.split('?');
    const normalizedPath = path || '/dashboard';
    window.history.replaceState(null, '', href);
    setPathname(normalizedPath);
    setSearchParams(new URLSearchParams(search || ''));
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, searchParams, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
};
