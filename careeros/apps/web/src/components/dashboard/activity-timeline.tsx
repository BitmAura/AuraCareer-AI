"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ActivityEvent, SAMPLE_ACTIVITY_FEED } from "@/lib/agent/activity.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Briefcase,
  FileCode,
  Send,
  Mail,
  MessageSquare,
  Calendar,
  AlertCircle,
  TrendingUp,
  Clock,
  ExternalLink,
} from "lucide-react";

const EVENT_ICON_MAP: Record<string, React.ElementType> = {
  JOB_DISCOVERED: Briefcase,
  JOB_ANALYZED: Sparkles,
  RESUME_TAILORED: FileCode,
  APPLICATION_SUBMITTED: Send,
  APPROVAL_REQUESTED: AlertCircle,
  RECRUITER_FOUND: Briefcase,
  COLD_EMAIL_SENT: Mail,
  REPLY_RECEIVED: MessageSquare,
  INTERVIEW_SCHEDULED: Calendar,
  LEARNING_LOOP_UPDATED: TrendingUp,
};

interface ActivityTimelineProps {
  events?: ActivityEvent[];
  maxEvents?: number;
}

export function ActivityTimeline({ events, maxEvents = 10 }: ActivityTimelineProps) {
  const [filter, setFilter] = useState<string>("all");
  const [showDemo, setShowDemo] = useState<boolean>(false);

  const activeEvents = events && events.length > 0 ? events : showDemo ? SAMPLE_ACTIVITY_FEED : [];

  const displayEvents = activeEvents
    .filter((e) => {
      if (filter === "applications") return e.type.includes("APPLICATION") || e.type.includes("JOB");
      if (filter === "outreach") return e.type.includes("EMAIL") || e.type.includes("REPLY") || e.type.includes("INTERVIEW");
      if (filter === "learning") return e.type.includes("LEARNING") || e.type.includes("RESUME");
      return true;
    })
    .slice(0, maxEvents);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <CardTitle className="text-base font-semibold">Live Agent Activity Stream</CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Real-time chronological timeline of autonomous job discovery, resume synthesis, and outreach
          </CardDescription>
        </div>
        <div className="flex gap-1">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "applications" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={() => setFilter("applications")}
          >
            Applications
          </Button>
          <Button
            variant={filter === "outreach" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={() => setFilter("outreach")}
          >
            Recruiter Outreach
          </Button>
          <Button
            variant={filter === "learning" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={() => setFilter("learning")}
          >
            Learning
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showDemo && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
            <span>
              <strong>Demo Preview Mode:</strong> Showing simulated agent events. No real actions were submitted.
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[11px] border-amber-500/40 text-amber-700 dark:text-amber-300"
              onClick={() => setShowDemo(false)}
            >
              Exit Demo
            </Button>
          </div>
        )}

        {displayEvents.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">No Agent Activity Logged Yet</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your autonomous agent is ready on standby. Once you run your first job discovery loop or upload a resume, live timeline logs will stream here.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button size="sm" render={<Link href="/queue" />}>
                Start Job Hunt Loop
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDemo(true)}>
                Preview Demo Stream
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
            <div className="space-y-6">
              {displayEvents.map((event) => {
                const Icon = EVENT_ICON_MAP[event.type] || Sparkles;
                return (
                  <div key={event.id} className="relative group">
                    {/* Dot indicator */}
                    <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 border-primary/40 group-hover:border-primary transition-colors">
                      <Icon className="h-2.5 w-2.5 text-primary" />
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg p-2.5 transition-colors hover:bg-muted/40 border border-transparent hover:border-border/50">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{event.title}</span>
                          <Badge
                            variant={
                              event.badgeVariant === "success"
                                ? "default"
                                : event.badgeVariant === "destructive"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-[10px] font-medium h-4 px-1.5"
                          >
                            {event.badgeText}
                          </Badge>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>

                      {event.actionLabel && event.actionUrl && (
                        <div className="mt-1.5 flex items-center">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs font-semibold text-primary hover:underline"
                            render={<Link href={event.actionUrl} />}
                          >
                            {event.actionLabel}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
