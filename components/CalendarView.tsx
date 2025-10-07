import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Task } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function CalendarView({ tasks, selectedDate, onDateSelect }: CalendarViewProps) {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [viewSelectedDate, setViewSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null;
      return taskDate === dateStr || dueDate === dateStr;
    });
  };

  const getTasksForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      return (taskDate >= startDate && taskDate < endDate) || 
             (dueDate && dueDate >= startDate && dueDate < endDate);
    });
  };

  const getTasksForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      return (taskDate.getFullYear() === year && taskDate.getMonth() === month) ||
             (dueDate && dueDate.getFullYear() === year && dueDate.getMonth() === month);
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const today = new Date();
  const todayTasks = getTasksForDate(today);
  const weekTasks = getTasksForWeek(today);
  const monthTasks = getTasksForMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }, [daysInMonth, startingDayOfWeek]);

  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  };

  const hasTasksOnDay = (day: number) => {
    const date = new Date(year, month, day);
    return getTasksForDate(date).length > 0;
  };

  const selectedDateTasks = useMemo(() => {
    if (!viewSelectedDate) return [];
    return getTasksForDate(viewSelectedDate);
  }, [viewSelectedDate, tasks]);

  const getStatusIcon = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 size={18} color={colors.success} />;
      case 'in-progress':
        return <Clock size={18} color={colors.warning} />;
      default:
        return <Circle size={18} color={colors.textLight} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    headerControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    monthYear: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.text,
      minWidth: 120,
      textAlign: 'center' as const,
    },
    navButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surfaceTint,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '500' as const,
      textAlign: 'center' as const,
    },
    calendarGrid: {
      marginTop: 8,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 8,
    },
    dayName: {
      width: 40,
      textAlign: 'center' as const,
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap' as const,
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
    },
    dayButton: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
    },
    dayButtonToday: {
      backgroundColor: colors.primary,
    },
    dayButtonSelected: {
      backgroundColor: '#10B981',
    },
    dayButtonHasTasks: {
      backgroundColor: colors.primaryLight + '30',
    },
    dayText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500' as const,
    },
    dayTextToday: {
      color: colors.surface,
      fontWeight: '700' as const,
    },
    dayTextSelected: {
      color: colors.surface,
      fontWeight: '700' as const,
    },
    dayTextEmpty: {
      color: 'transparent',
    },
    taskDot: {
      position: 'absolute' as const,
      bottom: 2,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    taskDotToday: {
      backgroundColor: colors.surface,
    },
    selectedDateSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    selectedDateHeader: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
    },
    tasksList: {
      gap: 8,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surfaceTint,
      padding: 12,
      borderRadius: 12,
    },
    taskItemContent: {
      flex: 1,
    },
    taskItemTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 2,
    },
    taskItemSteps: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyTasksText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
      paddingVertical: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>Task Calendar</Text>
        </View>
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.navButton} onPress={previousMonth}>
            <ChevronLeft size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[month]} {year}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={nextMonth}>
            <ChevronRight size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todayTasks.length}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{weekTasks.length}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{monthTasks.length}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      <View style={styles.calendarGrid}>
        <View style={styles.weekRow}>
          {dayNames.map(day => (
            <Text key={day} style={styles.dayName}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${year}-${month}-${index}`} style={styles.dayCell} />;
            }
            
            return (
              <View key={`day-${year}-${month}-${day}`} style={styles.dayCell}>
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    isToday(day) && styles.dayButtonToday,
                    !isToday(day) && isSelectedDate(day) && styles.dayButtonSelected,
                    !isToday(day) && !isSelectedDate(day) && hasTasksOnDay(day) && styles.dayButtonHasTasks,
                  ]}
                  onPress={() => {
                    const date = new Date(year, month, day);
                    setViewSelectedDate(date);
                    onDateSelect?.(date);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday(day) && styles.dayTextToday,
                      !isToday(day) && isSelectedDate(day) && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasTasksOnDay(day) && (
                    <View style={[
                      styles.taskDot,
                      (isToday(day) || isSelectedDate(day)) && styles.taskDotToday,
                    ]} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {viewSelectedDate && (
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateHeader}>
            Tasks for {viewSelectedDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          {selectedDateTasks.length > 0 ? (
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              <View style={styles.tasksList}>
                {selectedDateTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskItem}
                    onPress={() => router.push(`/task/${task.id}`)}
                    activeOpacity={0.7}
                  >
                    {getStatusIcon(task)}
                    <View style={styles.taskItemContent}>
                      <Text style={styles.taskItemTitle} numberOfLines={1}>
                        {task.title}
                      </Text>
                      {task.steps.length > 0 && (
                        <Text style={styles.taskItemSteps}>
                          {task.steps.filter(s => s.completed).length}/{task.steps.length} steps
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.emptyTasksText}>No tasks for this date</Text>
          )}
        </View>
      )}
    </View>
  );
}
