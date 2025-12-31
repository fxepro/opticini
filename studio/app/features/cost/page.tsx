"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingDown, AlertCircle, PieChart, CheckCircle, Target, Server, Cloud, ArrowRight, Link2, Activity, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function CostPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Cost"
        subtitle="Total visibility into infrastructure spend — before it becomes waste"
        gradientFrom="from-palette-accent-2"
        gradientVia="via-palette-accent-1"
        gradientTo="to-palette-primary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-accent-2/30 via-white to-palette-accent-1/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Opticini Cost provides real-time and historical insight into infrastructure spending across local, hybrid, and cloud environments.</strong> It connects usage, configuration, and performance data to actual cost impact—so finance, IT, and engineering make decisions from the same source of truth.
          </p>
          <p className="text-lg text-slate-600">
            This is FinOps-grade visibility, built natively into infrastructure monitoring—not bolted on later.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Opticini Cost Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Opticini Cost Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Cost continuously tracks how infrastructure resources are consumed, allocated, and billed—then correlates that data with performance, health, change, and risk signals.
              </p>
              <p className="text-lg font-medium mb-4">It answers:</p>
              <ul className="space-y-2 text-lg">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Where is our money going?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>What is underutilized or overprovisioned?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>Which teams, apps, or environments are driving cost increases?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-palette-primary mt-0.5 flex-shrink-0" />
                  <span>What changes caused a cost spike?</span>
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
                    <Server className="h-5 w-5 text-palette-primary" />
                    1. Unified Cost Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>On-prem infrastructure cost modeling (servers, storage, networking)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud cost ingestion (AWS, Azure, GCP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Hybrid environment normalization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Environment-based segmentation (prod, staging, dev, test)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-palette-secondary" />
                    2. Usage-Based Cost Attribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>CPU, memory, disk, and network cost mapping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Application-level cost attribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Service and workload tagging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Team, project, and business-unit cost allocation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-1/50 shadow-lg bg-gradient-to-br from-palette-accent-1/10 to-palette-accent-3/20 hover:border-palette-accent-1/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-palette-accent-1" />
                    3. Waste & Optimization Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Idle and underutilized resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Overprovisioned compute and storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Zombie services and orphaned assets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Redundant environments and unused snapshots</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-2/50 shadow-lg bg-gradient-to-br from-palette-accent-2/10 to-palette-accent-3/20 hover:border-palette-accent-2/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-palette-accent-2" />
                    4. Change-to-Cost Correlation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Cost impact of deployments and config changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Spike detection tied to releases or scaling events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Drift-driven cost increases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-2 mt-0.5 flex-shrink-0" />
                      <span>Rollback validation (did cost normalize?)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-3/50 shadow-lg bg-gradient-to-br from-palette-accent-3/10 to-palette-primary/20 hover:border-palette-accent-3/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-palette-accent-3" />
                    5. Forecasting & Budget Guardrails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Trend-based cost forecasting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Budget thresholds and alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>Anomaly detection for unexpected spend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-3 mt-0.5 flex-shrink-0" />
                      <span>What-if analysis for scaling decisions</span>
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
                    <span>Cost per application / service</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Cost per environment (prod/dev/test)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Cost per team or business unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Utilization vs. spend ratio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Idle resource cost</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Month-over-month and quarter-over-quarter spend</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Cost anomalies and spikes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Optimization opportunity value ($)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Who It's For */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who It's For</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Finance & FinOps teams</p>
                  <p className="text-sm text-slate-600">→ budget control and forecasting</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Platform & Infrastructure teams</p>
                  <p className="text-sm text-slate-600">→ right-sizing and optimization</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Engineering leaders</p>
                  <p className="text-sm text-slate-600">→ cost-aware architecture decisions</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800 mb-2">Executives</p>
                  <p className="text-sm text-slate-600">→ visibility into ROI and infrastructure efficiency</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Fits Into Opticini */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">How It Fits Into Opticini</h2>
            <p className="text-lg text-slate-700 mb-10 text-center max-w-3xl mx-auto">
              Opticini Cost doesn't operate in isolation—it is directly powered by:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Discovery</p>
                  <p className="text-sm text-slate-600 mt-1">→ what exists</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's working</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Performance</p>
                  <p className="text-sm text-slate-600 mt-1">→ what's being consumed</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Configuration</p>
                  <p className="text-sm text-slate-600 mt-1">→ how it's set up</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Change</p>
                  <p className="text-sm text-slate-600 mt-1">→ what was modified</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">→ what could go wrong</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-slate-700 mt-8 text-center italic max-w-3xl mx-auto">
              This creates true cost intelligence, not just expense reporting.
            </p>
          </section>

          {/* Outcome */}
          <section className="mb-24">
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 via-palette-accent-1/10 to-palette-accent-2/15">
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Outcome</h2>
                <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-6">
                  Opticini Cost turns infrastructure usage into financial clarity—so every dollar spent is intentional, visible, and defensible.
                </p>
                <div className="mt-8 pt-8 border-t border-palette-primary/20">
                  <p className="text-lg font-medium text-slate-700 mb-4">Outcomes You Get:</p>
                  <ul className="grid md:grid-cols-2 gap-3 text-slate-700 text-left max-w-2xl mx-auto">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Reduced infrastructure waste</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Predictable and explainable cloud bills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Faster cost anomaly detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Shared visibility between IT, engineering, and finance</span>
                    </li>
                    <li className="flex items-center gap-2 md:col-span-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                      <span>Measurable savings tied to real actions</span>
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
            Turn Usage Into Financial Clarity
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            See where every dollar goes—and why it matters.
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
                Explore cost intelligence
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
