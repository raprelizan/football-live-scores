import { notifyOwner } from "../_core/notification";

export interface MatchNotification {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  type: "goal" | "status_change" | "match_end";
  details?: {
    scorer?: string;
    minute?: number;
    newStatus?: string;
    finalScore?: string;
  };
}

/**
 * Send notifications for match events
 */
export async function sendMatchNotification(notification: MatchNotification) {
  const { matchId, homeTeam, awayTeam, type, details } = notification;

  let title = "";
  let content = "";

  switch (type) {
    case "goal":
      title = `⚽ هدف! ${homeTeam} vs ${awayTeam}`;
      content = `${details?.scorer} سجل هدفاً في الدقيقة ${details?.minute}`;
      break;

    case "status_change":
      title = `🔔 تحديث: ${homeTeam} vs ${awayTeam}`;
      content = `تغيرت حالة المباراة إلى: ${details?.newStatus}`;
      break;

    case "match_end":
      title = `✅ انتهت المباراة: ${homeTeam} vs ${awayTeam}`;
      content = `النتيجة النهائية: ${details?.finalScore}`;
      break;
  }

  try {
    await notifyOwner({
      title,
      content,
    });
  } catch (error) {
    console.error("[Notification] Failed to send notification:", error);
  }
}

/**
 * Check for goal events and send notifications
 */
export function checkForGoals(
  previousEvents: any[],
  currentEvents: any[]
): MatchNotification[] {
  const notifications: MatchNotification[] = [];
  const previousGoals = previousEvents.filter((e) => e.type === "GOAL");
  const currentGoals = currentEvents.filter((e) => e.type === "GOAL");

  if (currentGoals.length > previousGoals.length) {
    const newGoal = currentGoals[currentGoals.length - 1];
    notifications.push({
      matchId: 0,
      homeTeam: "",
      awayTeam: "",
      type: "goal",
      details: {
        scorer: newGoal.player?.name,
        minute: newGoal.minute,
      },
    });
  }

  return notifications;
}

/**
 * Check for status changes and send notifications
 */
export function checkForStatusChange(
  previousStatus: string,
  currentStatus: string
): MatchNotification | null {
  if (previousStatus !== currentStatus) {
    return {
      matchId: 0,
      homeTeam: "",
      awayTeam: "",
      type: "status_change",
      details: {
        newStatus: currentStatus,
      },
    };
  }
  return null;
}
