import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/store/ThemeContext";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/goals", label: "Goals" },
  { href: "/habits", label: "Habits" },
];

const SunIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const themeIcon = mounted ? (theme === "dark" ? SunIcon : MoonIcon) : SunIcon;
  const themeLabel = mounted ? (theme === "dark" ? "Light" : "Dark") : "Dark";

  return (
    <StyledWrapper>
      <div className="sidebar-stand"></div>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <div>
              <button></button>
            </div>
          </div>
          <div className="logo-text">
            <span className="t1">Individual</span>
            <span className="t2">Progress</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                  <path d="M426.667 125.489H85.333v20.078h341.334zM85.333 386.508V185.724h341.334v200.784zM42.667 85.332v341.333h426.666V85.332zm320 149.333v128h42.666v-128zm-64 128v-85.333h42.666v85.333zm-64-21.333v21.333h42.666v-21.333z" />
                  <path d="M170.667 362.665c41.237 0 74.666-33.429 74.666-74.666c0-41.238-33.429-74.667-74.666-74.667c-41.238 0-74.667 33.429-74.667 74.667s33.429 74.666 74.667 74.666m35.476-50.962a42.67 42.67 0 0 0 7.19-23.704h-42.666v-42.667a42.66 42.66 0 0 0-39.419 26.339a42.664 42.664 0 0 0 31.095 58.175a42.67 42.67 0 0 0 43.8-18.143" />
                </g>
              </svg>
            <span>Overview</span>
          </Link>
          <Link href="/goals" className={`nav-item ${isActive("/goals") ? "active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fillRule="evenodd">
                <path
                    d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor"
                      d="M12 4a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M9.354 3c.705-.622 1.632-1 2.646-1s1.94.378 2.646 1H18a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.126 5H6v15h12V5h-2.126q.124.481.126 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6q.002-.519.126-1M8 11a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"/>
              </g>
            </svg>
            <span>Goals</span>
          </Link>
          <Link href="/habits" className={`nav-item ${isActive("/habits") ? "active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path
                    d="M18.97 3.098a21.5 21.5 0 0 1 22.826 32.966a21.5 21.5 0 0 1-22.62 8.887M3.537 30.596a21.5 21.5 0 0 1-.09-12.905m2.049-4.638a21.5 21.5 0 0 1 8.985-8.33m.212 38.657a21.5 21.5 0 0 1-9.324-8.65"/>
                <path d="m13.412 25.03l6.922 7.06L34.907 17.1"/>
              </g>
            </svg>
            <span>Habits</span>
          </Link>
          <Link href="/reports" className={`nav-item ${isActive("/reports") ? "active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </g>
            </svg>
            <span>Reports</span>
          </Link>
          {/*<br/>*/}
          {/*<hr/>*/}
          {/*<br/>*/}
          {/*<div className="nav-item" data-media-type="banani-button">*/}
          {/*  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">*/}
          {/*    <path fill="currentColor" d="M12.906-.031a1 1 0 0 0-.125.031A1 1 0 0 0 12 1v1H3a3 3 0 0 0-3 3v13c0 1.656 1.344 3 3 3h9v.375l-5.438 2.719a1.006 1.006 0 0 0 .875 1.812L12 23.625V24a1 1 0 1 0 2 0v-.375l4.563 2.281a1.006 1.006 0 0 0 .875-1.812L14 21.375V21h9c1.656 0 3-1.344 3-3V5a3 3 0 0 0-3-3h-9V1a1 1 0 0 0-1.094-1.031M2 5h22v13H2zm18.875 1a1 1 0 0 0-.594.281L17 9.563L14.719 7.28a1 1 0 0 0-1.594.219l-2.969 5.188l-1.219-3.063a1 1 0 0 0-1.656-.344l-3 3a1.016 1.016 0 1 0 1.439 1.44l1.906-1.906l1.438 3.562a1 1 0 0 0 1.812.125l3.344-5.844l2.062 2.063a1 1 0 0 0 1.438 0l4-4A1 1 0 0 0 20.875 6" />*/}
          {/*  </svg>*/}
          {/*  Statistics*/}
          {/*</div>*/}
          {/*<div className="nav-item" data-media-type="banani-button">*/}
          {/*  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">*/}
          {/*    <g fill="none" stroke="currentColor" strokeWidth="1.5">*/}
          {/*      <circle cx="12" cy="12" r="3" />*/}
          {/*      <path strokeLinecap="round" d="M3.661 10.64c.473.296.777.802.777 1.36s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.58.276.82.308a2 2 0 0 0 1.478-.396c.315-.242.548-.646 1.014-1.453c.208-.36.369-.639.489-.873m-.81-2.766a1.62 1.62 0 0 1-.777-1.36c0-.559.304-1.065.777-1.362c.321-.202.528-.363.676-.555a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.483-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.58-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7c-.208.36-.369.639-.489.873" />*/}
          {/*    </g>*/}
          {/*  </svg>*/}
          {/*  Settings*/}
          {/*</div>*/}
        </nav>

        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {themeIcon}
            <span>{themeLabel}</span>
          </button>
        </div>
      </aside>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .sidebar-stand {
    width: 220px;
    min-width: 220px;
    min-height: 100dvh;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 28px 16px 24px;
    border-right: 1px solid var(--sidebar-border);
    position: sticky;
    top: 0;
    left: 0;
    z-index: 0;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .sidebar {
    width: 220px;
    min-width: 220px;
    min-height: 100dvh;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 28px 16px 24px;
    border-right: 1px solid var(--sidebar-border);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 8px;
    margin-bottom: 36px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #7b61ff 0%, #4f8dff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .logo-text .t1 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .logo-text .t2 {
    font-size: 15px;
    font-weight: 700;
    color: var(--accent-purple);
  }

  aside svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 500;
    position: relative;
    white-space: nowrap;
    text-decoration: none;
  }

  .nav-item.active {
    background: var(--nav-active-bg);
    color: var(--accent-purple);
  }

  .nav-item.active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: var(--accent-purple);
    border-radius: 0 3px 3px 0;
  }

  .sidebar-bottom {
    margin-top: auto;
    padding-top: 16px;
  }

  @media (max-width: 1024px) {
    .sidebar-stand{
      display: none;
    }
    .sidebar {
      width: 100%;
      min-width: 0;
      min-height: auto;
      padding: 18px 14px 12px;
      border-right: none;
      border-bottom: 1px solid var(--sidebar-border);
      position: sticky;
      top: 0;
      backdrop-filter: blur(12px);
    }

    .sidebar-logo {
      margin-bottom: 16px;
    }

    .sidebar-nav {
      flex-direction: row;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .nav-item {
      min-width: fit-content;
      padding: 10px 14px;
      background: var(--nav-item-bg);
    }

    .nav-item.active::before {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .sidebar-logo {
      gap: 10px;
      margin-bottom: 12px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .logo-text .t1,
    .logo-text .t2 {
      font-size: 14px;
    }
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background: var(--btn-secondary-bg);
    border: 1px solid var(--btn-secondary-border);
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .theme-toggle:hover {
    background: var(--btn-secondary-hover);
    color: var(--text-primary);
  }

  .theme-toggle svg {
    flex-shrink: 0;
  }
`;
