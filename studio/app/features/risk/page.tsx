"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Target, TrendingUp, BarChart3, CheckCircle, Shield, Activity, Lock, FileCheck, GitBranch, DollarSign, ArrowRight, Link2, Zap } from "lucide-react"
import Link from "next/link"

export default function RiskPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Risk"
        subtitle="Continuous awareness of what could break, expose, or cost you"
        gradientFrom="from-palette-primary"
        gradientVia="via-palette-accent-1"
        gradientTo="to-palette-secondary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-primary/30 via-white to-palette-accent-1/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Opticini Risk provides a unified, real-time view of operational, security, compliance, and financial risk across local, hybrid, and cloud infrastructure.</strong> Instead of siloed alerts and static assessments, Risk continuously evaluates how configuration, change, health, performance, and cost interact to create exposure.
          </p>
          <p className="text-lg text-slate-600">
            This is living risk intelligence for modern infrastructure.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Opticini Risk Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Opticini Risk Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-4">
                Opticini Risk continuously analyzes infrastructure signals to identify:
              </p>
              <ul className="space-y-2 text-lg mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where failures are likely to occur</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where security exposure is increasing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where compliance gaps are forming</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where costs could spiral unexpectedly</span>
                </li>
              </ul>
              <p className="text-lg font-medium mb-4">It answers:</p>
              <ul className="space-y-2 text-lg">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>What is most likely to fail next?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>What changes increased our risk posture?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Which assets pose the highest business impact?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where should we act first?</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Core Capabilities */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Core Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-palette-primary" />
                    1. Unified Risk Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Asset-level risk scores (servers, services, apps)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Environment-based risk aggregation (prod vs non-prod)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Business impact weighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Normalized risk across infra types (on-prem, cloud, hybrid)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-palette-secondary" />
                    2. Operational Risk Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Health degradation trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Capacity exhaustion risk</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Single points of failure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Dependency chain fragility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>SLA and uptime risk modeling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-1/50 shadow-lg bg-gradient-to-br from-palette-accent-1/10 to-palette-accent-3/20 hover:border-palette-accent-1/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-palette-accent-1" />
                    3. Security Risk Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Exposure from misconfigurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Unpatched or vulnerable components</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Excessive permissions and access sprawl</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Public exposure risk (ports, endpoints, services)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-2/50 shadow-lg bg-gradient-to-br from-palette-accent-2/10 to-palette-accent-3/20 hover:border-palette-accent-2/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-palette-accent-2" />
                    4. Compliance & Policy Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Drift from required compliance baselines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Evidence gaps and audit readiness risk</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Policy violations over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Control degradation tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-3/50 shadow-lg bg-gradient-to-br from-palette-accent-3/10 to-palette-primary/20 hover:border-palette-accent-3/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-palette-accent-3" />
                    5. Change-Induced Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Risk introduced by deployments and config changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>High-risk changes without rollback paths</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Correlation between change velocity and incident probability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Risk reduction validation after remediation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-1/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-palette-primary" />
                    6. Financial & Cost Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Runaway spend risk detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Budget threshold breach likelihood</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cost exposure tied to performance or scaling issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Risk of waste accumulation over time</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Key Metrics Tracked */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Key Metrics Tracked</h2>
            <Card className="border-2 border-palette-accent-2/50 shadow-xl bg-gradient-to-br from-palette-accent-2/10 to-palette-accent-3/15">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 gap-3 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Overall risk score (global, per environment)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Asset and service risk ranking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Risk trend direction (increasing / decreasing)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Change-induced risk delta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Security exposure count</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Compliance drift severity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Cost risk indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Incident likelihood signals</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Who It's For */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who It's For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">SRE & Infrastructure teams</p>
                  <p className="text-sm text-slate-600">→ proactive failure prevention</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Security teams</p>
                  <p className="text-sm text-slate-600">→ exposure prioritization</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Compliance leaders</p>
                  <p className="text-sm text-slate-600">→ audit readiness confidence</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Engineering leadership</p>
                  <p className="text-sm text-slate-600">→ risk-aware delivery</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Executives</p>
                  <p className="text-sm text-slate-600">→ business-level risk visibility</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Fits Into Opticini */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">How It Fits Into Opticini</h2>
            <p className="text-lg text-slate-700 mb-10 text-center max-w-3xl mx-auto">
              Opticini Risk is the synthesis layer across the platform:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Discovery</p>
                  <p className="text-sm text-slate-600 mt-1">→ what exists</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's degrading</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Performance</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's stressed</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Security</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's exposed</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Configuration</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's misaligned</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's drifting</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Change</p>
                  <p className="text-sm text-slate-600 mt-1">→ what was introduced</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Cost</p>
                  <p className="text-sm text-slate-600 mt-1">→ what could escalate</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-slate-700 mt-8 text-center italic max-w-3xl mx-auto">
              Risk turns all of this into actionable insight.
            </p>
          </section>

          {/* Outcome */}
          <section className="mb-24">
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 via-palette-accent-1/10 to-palette-accent-2/15">
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Outcome</h2>
                <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-6">
                  Opticini Risk shows you where failure, exposure, or loss is most likely—before it becomes an incident.
                </p>
                <div className="mt-8 pt-8 border-t border-palette-primary/20">
                  <p className="text-lg font-medium text-slate-700 mb-4">Outcomes You Get:</p>
                  <ul className="grid md:grid-cols-2 gap-3 text-slate-700 text-left max-w-2xl mx-auto">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Fewer outages and incidents</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Earlier detection of systemic weaknesses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Clear prioritization of remediation efforts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Reduced audit and compliance surprises</span>
                    </li>
                    <li className="flex items-center gap-2 md:col-span-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Informed decision-making under change and growth</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>

      {/* Call to Action */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-palette-primary via-palette-accent-1 to-palette-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle_800px_at_50%_50%, var(--color-accent-1), transparent)' }}></div>
        
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Risk Before It Becomes an Incident
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Prioritize what truly matters with unified risk intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-palette-primary hover:bg-palette-accent-3 shadow-lg transition-all duration-300 px-8 py-6 text-lg"
            >
              <Link href="/request-demo">
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300 px-8 py-6 text-lg"
            >
              <Link href="/request-demo">
                <Link2 className="mr-2 h-5 w-5" />
                Explore risk intelligence
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
