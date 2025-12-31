"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, Zap, Shield, Code, Brain, Link2, MessageCircle, Gauge, Eye, Lock, FileText, Menu, X, Server, Type, Search, Heart, Settings, FileCheck, FolderOpen, GitBranch, DollarSign, AlertTriangle, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use relative URL in production (browser), localhost in dev (SSR)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update loggedIn state on mount, route change, and storage events
  useEffect(() => {
    const checkAuthState = () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem("access_token");
      const isLoggedIn = !!token;
      setLoggedIn(isLoggedIn);
      
      if (token) {
        // Fetch user info to check roles
        fetch(`${API_BASE}/api/user-info/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Unauthorized');
          })
          .then(data => setUser(data))
          .catch(() => {
            // Token invalid, clear it
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setLoggedIn(false);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    };

    checkAuthState();
    // Listen for storage changes (e.g., logout from another tab)
    window.addEventListener("storage", checkAuthState);
    return () => window.removeEventListener("storage", checkAuthState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;
    setLoggedIn(isLoggedIn);
    
    if (token) {
      fetch(`${API_BASE}/api/user-info/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Unauthorized');
        })
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setLoggedIn(false);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // Clear orchestrator state to prevent old reports from running
    localStorage.removeItem("pagerodeo_analysis_state");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="border-b border-palette-accent-2/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex h-20 items-center justify-between max-w-[1600px] mx-auto">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group">
              <Image 
                src="/opticini-dark.png" 
                alt="Opticini Logo" 
                width={160} 
                height={40}
                className="object-contain group-hover:opacity-90 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Center - Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <div className="flex items-center space-x-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                        pathname.startsWith("/features")
                          ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                          : "text-slate-600 hover:text-palette-primary",
                      )}
                    >
                      <Activity className="h-4 w-4 mr-1.5" />
                      Features
                      <ChevronDown className="h-3 w-3 ml-1.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/features/discovery" className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Discovery
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/health" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Health
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/performance" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/configuration" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configuration
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/compliance" className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        Compliance
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/evidence" className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Evidence
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/change" className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Change
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/cost" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Cost
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/features/risk" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Risk
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                variant="outline"
                className="border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                asChild
              >
                <Link href="/feedback">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Feedback
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                asChild
              >
                <Link href="/consult">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Consult
                </Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 px-3 py-2 text-sm" 
                asChild
              >
                <Link href="/upgrade">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Upgrade
                </Link>
              </Button>
              {/* Logout button - only shown when logged in */}
              {loggedIn && (
                <Button
                  className="bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-palette-accent-2/20 bg-white/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-4">
              {/* Features Section */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link
                    href="/features/discovery"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/discovery"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    <span>Discovery</span>
                  </Link>
                  <Link
                    href="/features/health"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/health"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Health</span>
                  </Link>
                  <Link
                    href="/features/performance"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/performance"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Performance</span>
                  </Link>
                  <Link
                    href="/features/security"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/security"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </Link>
                  <Link
                    href="/features/configuration"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/configuration"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuration</span>
                  </Link>
                  <Link
                    href="/features/compliance"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/compliance"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Compliance</span>
                  </Link>
                  <Link
                    href="/features/evidence"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/evidence"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Evidence</span>
                  </Link>
                  <Link
                    href="/features/change"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/change"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GitBranch className="h-4 w-4" />
                    <span>Change</span>
                  </Link>
                  <Link
                    href="/features/cost"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/cost"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Cost</span>
                  </Link>
                  <Link
                    href="/features/risk"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/features/risk"
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Risk</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-palette-accent-2/20 space-y-3">
                <Button 
                  variant="outline"
                  className="w-full border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3"
                  asChild
                >
                  <Link href="/consult" onClick={() => setMobileMenuOpen(false)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Consult
                  </Link>
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white" 
                  asChild
                >
                  <Link href="/upgrade" onClick={() => setMobileMenuOpen(false)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Upgrade
                  </Link>
                </Button>
                {/* Logout button - only shown when logged in */}
                {loggedIn && (
                  <Button
                    className="w-full bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
