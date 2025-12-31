"use client";
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Zap, Shield, Settings, FileCheck, FolderOpen, GitBranch, 
  DollarSign, AlertTriangle, ArrowRight, CheckCircle, Server, Cloud, Network,
  Lock, Play, Heart, Code, Layers, Container
} from "lucide-react"

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const insightPlanes = [
    {
      icon: Search,
      title: "Discovery",
      emoji: "🔍",
      description: "Automatically discover and inventory all infrastructure assets.",
      tagline: "You can't secure or manage what you don't know exists.",
      items: ["Servers, VMs, containers", "Cloud resources", "Databases, APIs, identity systems"]
    },
    {
      icon: Heart,
      title: "Health",
      emoji: "💓",
      description: "Ensure availability and operational stability.",
      tagline: "Know what's up—and what's about to go down.",
      items: ["Uptime & availability", "Service health", "Infrastructure reliability"]
    },
    {
      icon: Zap,
      title: "Performance",
      emoji: "⚡",
      description: "Understand how systems behave under load.",
      tagline: "Measure what matters to users and teams.",
      items: ["Latency & throughput", "Resource utilization", "Performance trends"]
    },
    {
      icon: Shield,
      title: "Security",
      emoji: "🔐",
      description: "Reduce attack surface and exposure.",
      tagline: "See risk before attackers do.",
      items: ["Open ports & exposed services", "Vulnerabilities & misconfigurations", "Identity & access gaps"]
    },
    {
      icon: Settings,
      title: "Configuration",
      emoji: "⚙️",
      description: "Detect drift and enforce baselines.",
      tagline: "Prevent silent configuration decay.",
      items: ["Baseline comparison", "Config change detection", "Policy enforcement"]
    },
    {
      icon: FileCheck,
      title: "Compliance",
      emoji: "📜",
      description: "Stay continuously audit-ready.",
      tagline: "Compliance shouldn't be a once-a-year panic.",
      items: ["SOC 2, ISO 27001, HIPAA, PCI", "Continuous control monitoring", "Shared responsibility modeling"]
    },
    {
      icon: FolderOpen,
      title: "Evidence",
      emoji: "📂",
      description: "Automate audit proof.",
      tagline: "No screenshots. No spreadsheets.",
      items: ["Auto-collected evidence", "Evidence freshness tracking", "Auditor-ready exports"]
    },
    {
      icon: GitBranch,
      title: "Change",
      emoji: "🔄",
      description: "Track who changed what—and why it matters.",
      tagline: "Every incident starts with a change.",
      items: ["Infra & config changes", "Deployment tracking", "Compliance impact mapping"]
    },
    {
      icon: DollarSign,
      title: "Cost",
      emoji: "💰",
      description: "Understand spend and waste.",
      tagline: "Visibility before optimization.",
      items: ["Cloud & infra cost attribution", "Idle resource detection", "Cost efficiency insights"]
    },
    {
      icon: AlertTriangle,
      title: "Risk",
      emoji: "⚠️",
      description: "Turn signals into prioritized action.",
      tagline: "Not all alerts are equal.",
      items: ["Unified risk scoring", "Business impact mapping", "Executive-level risk views"]
    }
  ];

  const targetAudiences = [
    { role: "IT Operations & SRE", focus: "stability, uptime, performance" },
    { role: "Security Teams", focus: "exposure, misconfiguration, risk" },
    { role: "GRC & Compliance", focus: "continuous compliance & evidence" },
    { role: "FinOps & Finance", focus: "cost clarity and efficiency" },
    { role: "Executives", focus: "real risk, real readiness, real insight" }
  ];

  const infrastructureTypes = [
    { icon: Server, label: "On-premise" },
    { icon: Cloud, label: "Cloud" },
    { icon: Layers, label: "Hybrid" },
    { icon: Container, label: "Containers" },
    { icon: Code, label: "APIs" },
    { icon: Lock, label: "Identity systems" },
    { icon: Network, label: "Networks" }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--color-accent-1), var(--color-primary), var(--color-secondary))' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-35">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-55 animate-pulse animation-delay-4000" style={{ backgroundColor: 'var(--color-accent-1)' }}></div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Opticini
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/95 font-semibold mb-4">
            Complete Optics & Insight Into Your IT Infrastructure
          </p>
          
          <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            One platform for discovery, operations, security, compliance, cost, and risk—across local, hybrid, and cloud environments.
          </p>

          <p className="text-lg text-white/95 font-medium mb-12 max-w-3xl mx-auto">
            👉 Know what you have. Know how it's performing. Know what's risky. Prove compliance. Reduce cost.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Button size="lg" className="bg-white text-palette-primary hover:bg-white/90 border-0 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/request-demo">
                Request Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" className="bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 px-8 py-6 text-lg rounded-xl backdrop-blur-sm font-semibold" asChild>
              <Link href="/request-demo">
                Book a Demo
                <Play className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-medium">Unified Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-medium">Real-time Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-medium">Always Audit-Ready</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-accent-3 via-palette-accent-2/30 to-palette-accent-1/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle_800px_at_50%_50%, var(--color-accent-1), transparent)' }}></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: 'var(--theme-text-primary)' }}>
            The Problem
          </h2>
          
          <p className="text-2xl font-semibold text-center mb-8" style={{ color: 'var(--theme-text-primary)' }}>
            Modern infrastructure is fragmented.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-accent-3)' }}>
              <CardContent className="p-6">
                <p className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>Monitoring tools show performance</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ borderColor: 'var(--color-secondary)', backgroundColor: 'var(--color-accent-2)' }}>
              <CardContent className="p-6">
                <p className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>Security tools show vulnerabilities</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ borderColor: 'var(--color-accent-1)', backgroundColor: 'var(--color-accent-3)' }}>
              <CardContent className="p-6">
                <p className="text-lg font-semibold" style={{ color: 'var(--color-accent-1)' }}>Compliance tools collect evidence</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-accent-2)' }}>
              <CardContent className="p-6">
                <p className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>Finance tools track spend</p>
              </CardContent>
            </Card>
          </div>

          <div className="backdrop-blur-sm border-2 rounded-2xl p-8 mb-4" style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, borderColor: 'var(--color-primary)' }}>
            <p className="text-2xl font-bold text-center text-white">
              None of them talk to each other.
            </p>
          </div>

          <p className="text-lg text-center font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            Teams are left stitching together dashboards, exports, screenshots, and audits—while risk quietly grows.
          </p>
        </div>
      </section>

      {/* The Opticini Solution Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-primary/20 via-palette-secondary/20 to-palette-accent-1/20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_800px_at_50%_50%, var(--color-accent-1), transparent)', opacity: 0.15 }}></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-gradient-to-r from-palette-primary/10 to-palette-secondary/10 rounded-3xl p-12 border-2 border-palette-primary/30 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-palette-primary to-palette-secondary bg-clip-text text-transparent">
              The Opticini Solution
            </h2>
            
            <p className="text-xl text-center mb-12 leading-relaxed font-semibold text-gray-800">
              Opticini unifies infrastructure visibility into a single, continuous insight plane.
            </p>

            <p className="text-lg mb-8 font-medium text-gray-700">
              Instead of dozens of disconnected tools, Opticini provides end-to-end optics across:
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl p-6 border-2 hover:shadow-lg hover:scale-105 transition-all" style={{ backgroundColor: 'var(--color-accent-3)', borderColor: 'var(--color-primary)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>On-premise infrastructure</span>
                </div>
              </div>
              <div className="rounded-xl p-6 border-2 hover:shadow-lg hover:scale-105 transition-all" style={{ backgroundColor: 'var(--color-accent-2)', borderColor: 'var(--color-secondary)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--color-secondary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>Cloud & hybrid environments</span>
                </div>
              </div>
              <div className="rounded-xl p-6 border-2 hover:shadow-lg hover:scale-105 transition-all" style={{ backgroundColor: 'var(--color-accent-1)', borderColor: 'var(--color-primary)', opacity: 0.9 }}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Applications, APIs, identity, and networks</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-palette-primary to-palette-secondary rounded-2xl p-6 border-2 border-palette-primary/50 shadow-xl">
              <p className="text-xl font-bold text-center text-white">
                All mapped to health, security, compliance, cost, and risk—in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Opticini Delivers - 10 Insight Planes */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-accent-3 via-palette-accent-2/50 to-palette-accent-1/30 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_600px_at_30%_20%, var(--color-accent-1), transparent)', opacity: 0.2 }}></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-palette-primary via-palette-secondary to-palette-primary bg-clip-text text-transparent">
              What Opticini Delivers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insightPlanes.map((plane, index) => {
              const IconComponent = plane.icon;
              // Cycle through palette colors for variety
              const paletteColors = [
                { bg: 'var(--color-accent-3)', border: 'var(--color-primary)', text: 'var(--color-primary)' },
                { bg: 'var(--color-accent-2)', border: 'var(--color-secondary)', text: 'var(--color-secondary)' },
                { bg: 'var(--color-accent-1)', border: 'var(--color-primary)', text: 'var(--color-primary)', opacity: 0.9 },
                { bg: 'var(--color-accent-3)', border: 'var(--color-accent-1)', text: 'var(--color-accent-1)' },
                { bg: 'var(--color-accent-2)', border: 'var(--color-primary)', text: 'var(--color-primary)' },
                { bg: 'var(--color-accent-3)', border: 'var(--color-secondary)', text: 'var(--color-secondary)' },
                { bg: 'var(--color-accent-1)', border: 'var(--color-secondary)', text: 'var(--color-secondary)', opacity: 0.9 },
                { bg: 'var(--color-accent-2)', border: 'var(--color-accent-1)', text: 'var(--color-accent-1)' },
                { bg: 'var(--color-accent-3)', border: 'var(--color-primary)', text: 'var(--color-primary)' },
                { bg: 'var(--color-accent-2)', border: 'var(--color-secondary)', text: 'var(--color-secondary)' },
              ];
              const colors = paletteColors[index % paletteColors.length];
              
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:scale-105 hover:-translate-y-2" style={{ backgroundColor: colors.bg, borderColor: colors.border, opacity: colors.opacity || 1 }}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{plane.emoji}</span>
                      <CardTitle className="text-2xl font-bold" style={{ color: colors.text }}>{plane.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base font-medium" style={{ color: 'var(--theme-text-secondary)' }}>{plane.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg p-3 mb-4 border-2 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-accent-3)', borderColor: colors.border }}>
                      <p className="font-bold text-sm" style={{ color: colors.text }}>
                        {plane.tagline}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {plane.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.text }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* One Platform. Ten Insight Planes. */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-primary via-palette-secondary to-palette-accent-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-2 border-white/30 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              One Platform. Ten Insight Planes.
            </h2>
            <p className="text-xl mb-8 text-white/90 font-medium">
              Opticini brings everything together into one coherent system, instead of siloed tools.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
              <div className="flex flex-wrap justify-center gap-2 text-lg font-bold mb-4 text-white">
                <span className="bg-white/30 px-4 py-2 rounded-lg">Discovery</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Health</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Performance</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Security</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Compliance</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Cost</span>
                <ArrowRight className="h-5 w-5 mx-2 text-white" />
                <span className="bg-white/30 px-4 py-2 rounded-lg">Risk</span>
              </div>
            </div>
            <p className="text-xl font-bold text-white">
              All connected. All contextual. Always current.
            </p>
          </div>
        </div>
      </section>

      {/* Who Opticini Is For */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-accent-2/50 via-palette-accent-1/30 to-palette-accent-3 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_700px_at_70%_30%, var(--color-accent-1), transparent)', opacity: 0.15 }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-palette-primary via-palette-secondary to-palette-accent-1 bg-clip-text text-transparent">
            Who Opticini Is For
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudiences.map((audience, index) => {
              const paletteColors = [
                { bg: 'var(--color-accent-3)', border: 'var(--color-primary)', text: 'var(--color-primary)' },
                { bg: 'var(--color-accent-2)', border: 'var(--color-secondary)', text: 'var(--color-secondary)' },
                { bg: 'var(--color-accent-1)', border: 'var(--color-primary)', text: 'var(--color-primary)', opacity: 0.9 },
                { bg: 'var(--color-accent-3)', border: 'var(--color-accent-1)', text: 'var(--color-accent-1)' },
                { bg: 'var(--color-accent-2)', border: 'var(--color-secondary)', text: 'var(--color-secondary)' },
              ];
              const colors = paletteColors[index % paletteColors.length];
              
              return (
                <Card key={index} className="border-2 hover:shadow-2xl hover:scale-105 transition-all duration-300" style={{ backgroundColor: colors.bg, borderColor: colors.border, opacity: colors.opacity || 1 }}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                      {audience.role}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                      – {audience.focus}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Opticini Comparison */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-accent-3 via-palette-accent-2 to-palette-accent-1/50 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_600px_at_50%_50%, var(--color-accent-2), transparent)', opacity: 0.2 }}></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-palette-primary via-palette-secondary to-palette-accent-1 bg-clip-text text-transparent">
            Why Opticini
          </h2>
          
          <div className="backdrop-blur-sm rounded-3xl p-8 border-4 shadow-2xl" style={{ backgroundColor: 'var(--color-accent-3)', borderColor: 'var(--color-primary)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4" style={{ borderColor: 'var(--color-primary)' }}>
                    <th className="text-left p-4 font-bold text-lg" style={{ color: 'var(--theme-text-primary)' }}>Traditional Tools</th>
                    <th className="text-left p-4 font-bold text-lg bg-gradient-to-r from-palette-primary to-palette-secondary bg-clip-text text-transparent">Opticini</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--color-accent-2)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Siloed</td>
                    <td className="p-4 font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Unified</td>
                  </tr>
                  <tr className="border-b-2 hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--color-accent-2)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Reactive</td>
                    <td className="p-4 font-bold text-lg" style={{ color: 'var(--color-secondary)' }}>Continuous</td>
                  </tr>
                  <tr className="border-b-2 hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--color-accent-2)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Tool-centric</td>
                    <td className="p-4 font-bold text-lg" style={{ color: 'var(--color-accent-1)' }}>Insight-centric</td>
                  </tr>
                  <tr className="border-b-2 hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--color-accent-2)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Audit panic</td>
                    <td className="p-4 font-bold text-lg bg-gradient-to-r from-palette-primary to-palette-secondary bg-clip-text text-transparent">Always audit-ready</td>
                  </tr>
                  <tr className="hover:opacity-80 transition-opacity">
                    <td className="p-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Data overload</td>
                    <td className="p-4 font-bold text-lg bg-gradient-to-r from-palette-primary to-palette-secondary bg-clip-text text-transparent">Prioritized risk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Any Infrastructure */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--color-secondary), var(--color-primary), var(--color-accent-1))' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_800px_at_50%_50%, var(--color-accent-1), transparent)', opacity: 0.3 }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
            Built for Any Infrastructure
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            {infrastructureTypes.map((type, index) => {
              const IconComponent = type.icon;
              const paletteColors = [
                { bg: 'var(--color-primary)', border: 'var(--color-accent-2)' },
                { bg: 'var(--color-secondary)', border: 'var(--color-accent-3)' },
                { bg: 'var(--color-accent-1)', border: 'var(--color-accent-2)' },
                { bg: 'var(--color-primary)', border: 'var(--color-accent-1)' },
                { bg: 'var(--color-secondary)', border: 'var(--color-accent-3)' },
                { bg: 'var(--color-accent-1)', border: 'var(--color-primary)' },
                { bg: 'var(--color-primary)', border: 'var(--color-secondary)' },
              ];
              const colors = paletteColors[index % paletteColors.length];
              
              return (
                <Card key={index} className="text-center border-2 hover:shadow-2xl hover:scale-110 transition-all duration-300 hover:rotate-2" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 mx-auto mb-3 text-white" />
                    <p className="text-sm font-bold text-white">{type.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="backdrop-blur-md rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'var(--color-accent-2)' }}>
            <p className="text-center text-xl font-bold text-white">
              Agent-based or agentless. Your choice.
            </p>
          </div>
        </div>
      </section>

      {/* From Visibility to Confidence */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-accent-3 via-palette-accent-2 to-palette-accent-1/50 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle_700px_at_30%_70%, var(--color-accent-1), transparent)', opacity: 0.2 }}></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="backdrop-blur-sm rounded-3xl p-12 border-4 shadow-2xl" style={{ backgroundColor: 'var(--color-accent-3)', borderColor: 'var(--color-primary)' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-palette-primary via-palette-secondary to-palette-accent-1 bg-clip-text text-transparent">
              From Visibility to Confidence
            </h2>
            <p className="text-xl mb-4 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
              Opticini doesn't just show data.
            </p>
            <div className="rounded-2xl p-6 border-2 shadow-xl" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', borderColor: 'var(--color-primary)' }}>
              <p className="text-2xl md:text-3xl font-bold text-white">
                It shows what matters, why it matters, and what to do next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-palette-primary via-palette-secondary to-palette-accent-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-4 border-white/30 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Get Started with Opticini
            </h2>
            <p className="text-xl mb-2 text-white/90 font-medium">
              Bring clarity to your infrastructure.
            </p>
            <p className="text-xl mb-12 text-white/90 font-medium">
              Bring confidence to your operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-palette-primary hover:bg-white/90 px-10 py-7 text-xl font-bold rounded-xl shadow-2xl hover:shadow-white/50 hover:scale-110 transition-all duration-300" asChild>
                <Link href="/request-demo">
                  👉 Request Early Access
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-4 border-white text-white hover:bg-white hover:text-palette-primary px-10 py-7 text-xl font-bold rounded-xl shadow-2xl hover:scale-110 transition-all duration-300" asChild>
                <Link href="/request-demo">
                  👉 Book a Demo
                  <Play className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
