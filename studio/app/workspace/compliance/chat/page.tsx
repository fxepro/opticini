"use client";

import { useState } from "react";
import { Send, MessageSquareText, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:8000");

type MatchResult = {
  type?: string;
  title?: string;
  score?: number;
  snippet?: string;
  detail?: string;
  metadata?: Record<string, any>;
};

export default function ComplianceChatPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [detailedAnswer, setDetailedAnswer] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Enter a question to search compliance data.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnswer("");
    setDetailedAnswer("");
    setMatches([]);
    setSelectedMatch(null);

    try {
      const token = localStorage.getItem("access_token");
      const baseUrl = API_BASE?.replace(/\/$/, "") || "";
      const res = await fetch(`${baseUrl}/api/compliance/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || "Chat request failed.");
      }

      const data = await res.json();
      setMatches(data.matches || []);
      setAnswer("");
      setDetailedAnswer("");
    } catch (err: any) {
      setError(err.message || "Unable to fetch compliance chat response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquareText className="h-6 w-6 text-palette-primary" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Chat</h1>
          <p className="text-sm text-slate-600">
            Ask questions about SOC 2, controls, evidence, audits, and reports.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-palette-accent-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSearch className="h-4 w-4 text-palette-primary" />
              Query Compliance Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about a control, evidence requirement, audit, or report..."
              rows={5}
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Ask"}
              </Button>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">Results</h2>
              {matches.length === 0 && !loading ? (
                <p className="text-sm text-slate-500">No results yet.</p>
              ) : null}
              {matches.map((match, index) => (
                <div
                  key={`${match.title}-${index}`}
                  className={`rounded-lg border p-3 transition ${
                    selectedMatch?.title === match.title
                      ? "border-palette-primary bg-palette-accent-3/40"
                      : "border-slate-200 hover:border-palette-accent-1"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedMatch(match);
                    setAnswer(`Selected: ${match.title || "Result"}`);
                    setDetailedAnswer(match.detail || "");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedMatch(match);
                      setAnswer(`Selected: ${match.title || "Result"}`);
                      setDetailedAnswer(match.detail || "");
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      {match.title}
                    </p>
                    <span className="text-xs text-slate-500">
                      Score {match.score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {match.type}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{match.snippet}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-palette-accent-1">
          <CardHeader>
            <CardTitle className="text-base">Detailed Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMatch ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">{answer}</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {detailedAnswer || "No detailed record available."}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a result to see details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
