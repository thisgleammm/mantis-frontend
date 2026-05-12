import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./global.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Layout";
import QueryProvider from "./components/QueryProvider";
import { ThemeProvider } from "./hooks/ThemeContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Avoid flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const savedTheme = localStorage.getItem('theme');
              let theme = 'light';
              if (savedTheme) {
                theme = savedTheme;
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
              }
              document.documentElement.classList.remove('dark', 'light');
              document.documentElement.classList.add(theme);
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `
        }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </ThemeProvider>
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404
      ? "The requested page could not be found."
      : error.statusText || details;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{message}</h1>
        <p>{details}</p>
      </div>
    </main>
  );
}