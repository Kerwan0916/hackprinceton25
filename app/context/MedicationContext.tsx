import React, { createContext, useContext, useState } from 'react';

interface MedicationContextType {
  completedDays: Set<string>;
  markDayAsCompleted: (date: Date) => void;
  isDayCompleted: (date: Date) => boolean;
  removeCompletedDay: (date: Date) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const markDayAsCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setCompletedDays(prev => new Set([...prev, dateString]));
  };

  const removeCompletedDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setCompletedDays(prev => {
      const newSet = new Set(prev);
      newSet.delete(dateString);
      return newSet;
    });
  };

  const isDayCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedDays.has(dateString);
  };

  return (
    <MedicationContext.Provider value={{ 
      completedDays, 
      markDayAsCompleted, 
      isDayCompleted,
      removeCompletedDay 
    }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedication() {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
} 