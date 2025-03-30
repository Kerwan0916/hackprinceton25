import React, { memo } from 'react';
import ScheduleScreen from '../schedule';

// Wrap the ScheduleScreen in memo to prevent unnecessary re-renders
const MemoizedScheduleScreen = memo(ScheduleScreen);

export default function ScheduleTab() {
  // Directly render the memoized Schedule screen 
  return <MemoizedScheduleScreen />;
} 