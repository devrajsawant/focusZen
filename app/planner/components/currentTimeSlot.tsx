"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const hours = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

type TimeSlot = {
  hour: string;
  task: string;
  completed: boolean;
};

export default function CurrentTimeSlotList() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  // keep clock updated every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // build validated array from localStorage and compute the 4 displayed slots
  useEffect(() => {
    const saved = localStorage.getItem("dailyPlanner");
    let validated: TimeSlot[] = hours.map((h) => ({
      hour: h,
      task: "",
      completed: false,
    }));

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        validated = hours.map((hour, index) => ({
          hour,
          task: parsed[index]?.task ?? "",
          completed: parsed[index]?.completed ?? false,
        }));
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
      }
    }

    // convert current time to 12-hour "hh:00 AM/PM" for matching
    const now = currentTime;
    const currentHour = now.getHours();
    let currentTimeString = "";
    if (currentHour === 0) {
      currentTimeString = "12:00 AM";
    } else if (currentHour < 12) {
      currentTimeString = `${currentHour.toString().padStart(2, "0")}:00 AM`;
    } else if (currentHour === 12) {
      currentTimeString = "12:00 PM";
    } else {
      currentTimeString = `${(currentHour - 12)
        .toString()
        .padStart(2, "0")}:00 PM`;
    }

    const currentIndex = validated.findIndex(
      (s) => s.hour === currentTimeString
    );

    // prepare the 4 slots: previous, current (ongoing), next 2 upcoming
    const display: TimeSlot[] = [];

    if (currentIndex >= 0) {
      // previous
      if (currentIndex - 1 >= 0) {
        display.push(validated[currentIndex - 1]);
      } else {
        display.push({ hour: "—", task: "No previous task", completed: false });
      }

      // current (ongoing)
      display.push(validated[currentIndex]);

      // next two upcoming
      for (let i = 1; i <= 2; i++) {
        const idx = currentIndex + i;
        if (idx < validated.length) {
          display.push(validated[idx]);
        } else {
          display.push({
            hour: "—",
            task: "No upcoming task",
            completed: false,
          });
        }
      }
    } else {
      // fallback when outside defined hours: find first future slot, else last slot
      const nowHour = now.getHours();
      const approxIndex = validated.findIndex((slot) => {
        const [time, meridiem] = slot.hour.split(" ");
        const [hh] = time.split(":").map(Number);
        let hh24 = hh % 12;
        if (meridiem === "PM") hh24 += 12;
        return hh24 >= nowHour;
      });
      const baseIndex = approxIndex >= 0 ? approxIndex : validated.length - 1;

      // previous
      if (baseIndex - 1 >= 0) display.push(validated[baseIndex - 1]);
      else
        display.push({ hour: "—", task: "No previous task", completed: false });

      // nearest (treated as ongoing)
      display.push(validated[baseIndex]);

      // upcoming x2
      for (let i = 1; i <= 2; i++) {
        const idx = baseIndex + i;
        if (idx < validated.length) display.push(validated[idx]);
        else
          display.push({
            hour: "—",
            task: "No upcoming task",
            completed: false,
          });
      }
    }

    setSlots(display);
  }, [currentTime]);

  return (
    <div className="space-y-3">
      {slots.length === 0 ? (
        <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
          No planning data available
        </div>
      ) : (
        <div className="space-y-2">
          {slots.map((s, idx) => {
            // 0 -> previous, 1 -> ongoing, 2-3 -> upcoming
            const role =
              idx === 0 ? "previous" : idx === 1 ? "ongoing" : "upcoming";

            // styling variations
            const baseClasses =
              "p-2 rounded-lg border flex items-start gap-3 transition-colors";
            const roleClasses =
              role === "ongoing"
                ? "bg-[#FCDAD8] shadow-sm" // highlighted ongoing
                : role === "previous"
                ? "bg-white border-gray-100"
                : "bg-white border-gray-100";

            // icon based on role (previous shows check only if completed)
            const Icon = () => {
              if (role === "previous") {
                return (
                  <div className="p-1 rounded bg-green-50">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                );
              }
              if (role === "ongoing") {
                return (
                  <div className="p-1 rounded bg-indigo-100">
                    <ClockIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                );
              }
              // upcoming
              return (
                <div className="p-1 rounded bg-gray-50">
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              );
            };

            return (
              <Link
                key={`${s.hour}-${idx}`}
                href="/planner"
                className={`${baseClasses} ${roleClasses} hover:bg-gray-50`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800">
                      {s.hour}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {role}
                    </span>
                  </div>

                  <p
                    className={`text-sm ${
                      s.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {s.task ||
                      (role === "upcoming" ? "No task scheduled" : "No task")}
                  </p>
                </div>
              </Link>
            );
          })}

          {/* See all link */}
          <div className="pt-1 text-right">
            <Link
              href="/planner"
              className="inline-flex items-center text-md font-normal text-[#a76907] hover:text-[#cb8109] gap-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
