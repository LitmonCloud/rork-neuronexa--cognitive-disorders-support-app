import { Recommendation, RecommendationContext } from '@/types/recommendation';
import { UserProfile } from '@/types/userProfile';
import { Task } from '@/types/task';

export class RecommendationEngine {
  private static generateId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private static buildContext(
    profile: UserProfile,
    tasks: Task[]
  ): RecommendationContext {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentTasks = tasks.filter(t => 
      new Date(t.createdAt) > last7Days
    );
    
    const recentCompletions = recentTasks.filter(t => t.status === 'completed').length;
    const recentAbandons = recentTasks.filter(t => 
      t.status === 'pending' && 
      new Date(t.createdAt) < new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    ).length;

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const totalCompleted = completedTasks.length;

    const strugglingAreas: string[] = [];
    const strengths: string[] = [];

    if (recentAbandons > recentCompletions) {
      strugglingAreas.push('task_completion');
    }
    if (recentCompletions > 5) {
      strengths.push('consistent_completion');
    }

    const strongHabits = profile.habits.filter(h => h.confidence > 0.6);
    strongHabits.forEach(habit => {
      if (habit.pattern.includes('struggles')) {
        strugglingAreas.push(habit.pattern);
      } else {
        strengths.push(habit.pattern);
      }
    });

    return {
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: now.getDay(),
      recentTaskCompletions: recentCompletions,
      recentTaskAbandons: recentAbandons,
      streakDays: 0,
      totalTasksCompleted: totalCompleted,
      strugglingAreas,
      strengths,
    };
  }

