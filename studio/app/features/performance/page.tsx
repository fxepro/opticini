"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Zap, Gauge, TrendingUp, Activity, Server, Database, CheckCircle, ArrowRight, Link2, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"

export default function PerformancePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Performance"
        subtitle="Understand how your systems perform — under any load"
        gradientFrom="from-palette-primary"
        gradientVia="via-palette-accent-1"
        gradientTo="to-palette-secondary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-primary/30 via-white to-palette-accent-1/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Performance issues erode trust long before systems go down.</strong>
          </p>
          <p className="text-lg text-slate-600">
            Opticini Performance gives you deep visibility into how infrastructure, services, and applications behave in real time—so you can detect degradation early and optimize with confidence.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Performance Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Performance Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Performance continuously measures how efficiently your infrastructure and services operate across local, hybrid, and cloud environments.
              </p>
              <p className="text-lg">
                Rather than isolated metrics, Performance provides contextual performance insight, connecting latency, throughput, and resource usage to real infrastructure and service behavior.
              </p>
            </div>
          </section>

          {/* What You Can Measure */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">What You Can Measure</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Server className="h-5 w-5 text-palette-primary" />
                    Infrastructure Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>CPU, memory, and disk utilization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Disk and network I/O</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Resource saturation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Capacity thresholds</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-palette-secondary" />
                    Service & Application Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>API and service latency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Request throughput</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Error rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Queue depth and processing time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Database query performance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Continuous Performance Telemetry</CardTitle>
                  <CardDescription className="text-slate-600">
                    Opticini Performance gathers metrics using:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agent-based</strong> host and process metrics
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Application and service</strong> probes
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Cloud-native</strong> performance APIs
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Synthetic and background</strong> checks
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-xl bg-gradient-to-br from-palette-secondary/15 to-palette-accent-2/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Performance With Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    All performance data is enriched with:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Asset ownership and environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Dependency relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Recent configuration or deployment changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Health and availability signals</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 mt-4 italic">
                    This turns raw metrics into actionable performance insight.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Key Metrics & Outputs */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-2/20 via-palette-accent-3/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Key Metrics & Outputs</h2>
            <Card className="border-2 border-palette-accent-2/50 shadow-xl bg-gradient-to-br from-palette-accent-2/10 to-palette-accent-3/15">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 gap-3 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Response time (p50 / p95 / p99)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Throughput and load trends</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Resource utilization patterns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Saturation and bottleneck indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Performance baselines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Degradation and anomaly detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why Performance Matters */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Performance Matters</h2>
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-palette-primary/20 to-palette-accent-1/20">
                      <TableHead className="font-bold text-slate-800">Without Performance Insight</TableHead>
                      <TableHead className="font-bold text-slate-800">With Opticini Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-slate-700">Slow user experiences</TableCell>
                      <TableCell className="text-slate-700 font-medium">Predictable performance</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Guesswork optimization</TableCell>
                      <TableCell className="text-slate-700 font-medium">Data-driven decisions</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Late incident detection</TableCell>
                      <TableCell className="text-slate-700 font-medium">Early degradation alerts</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Overprovisioning</TableCell>
                      <TableCell className="text-slate-700 font-medium">Efficient capacity planning</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Performance Connects Across Opticini */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Performance Connects Across Opticini</h2>
            <p className="text-lg text-slate-700 mb-10 text-center">
              Opticini Performance works in concert with:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">distinguish slow vs unavailable systems</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Change</p>
                  <p className="text-sm text-slate-600 mt-1">correlate deploys with regressions</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Cost</p>
                  <p className="text-sm text-slate-600 mt-1">identify over- and under-utilized resources</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">elevate chronic performance issues</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">support availability and reliability controls</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Uses Performance */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who Uses Performance</h2>
            <Card className="border-2 border-palette-accent-3/50 shadow-xl bg-gradient-to-br from-palette-accent-3/15 to-palette-accent-2/20">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>SRE & Platform Engineering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>DevOps Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Application Engineering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Database Administrators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Engineering Leadership</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Outcome */}
          <section className="mb-24">
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 via-palette-accent-1/10 to-palette-accent-2/15">
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Outcome</h2>
                <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                  Faster systems, fewer surprises, and performance you can rely on—at scale.
                </p>
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
            See Performance Clearly
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Stop reacting to slowdowns. Start understanding them.
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
                Explore supported integrations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
