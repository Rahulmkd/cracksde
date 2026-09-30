"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Sparkles,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: "sprint" | "revision" | "streak" | "system";
  isRead: boolean;
  actionHref?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Spaced Repetitions Due Today",
    message: "You have 4 scheduled concept revisions due for optimal long-term retention.",
    time: "2 hours ago",
    category: "revision",
    isRead: false,
    actionHref: "/prep-hub",
    actionLabel: "Start Revisions",
  },
  {
    id: "2",
    title: "Daily Streak at Risk",
    message: "Solve at least 1 problem before midnight to keep your active study streak alive.",
    time: "4 hours ago",
    category: "streak",
    isRead: false,
    actionHref: "/practice",
    actionLabel: "Solve Problem",
  },
  {
    id: "3",
    title: "Sprint 1: DSA Foundations Progress",
    message: "You've completed 80% of Sprint 1 tasks. Keep up the momentum!",
    time: "1 day ago",
    category: "sprint",
    isRead: true,
    actionHref: "/planly",
    actionLabel: "View Sprint",
  },
  {
    id: "4",
    title: "CrackSDE Curriculum Update",
    message: "New system design case studies and Low Level Design problems added to the curriculum.",
    time: "2 days ago",
    category: "system",
    isRead: true,
    actionHref: "/blogs",
    actionLabel: "Explore Updates",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications =
    activeFilter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getCategoryIcon = (cat: NotificationItem["category"]) => {
    switch (cat) {
      case "revision":
        return <RotateCcw className="h-4 w-4 text-blue-400" />;
      case "streak":
        return <Flame className="h-4 w-4 text-orange-400" />;
      case "sprint":
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            Stay updated with your study sprints, revisions, and streak milestones
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 text-xs text-zinc-400 hover:text-rose-400 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === "unread"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-200">
                You&apos;re all caught up!
              </h3>
              <p className="text-xs text-zinc-400 font-normal">
                No new notifications. We&apos;ll notify you when tasks or spaced repetitions are due.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border transition-all duration-200 ${
                notif.isRead
                  ? "border-zinc-800/60 bg-zinc-900/30 opacity-80"
                  : "border-blue-500/30 bg-zinc-900/70 shadow-sm"
              }`}
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-200">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.actionHref && notif.actionLabel && (
                    <Button
                      asChild
                      size="sm"
                      className="h-7 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white gap-1 px-3"
                    >
                      <Link href={notif.actionHref}>
                        {notif.actionLabel}
                        <ArrowRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </Button>
                  )}
                  <button
                    onClick={() => toggleRead(notif.id)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded hover:bg-zinc-800/60 transition-colors"
                  >
                    {notif.isRead ? "Mark unread" : "Mark read"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
