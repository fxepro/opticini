"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GitBranch, User, Clock, AlertTriangle, CheckCircle, History, Server, Cloud, ArrowRight, Link2, Activity } from "lucide-react"
import Link from "next/link"

export default function ChangePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Change"
        subtitle="Know what changed — and why it matters"
        gradientFrom="from-palette-accent-1"
        gradientVia="via-palette-primary"
        gradientTo="to-palette-secondary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-accent-1/30 via-white to-palette-primary/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Every outage, breach, or compliance failure starts with a change.</strong>
          </p>
          <p className="text-lg text-slate-600">
            Opticini Change gives you complete visibility into infrastructure, configuration, and deployment changes—so teams understand impact before issues escalate.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Change Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Change Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Change continuously tracks who changed what, when, and where across your infrastructure and platforms.
              </p>
              <p className="text-lg">
                Instead of scattered logs and manual timelines, Change provides a single, correlated change history, connected to health, security, and compliance signals.
              </p>
            </div>
          </section>

          {/* What You Can Track */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">What You Can Track</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Server className="h-5 w-5 text-palette-primary" />
                    Infrastructure & Configuration Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>System and OS changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Configuration updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Network and firewall rule changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud resource modifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-palette-secondary" />
                    Platform & Application Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Deployments and releases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Infrastructure-as-code updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>CI/CD pipeline executions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Version and schema changes</span>
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
                  <CardTitle className="text-slate-800">Continuous Change Detection</CardTitle>
                  <CardDescription className="text-slate-600">
                    Opticini Change detects:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Real-time configuration deltas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Deployment and pipeline events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud and identity modifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Infrastructure lifecycle events</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-xl bg-gradient-to-br from-palette-secondary/15 to-palette-accent-2/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Change With Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Every change is enriched with:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Change author and source</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Affected assets and services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Related incidents or alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Security and compliance impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Estimated blast radius</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 mt-4 italic">
                    This turns raw change logs into actionable change intelligence.
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
                    <span>Complete change timeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Change frequency and volume</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>High-risk change indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Change-to-incident correlation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Mean time to detect change impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Unauthorized change detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why Change Matters */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Change Matters</h2>
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-palette-primary/20 to-palette-accent-1/20">
                      <TableHead className="font-bold text-slate-800">Without Change Visibility</TableHead>
                      <TableHead className="font-bold text-slate-800">With Opticini Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-slate-700">Unknown root causes</TableCell>
                      <TableCell className="text-slate-700 font-medium">Clear accountability</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Slow incident resolution</TableCell>
                      <TableCell className="text-slate-700 font-medium">Faster RCA</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Hidden risky changes</TableCell>
                      <TableCell className="text-slate-700 font-medium">Early risk detection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Audit gaps</TableCell>
                      <TableCell className="text-slate-700 font-medium">Verified change control</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Change Connects Everything */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Change Connects Everything</h2>
            <p className="text-lg text-slate-700 mb-10 text-center">
              Opticini Change strengthens:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">correlate outages to changes</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Performance</p>
                  <p className="text-sm text-slate-600 mt-1">detect regressions after deploys</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Security</p>
                  <p className="text-sm text-slate-600 mt-1">identify risky or unauthorized changes</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">prove controlled change management</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">elevate patterns of dangerous change</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Uses Change */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who Uses Change</h2>
            <Card className="border-2 border-palette-accent-3/50 shadow-xl bg-gradient-to-br from-palette-accent-3/15 to-palette-accent-2/20">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>DevOps & SRE Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Platform Engineering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>IT Operations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Security Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Compliance & GRC</span>
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
                  Clear accountability, faster incident resolution, and safer changes—everywhere.
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
            Bring Clarity to Change
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Stop guessing. Start knowing.
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
                Explore change tracking
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
