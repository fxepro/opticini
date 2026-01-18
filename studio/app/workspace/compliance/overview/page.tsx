import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  FileText,
  Search,
  BarChart3,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const overviewItems = [
  {
    title: "Frameworks",
    description: "Enable and track frameworks like SOC 2, ISO, HIPAA.",
    href: "/workspace/compliance/frameworks",
    icon: ShieldCheck,
  },
  {
    title: "Controls",
    description: "Manage control requirements and coverage.",
    href: "/workspace/compliance/controls",
    icon: Shield,
  },
  {
    title: "Evidence",
    description: "Review collected evidence and freshness status.",
    href: "/workspace/compliance/evidence",
    icon: FileText,
  },
  {
    title: "Policies",
    description: "Generate and maintain compliance policies.",
    href: "/workspace/compliance/policies",
    icon: FileText,
  },
  {
    title: "Audits",
    description: "Run audits and track assessment progress.",
    href: "/workspace/compliance/audits",
    icon: Search,
  },
  {
    title: "Reports",
    description: "Export compliance reports and attestations.",
    href: "/workspace/compliance/reports",
    icon: BarChart3,
  },
  {
    title: "Tools",
    description: "Configure scanners and evidence collection tools.",
    href: "/workspace/compliance/tools",
    icon: Settings,
  },
];

export default function ComplianceOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-palette-primary" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Overview</h1>
          <p className="text-sm text-slate-600">
            Quick access to all compliance workflows and reporting.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border border-palette-accent-1">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-palette-accent-2/40">
                  <Icon className="h-5 w-5 text-palette-primary" />
                </div>
                <CardTitle className="text-base text-slate-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{item.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.href}>Open {item.title}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
