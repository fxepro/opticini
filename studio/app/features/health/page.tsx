"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart, Activity, Server, Cloud, Database, Network, Container, CheckCircle, ArrowRight, Link2, Zap, Clock } from "lucide-react"
import Link from "next/link"

export default function HealthPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Health"
        subtitle="Know what's up—and what's about to go down"
        gradientFrom="from-palette-accent-2"
        gradientVia="via-palette-accent-1"
        gradientTo="to-palette-primary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-accent-2/30 via-white to-palette-accent-1/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Availability is the foundation of trust.</strong>
          </p>
          <p className="text-lg text-slate-600">
            Opticini Health gives you continuous visibility into the operational health of your infrastructure, services, and platforms—so issues are detected early and downtime is minimized.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Health Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Health Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Health continuously monitors the availability and operational status of your infrastructure and services across local, hybrid, and cloud environments.
              </p>
              <p className="text-lg">
                Instead of isolated uptime checks, Health provides context-aware service health, tied directly to infrastructure, configuration, and change events.
              </p>
            </div>
          </section>

          {/* What You Can Monitor */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">What You Can Monitor</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Server className="h-5 w-5 text-palette-primary" />
                    Infrastructure Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Physical servers & virtual machines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud instances & autoscaling groups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Containers & Kubernetes nodes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Storage systems & volumes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Network devices & links</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-palette-secondary" />
                    Service & Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Web applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>APIs & microservices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Databases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Load balancers & gateways</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>CI/CD runners & pipelines</span>
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
                  <CardTitle className="text-slate-800">Continuous Health Signals</CardTitle>
                  <CardDescription className="text-slate-600">
                    Health monitoring runs continuously using:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agent-based</strong> host metrics
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agentless</strong> probes (ICMP, TCP, HTTP)
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Cloud service</strong> status APIs
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Service-level</strong> checks
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-xl bg-gradient-to-br from-palette-secondary/15 to-palette-accent-2/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Context-Aware Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Health signals are enriched with:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Asset ownership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Environment (prod, staging, dev)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Recent configuration or deployment changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Dependency relationships</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 mt-4 italic">
                    This turns raw uptime into actionable insight.
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
                    <span>Uptime & downtime tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Service availability (%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Host and service health status</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Incident timelines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Mean time to detect (MTTD)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Mean time to recover (MTTR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Health trend analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why Health Matters */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Health Matters</h2>
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-palette-primary/20 to-palette-accent-1/20">
                      <TableHead className="font-bold text-slate-800">Without Health</TableHead>
                      <TableHead className="font-bold text-slate-800">With Opticini Health</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-slate-700">Reactive firefighting</TableCell>
                      <TableCell className="text-slate-700 font-medium">Proactive detection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Blind dependency failures</TableCell>
                      <TableCell className="text-slate-700 font-medium">Contextual alerts</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">SLA breaches</TableCell>
                      <TableCell className="text-slate-700 font-medium">SLA confidence</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">No root cause clarity</TableCell>
                      <TableCell className="text-slate-700 font-medium">Faster resolution</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Health Feeds the Entire Platform */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Health Feeds the Entire Platform</h2>
            <p className="text-lg text-slate-700 mb-10 text-center">
              Opticini Health is tightly integrated with:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Change</p>
                  <p className="text-sm text-slate-600 mt-1">correlate incidents with recent changes</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Performance</p>
                  <p className="text-sm text-slate-600 mt-1">distinguish slow vs unavailable systems</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Security</p>
                  <p className="text-sm text-slate-600 mt-1">detect outages caused by misconfigurations</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">prove availability controls</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">elevate repeated failures as operational risk</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Uses Health */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who Uses Health</h2>
            <Card className="border-2 border-palette-accent-3/50 shadow-xl bg-gradient-to-br from-palette-accent-3/15 to-palette-accent-2/20">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>IT Operations</span>
                  </li>
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
                    <span>Incident Response Teams</span>
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
                  Faster detection, quicker resolution, and greater confidence in system availability.
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
            Protect Your Uptime
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Stop reacting to outages—start preventing them.
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
