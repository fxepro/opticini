"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Server, Cloud, Database, Network, Container, CheckCircle, ArrowRight, Link2, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Discovery"
        subtitle="Know everything that exists"
        gradientFrom="from-palette-accent-3"
        gradientVia="via-palette-accent-2"
        gradientTo="to-palette-primary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-accent-3/30 via-white to-palette-accent-2/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">You can't manage, secure, or comply with what you can't see.</strong>
          </p>
          <p className="text-lg text-slate-600">
            Opticini Discovery provides a single, authoritative view of every asset across your local, hybrid, and cloud environments—automatically and continuously.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Discovery Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Discovery Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Discovery continuously identifies and inventories infrastructure assets across your organization—without manual effort or outdated spreadsheets.
              </p>
              <p className="text-lg">
                From physical servers to cloud services to APIs and identity systems, Discovery becomes your living source of truth.
              </p>
            </div>
          </section>

          {/* What You Can Discover */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">What You Can Discover</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Server className="h-5 w-5 text-palette-primary" />
                    Infrastructure Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Physical servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Virtual machines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud instances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Containers & Kubernetes clusters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Databases & storage systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Network devices</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-palette-secondary" />
                    Platform & Application Assets
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
                      <span>Load balancers & gateways</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>CI/CD pipelines</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-1/50 shadow-lg bg-gradient-to-br from-palette-accent-1/10 to-palette-accent-3/20 hover:border-palette-accent-1/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Network className="h-5 w-5 text-palette-accent-1" />
                    Identity & Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Users & service accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Roles & permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Identity providers (IdP, IAM)</span>
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
                  <CardTitle className="text-slate-800">Agent-based or Agentless</CardTitle>
                  <CardDescription className="text-slate-600">
                    Choose the approach that fits your environment:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agent-based</strong> for deep host visibility
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agentless</strong> via cloud APIs, SSH, SNMP, and network probes
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-xl bg-gradient-to-br from-palette-secondary/15 to-palette-accent-2/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Continuous Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    Discovery runs continuously—not as a one-time scan—so new assets, changes, and removals are always tracked.
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
                    <span>Total assets by type</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Asset ownership & environment mapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Tagged vs untagged resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Orphaned or unmanaged assets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Asset change history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Infrastructure sprawl indicators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why Discovery Matters */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Discovery Matters</h2>
            <p className="text-lg text-slate-700 mb-8 text-center max-w-3xl mx-auto">
              Discovery is the foundation for every other Opticini capability.
            </p>
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-palette-primary/20 to-palette-accent-1/20">
                      <TableHead className="font-bold text-slate-800">Without Discovery</TableHead>
                      <TableHead className="font-bold text-slate-800">With Opticini Discovery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-slate-700">Blind spots</TableCell>
                      <TableCell className="text-slate-700 font-medium">Complete visibility</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Shadow IT</TableCell>
                      <TableCell className="text-slate-700 font-medium">Controlled infrastructure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Incomplete audits</TableCell>
                      <TableCell className="text-slate-700 font-medium">Accurate scope</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Missed risk</TableCell>
                      <TableCell className="text-slate-700 font-medium">Proactive insight</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Discovery Powers Everything Else */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Discovery Powers Everything Else</h2>
            <p className="text-lg text-slate-700 mb-10 text-center">
              Opticini Discovery feeds directly into:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">monitor what exists</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Security</p>
                  <p className="text-sm text-slate-600 mt-1">secure what's exposed</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">scope what's in-audit</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Cost</p>
                  <p className="text-sm text-slate-600 mt-1">track what you're paying for</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">prioritize what matters most</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Uses Discovery */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who Uses Discovery</h2>
            <Card className="border-2 border-palette-accent-3/50 shadow-xl bg-gradient-to-br from-palette-accent-3/15 to-palette-accent-2/20">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>IT Operations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>SRE & Platform Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Security Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Compliance & GRC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Finance & FinOps</span>
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
                  A real-time, trusted inventory of your entire infrastructure—always current, always accurate.
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
            Start with Discovery
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Bring clarity to your environment in minutes—not weeks.
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
                See supported integrations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
