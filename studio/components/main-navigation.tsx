"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, Zap, Shield, Code, Link2, Gauge, Eye, Lock, FileText, Menu, X, Server, Type, Search, Heart, Settings, FileCheck, FolderOpen, GitBranch, DollarSign, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function MainNavigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-palette-accent-2/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-12 z-40">
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between max-w-[1600px] mx-auto">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className={cn(
              "group relative",
              pathname === "/" && "after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
            )}>
              <Image 
                src="/opticini-dark.png" 
                alt="Opticini Logo" 
                width={160} 
                height={40}
                className={cn(
                  "object-contain transition-all duration-300",
                  pathname === "/" ? "opacity-100" : "group-hover:opacity-90"
                )}
              />
            </Link>
          </div>

          {/* Right side - Feature Navigation */}
          <div className="hidden lg:flex items-center justify-end flex-1 ml-12">
            <div className="flex items-center space-x-8">
              <Link
                href="/features/discovery"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/discovery" || pathname.startsWith("/features/discovery")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Search className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/discovery" || pathname.startsWith("/features/discovery") ? "scale-110" : "group-hover:scale-110"
                )} />
                Discovery
              </Link>
              <Link
                href="/features/health"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/health" || pathname.startsWith("/features/health")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/health" || pathname.startsWith("/features/health") ? "scale-110" : "group-hover:scale-110"
                )} />
                Health
              </Link>
              <Link
                href="/features/performance"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/performance" || pathname.startsWith("/features/performance")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Zap className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/performance" || pathname.startsWith("/features/performance") ? "scale-110" : "group-hover:scale-110"
                )} />
                Performance
              </Link>
              <Link
                href="/features/security"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/security" || pathname.startsWith("/features/security")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Shield className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/security" || pathname.startsWith("/features/security") ? "scale-110" : "group-hover:scale-110"
                )} />
                Security
              </Link>
              <Link
                href="/features/configuration"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/configuration" || pathname.startsWith("/features/configuration")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Settings className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/configuration" || pathname.startsWith("/features/configuration") ? "scale-110" : "group-hover:scale-110"
                )} />
                Configuration
              </Link>
              <Link
                href="/features/compliance"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/compliance" || pathname.startsWith("/features/compliance")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <FileCheck className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/compliance" || pathname.startsWith("/features/compliance") ? "scale-110" : "group-hover:scale-110"
                )} />
                Compliance
              </Link>
              <Link
                href="/features/evidence"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/evidence" || pathname.startsWith("/features/evidence")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <FolderOpen className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/evidence" || pathname.startsWith("/features/evidence") ? "scale-110" : "group-hover:scale-110"
                )} />
                Evidence
              </Link>
              <Link
                href="/features/change"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/change" || pathname.startsWith("/features/change")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <GitBranch className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/change" || pathname.startsWith("/features/change") ? "scale-110" : "group-hover:scale-110"
                )} />
                Change
              </Link>
              <Link
                href="/features/cost"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/cost" || pathname.startsWith("/features/cost")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <DollarSign className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/cost" || pathname.startsWith("/features/cost") ? "scale-110" : "group-hover:scale-110"
                )} />
                Cost
              </Link>
              <Link
                href="/features/risk"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features/risk" || pathname.startsWith("/features/risk")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <AlertTriangle className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features/risk" || pathname.startsWith("/features/risk") ? "scale-110" : "group-hover:scale-110"
                )} />
                Risk
              </Link>
            </div>
          </div>

          {/* Right side - Mobile Menu Button */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-palette-primary hover:bg-palette-accent-3 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
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
                <div className="grid grid-cols-2 gap-2">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
