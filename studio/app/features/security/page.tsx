"use client"

import { SimpleHeroSection } from "@/components/simple-hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Lock, AlertTriangle, Network, Server, Key, CheckCircle, ArrowRight, Link2, Eye, Scan } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Security"
        subtitle="See your exposure before attackers do"
        gradientFrom="from-palette-accent-1"
        gradientVia="via-palette-primary"
        gradientTo="to-palette-secondary"
      />

      {/* Positioning Statement */}
      <div className="bg-gradient-to-br from-palette-accent-1/30 via-white to-palette-primary/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xl text-slate-700 font-medium mb-6">
            <strong className="text-palette-primary">Most breaches don't start with zero-days—they start with visibility gaps.</strong>
          </p>
          <p className="text-lg text-slate-600">
            Opticini Security provides continuous insight into your infrastructure's exposure, misconfigurations, and vulnerabilities across local, hybrid, and cloud environments.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          
          {/* What Security Does */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Security Does</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg mb-6">
                Opticini Security continuously evaluates your infrastructure and services to identify attack surface exposure, security misconfigurations, and vulnerability risks.
              </p>
              <p className="text-lg">
                Instead of point-in-time scans, Security delivers ongoing security posture awareness, tightly integrated with infrastructure, configuration, and change data.
              </p>
            </div>
          </section>

          {/* What You Can Secure */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-3/20 via-palette-accent-2/10 to-transparent py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">What You Can Secure</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-palette-primary/50 shadow-lg bg-gradient-to-br from-palette-primary/10 to-palette-accent-3/20 hover:border-palette-primary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Network className="h-5 w-5 text-palette-primary" />
                    Infrastructure & Network Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Open ports and services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Publicly exposed systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Firewall and security group gaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-primary mt-0.5 flex-shrink-0" />
                      <span>Network access paths</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-lg bg-gradient-to-br from-palette-secondary/10 to-palette-accent-2/20 hover:border-palette-secondary/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Server className="h-5 w-5 text-palette-secondary" />
                    System & Platform Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>OS and package vulnerabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Container image vulnerabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Weak TLS and encryption settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Logging and monitoring gaps</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-accent-1/50 shadow-lg bg-gradient-to-br from-palette-accent-1/10 to-palette-accent-3/20 hover:border-palette-accent-1/80 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Key className="h-5 w-5 text-palette-accent-1" />
                    Identity & Access Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>MFA enforcement gaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Excessive privileges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Orphaned or stale accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-accent-1 mt-0.5 flex-shrink-0" />
                      <span>Service account risk</span>
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
                  <CardTitle className="text-slate-800">Continuous Security Signals</CardTitle>
                  <CardDescription className="text-slate-600">
                    Opticini Security uses:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agent-based</strong> host and package inspection
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Agentless</strong> exposure and configuration checks
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Cloud security</strong> posture APIs
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="text-palette-primary">Identity and access</strong> state analysis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-palette-secondary/50 shadow-xl bg-gradient-to-br from-palette-secondary/15 to-palette-accent-2/20">
                <CardHeader>
                  <CardTitle className="text-slate-800">Security With Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Security findings are enriched with:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Asset criticality and ownership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Environment (production vs non-production)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Recent configuration or access changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-palette-secondary mt-0.5 flex-shrink-0" />
                      <span>Known dependencies and blast radius</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 mt-4 italic">
                    This ensures teams focus on what actually matters.
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
                    <span>Attack surface inventory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Vulnerabilities by severity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Public exposure indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Misconfiguration findings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Identity risk indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Security posture score</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Time-to-remediate metrics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why Security Matters */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Security Matters</h2>
            <Card className="border-2 border-palette-primary/50 shadow-xl bg-gradient-to-br from-palette-primary/15 to-palette-accent-1/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-palette-primary/20 to-palette-accent-1/20">
                      <TableHead className="font-bold text-slate-800">Without Continuous Security</TableHead>
                      <TableHead className="font-bold text-slate-800">With Opticini Security</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-slate-700">Blind attack surface</TableCell>
                      <TableCell className="text-slate-700 font-medium">Full exposure visibility</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Point-in-time scans</TableCell>
                      <TableCell className="text-slate-700 font-medium">Continuous posture</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Alert overload</TableCell>
                      <TableCell className="text-slate-700 font-medium">Prioritized risk</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-700">Late breach detection</TableCell>
                      <TableCell className="text-slate-700 font-medium">Early risk reduction</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Security Feeds the Platform */}
          <section className="mb-24 bg-gradient-to-br from-palette-accent-1/15 via-palette-accent-2/10 to-palette-accent-3/15 py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Security Feeds the Platform</h2>
            <p className="text-lg text-slate-700 mb-10 text-center">
              Opticini Security directly strengthens:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-palette-primary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-primary/5 hover:border-palette-primary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Configuration</p>
                  <p className="text-sm text-slate-600 mt-1">detect insecure drift</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-secondary/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-secondary/5 hover:border-palette-secondary/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Compliance</p>
                  <p className="text-sm text-slate-600 mt-1">enforce technical controls</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-1/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-1/5 hover:border-palette-accent-1/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Change</p>
                  <p className="text-sm text-slate-600 mt-1">identify risky changes immediately</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-2/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-2/5 hover:border-palette-accent-2/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Risk</p>
                  <p className="text-sm text-slate-600 mt-1">quantify and prioritize threats</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-palette-accent-3/30 shadow-lg text-center bg-gradient-to-br from-white to-palette-accent-3/5 hover:border-palette-accent-3/60 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <p className="font-semibold text-slate-800">Health</p>
                  <p className="text-sm text-slate-600 mt-1">prevent outages caused by misconfigurations</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Uses Security */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Who Uses Security</h2>
            <Card className="border-2 border-palette-accent-3/50 shadow-xl bg-gradient-to-br from-palette-accent-3/15 to-palette-accent-2/20">
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Security Operations (SecOps)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Infrastructure Security</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>Platform & Cloud Security Teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-primary flex-shrink-0" />
                    <span>IT Operations</span>
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
                  A smaller attack surface, faster remediation, and continuous security confidence.
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
            Secure What You Run
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            See risk clearly. Act decisively.
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
