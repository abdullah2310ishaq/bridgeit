"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
  isCompleted?: boolean;
}

interface MilestoneTimelineProps {
  milestones: TimelineItem[];
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return <p className="text-gray-400">No milestones for timeline.</p>;
  }

  return (
    <div className="space-y-6">
      {milestones.map((mile, index) => {
        const progressValue = mile.isCompleted ? 100 : 0;
        
        return (
          <div key={mile.id} className="flex items-center gap-4">
            {/* Circular Progress */}
            <div className="w-14 h-14">
              <CircularProgressbar
                value={progressValue}
                text={`${progressValue}%`}
                styles={buildStyles({
                  pathColor: mile.isCompleted ? "#10B981" : "#FBBF24", // green if done, yellow if pending
                  textColor: "#FFFFFF",
                  trailColor: "#374151",
                })}
              />
            </div>

            {/* Text / Date */}
            <div>
              <h3 className="text-lg font-semibold text-green-300">
                {mile.title}
              </h3>
              <p className="text-sm text-gray-400">
                Target Date: {mile.achievementDate}
              </p>
            </div>

            {/* Optional marker line or index */}
            <div className="ml-auto text-gray-500 text-sm">
              #{index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneTimeline;
