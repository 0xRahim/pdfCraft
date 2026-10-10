import React, { useEffect } from "react";
import { RouterProvider, usePathname, useRouter } from "./lib/router";
import { AuthProvider, useAuth } from "./lib/authContext";
import RootLayout from "./app/layout";
import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";
import DashboardPage from "./app/dashboard/page";
import TemplatesPage from "./app/dashboard/templates/page";
import LandingPage from "./app/landing/page";

function Protected({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace("/login");
    }
  }, [auth.isAuthenticated, router]);
  if (!auth.isAuthenticated) return null;
  return <>{children}</>;
}

function AppContent() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "") {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (pathname === "/" || pathname === "") {
    return (
      <RootLayout>
        <LandingPage />
      </RootLayout>
    );
  }

  if (pathname === "/login") {
    if (auth.isAuthenticated) {
      router.replace("/dashboard");
      return null;
    }
    return (
      <RootLayout>
        <LoginPage />
      </RootLayout>
    );
  }

  if (pathname === "/register") {
    if (auth.isAuthenticated) {
      router.replace("/dashboard");
      return null;
    }
    return (
      <RootLayout>
        <RegisterPage />
      </RootLayout>
    );
  }

  if (pathname.startsWith("/dashboard/templates")) {
    return (
      <Protected>
        <RootLayout>
          <TemplatesPage />
        </RootLayout>
      </Protected>
    );
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    return (
      <Protected>
        <RootLayout>
          <DashboardPage />
        </RootLayout>
      </Protected>
    );
  }

  return (
    <RootLayout>
      <div className="p-8 text-gray-700">Page not found.</div>
    </RootLayout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}