  private static calculateRelevanceScore(
    recommendation: Omit<Recommendation, 'relevanceScore'>,
    context: RecommendationContext,
    profile: UserProfile
  ): number {
    let score = 0.5;

    if (recommendation.priority === 'urgent') score += 0.3;
    if (recommendation.priority === 'high') score += 0.2;
    if (recommendation.priority === 'medium') score += 0.1;

    const relatedPreferences = profile.preferences.filter(p =>
      recommendation.metadata?.category === p.category
    );
    if (relatedPreferences.length > 0) {
      const avgStrength = relatedPreferences.reduce((sum, p) => sum + p.strength, 0) / relatedPreferences.length;
      score += avgStrength * 0.1;
    }

    if (recommendation.type === 'breathing' && context.strugglingAreas.includes('task_completion')) {
      score += 0.15;
    }

    if (recommendation.type === 'task' && context.strengths.includes('consistent_completion')) {
      score += 0.1;
    }

    if (recommendation.type === 'timing' && context.timeOfDay === 'evening') {
      score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  static generateTaskRecommendations(
    profile: UserProfile,
    tasks: Task[],
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (context.recentTaskCompletions === 0 && tasks.length > 0) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'task',
        title: 'Start Your Day Right',
        description: 'You have pending tasks. Starting with just one can build momentum for the rest of your day.',
        priority: 'high',
        reason: 'No tasks completed recently',
        actionLabel: 'View Tasks',
        actionRoute: '/',
        metadata: { category: 'motivation' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    if (context.recentTaskAbandons > 3) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'task',
        title: 'Break It Down',
        description: 'Having trouble finishing tasks? Let Nexa help break them into smaller, manageable steps.',
        priority: 'high',
        reason: 'Multiple abandoned tasks detected',
        actionLabel: 'Talk to Nexa',
        actionRoute: '/coach',
        metadata: { category: 'task' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    const highPriorityTasks = tasks.filter(t => 
      t.priority === 'high' && t.status === 'pending'
    );
    if (highPriorityTasks.length > 0 && context.timeOfDay === 'morning') {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'task',
        title: 'Tackle High Priority Tasks',
        description: `You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''}. Morning is a great time to focus on important work.`,
        priority: 'medium',
        reason: 'High priority tasks pending in optimal time',
        actionLabel: 'View Tasks',
        actionRoute: '/',
        metadata: { category: 'timing', taskCount: highPriorityTasks.length },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    return recommendations;
  }

  static generateWellnessRecommendations(
    profile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (context.strugglingAreas.includes('task_completion') || context.recentTaskAbandons > 2) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'breathing',
        title: 'Take a Breathing Break',
        description: 'Feeling overwhelmed? A quick breathing exercise can help you reset and refocus.',
        priority: 'medium',
        reason: 'Detected signs of task-related stress',
        actionLabel: 'Start Exercise',
        actionRoute: '/wellness',
        metadata: { category: 'wellness', exerciseType: 'breathing' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    if (context.timeOfDay === 'evening' && context.recentTaskCompletions > 3) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'wellness',
        title: 'Wind Down for Better Sleep',
        description: 'You\'ve had a productive day! Try a relaxation exercise to help you unwind.',
        priority: 'low',
        reason: 'Evening time after productive day',
        actionLabel: 'Relax Now',
        actionRoute: '/wellness',
        metadata: { category: 'wellness', timeOfDay: 'evening' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    const breathingPreference = profile.preferences.find(p => 
      p.category === 'general' && p.preference.includes('breathing')
    );
    if (breathingPreference && breathingPreference.strength > 5) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'breathing',
        title: 'Your Favorite Exercise',
        description: 'It\'s been a while since your last breathing exercise. Ready for another session?',
        priority: 'low',
        reason: 'User shows preference for breathing exercises',
        actionLabel: 'Start Breathing',
        actionRoute: '/wellness',
        metadata: { category: 'wellness', preferenceStrength: breathingPreference.strength },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    return recommendations;
  }

  static generateFeatureRecommendations(
    profile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    const hasUsedNexa = profile.interactions.some(i => 
      i.metadata?.source === 'nexa'
    );
    if (!hasUsedNexa && context.totalTasksCompleted > 2) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'feature',
        title: 'Meet Nexa, Your AI Coach',
        description: 'Get personalized support, task breakdowns, and encouragement from your AI cognitive coach.',
        priority: 'high',
        reason: 'User hasn\'t tried Nexa yet',
        actionLabel: 'Try Nexa',
        actionRoute: '/coach',
        metadata: { category: 'feature', feature: 'nexa' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    const isCognitive = profile.role === 'patient' && profile.patientType === 'cognitive';
    const isMemory = profile.role === 'patient' && profile.patientType === 'memory';

    if (isCognitive && context.totalTasksCompleted > 5) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'feature',
        title: 'Track Your Progress',
        description: 'See how far you\'ve come! View your completion stats and celebrate your achievements.',
        priority: 'low',
        reason: 'User has completed multiple tasks',
        actionLabel: 'View Progress',
        actionRoute: '/progress',
        metadata: { category: 'feature', feature: 'progress' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    if ((isCognitive || isMemory) && !profile.preferences.some(p => p.category === 'communication')) {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'feature',
        title: 'Customize Your Experience',
        description: 'Adjust accessibility settings, visual preferences, and communication style to match your needs.',
        priority: 'medium',
        reason: 'User hasn\'t customized settings',
        actionLabel: 'Open Settings',
        actionRoute: '/settings',
        metadata: { category: 'feature', feature: 'settings' },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    return recommendations;
  }

  static generateResourceRecommendations(
    profile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    const isCognitive = profile.role === 'patient' && profile.patientType === 'cognitive';
    const isMemory = profile.role === 'patient' && profile.patientType === 'memory';
    const isCaregiver = profile.role === 'caregiver';

    if (context.strugglingAreas.length > 2) {
      let title = 'Support Resources Available';
      let description = 'You\'re not alone. Access helpful resources and support networks.';
      
      if (isCognitive) {
        description = 'Connect with ADHD, autism, and cognitive support organizations that understand your journey.';
      } else if (isMemory) {
        description = 'Access Alzheimer\'s and dementia support services available 24/7.';
      } else if (isCaregiver) {
        description = 'Find caregiver support groups, respite care, and mental health resources.';
      }

      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'resource',
        title,
        description,
        priority: 'medium',
        reason: 'User showing signs of struggle',
        actionLabel: 'View Resources',
        actionRoute: '/settings',
        metadata: { category: 'support', userType: profile.role },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    return recommendations;
  }

  static generateHabitRecommendations(
    profile: UserProfile,
    context: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    const morningHabit = profile.habits.find(h => 
      h.pattern.includes('morning') && h.confidence > 0.5
    );
    if (morningHabit && context.timeOfDay === 'morning') {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'habit',
        title: 'Morning Routine Detected',
        description: 'You tend to be most productive in the morning. Consider scheduling important tasks now.',
        priority: 'low',
        reason: 'Strong morning productivity pattern',
        actionLabel: 'Plan Morning',
        actionRoute: '/',
        metadata: { category: 'timing', habit: morningHabit.pattern },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    const eveningStruggles = profile.habits.find(h => 
      h.pattern.includes('evening') && h.pattern.includes('struggles')
    );
    if (eveningStruggles && context.timeOfDay === 'evening') {
      const rec: Omit<Recommendation, 'relevanceScore'> = {
        id: this.generateId(),
        type: 'habit',
        title: 'Evening Energy Dip',
        description: 'You often struggle with tasks in the evening. Try tackling important work earlier in the day.',
        priority: 'low',
        reason: 'Pattern of evening task difficulty',
        actionLabel: 'Learn More',
        metadata: { category: 'timing', habit: eveningStruggles.pattern },
        createdAt: new Date().toISOString(),
      };
      recommendations.push({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, context, profile),
      });
    }

    return recommendations;
  }

  static generateRecommendations(
    profile: UserProfile,
    tasks: Task[]
  ): Recommendation[] {
    const context = this.buildContext(profile, tasks);
    
    const allRecommendations = [
      ...this.generateTaskRecommendations(profile, tasks, context),
      ...this.generateWellnessRecommendations(profile, context),
      ...this.generateFeatureRecommendations(profile, context),
      ...this.generateResourceRecommendations(profile, context),
      ...this.generateHabitRecommendations(profile, context),
    ];

    return allRecommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }
}
