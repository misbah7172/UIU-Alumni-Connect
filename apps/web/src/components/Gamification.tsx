"use client";

import { Award, Flame, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UserBadges({ reputationPoints }: { reputationPoints: number }) {
  const badges = [];

  if (reputationPoints >= 100) badges.push({ name: "Getting Started", icon: "🚀", color: "bg-blue-500" });
  if (reputationPoints >= 500) badges.push({ name: "Active Contributor", icon: "⭐", color: "bg-yellow-500" });
  if (reputationPoints >= 1000) badges.push({ name: "Community Leader", icon: "👑", color: "bg-purple-500" });
  if (reputationPoints >= 2000) badges.push({ name: "Expert", icon: "🏆", color: "bg-red-500" });

  return (
    <Card>
      <CardHeader>
        <h3 className="flex items-center gap-2 font-bold">
          <Award size={18} />
          Achievements
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div key={badge.name} className={`rounded-lg p-3 text-center text-white ${badge.color}`}>
              <div className="text-2xl">{badge.icon}</div>
              <p className="mt-1 text-xs font-semibold">{badge.name}</p>
            </div>
          ))}
          {badges.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground">No badges yet. Keep contributing!</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function Leaderboard({ users }: { users: any[] }) {
  const sortedUsers = [...users].sort((a, b) => b.reputationPoints - a.reputationPoints).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <h3 className="flex items-center gap-2 font-bold">
          <TrendingUp size={18} />
          Top Contributors
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between rounded-md bg-muted p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold">{user.name}</span>
              </div>
              <Badge>{user.reputationPoints} pts</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
