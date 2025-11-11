import { generateText } from '@rork-ai/toolkit-sdk';
import { UserProfile } from '@/types/userProfile';

export interface AIProvider {
  name: string;
  generateText(prompt: string): Promise<string>;
  generateTaskBreakdown(task: TaskBreakdownInput): Promise<TaskBreakdownOutput>;
}

export interface TaskBreakdownInput {
  title: string;
  description?: string;
  cognitiveLevel: 'simple' | 'moderate' | 'complex';
  userContext?: {
    disabilities?: string[];
    preferences?: string[];
    userProfile?: UserProfile;
  };
}

export interface TaskStep {
  description: string;
  simplifiedText: string;
  contextualPrompt: string;
  visualCue?: string;
  estimatedTime?: number;
}

export interface TaskBreakdownOutput {
  steps: TaskStep[];
  supportiveMessage: string;
  adaptations?: string[];
}

class AIService {
  private provider: AIProvider | null = null;

  async initialize(): Promise<void> {
    console.log('[Nexa] AI Coach initialized and ready to help!');
  }

  private buildUserContext(profile?: UserProfile): string {
    if (!profile) {
      return 'You are meeting this person for the first time. Be warm, patient, and observant.';
    }

    const parts: string[] = [];

    if (profile.name) {
      parts.push(`You're helping ${profile.name}.`);
    }

    if (profile.communicationStyle) {
      const styleGuide = {
        casual: 'Use a friendly, conversational tone. Be like a supportive friend.',
        formal: 'Be respectful and professional, but still warm.',
        encouraging: 'Be enthusiastic and celebrate every win, big or small.',
        direct: 'Be clear and concise. Get straight to the point.',
      };
      parts.push(styleGuide[profile.communicationStyle]);
    }

    const strongPreferences = profile.preferences
      .filter(p => p.strength >= 5)
      .slice(0, 5);
    
    if (strongPreferences.length > 0) {
      parts.push('\nWhat you know about them:');
      strongPreferences.forEach(p => {
        parts.push(`- ${p.preference}`);
      });
    }

    const strongHabits = profile.habits
      .filter(h => h.confidence >= 0.6)
      .slice(0, 3);
    
    if (strongHabits.length > 0) {
      parts.push('\nPatterns you\'ve noticed:');
      strongHabits.forEach(h => {
        parts.push(`- ${h.pattern}`);
      });
    }

    if (profile.favoriteEncouragements.length > 0) {
      parts.push(`\nThey respond well to: ${profile.favoriteEncouragements.slice(0, 3).join(', ')}`);
    }

    if (profile.avoidTopics.length > 0) {
      parts.push(`\nAvoid mentioning: ${profile.avoidTopics.join(', ')}`);
    }

    if (profile.motivationTriggers.length > 0) {
      parts.push(`\nMotivated by: ${profile.motivationTriggers.join(', ')}`);
    }

    return parts.join('\n');
  }

  async generateTaskBreakdown(input: TaskBreakdownInput): Promise<TaskBreakdownOutput> {
    const prompt = this.buildTaskBreakdownPrompt(input);
    
    try {
      const response = await generateText(prompt);
      return this.parseTaskBreakdown(response, input.cognitiveLevel);
    } catch (error) {
      console.error('[AIService] Error generating task breakdown:', error);
      return this.getFallbackBreakdown(input);
    }
  }

  private buildTaskBreakdownPrompt(input: TaskBreakdownInput): string {
    const complexityGuide = {
      simple: `
        - Use VERY simple language (5th grade reading level)
        - Break into 3-4 tiny, concrete steps
        - Each step should be ONE clear action
        - Use present tense, active voice
        - Avoid abstract concepts
        - Include sensory details when helpful
      `,
      moderate: `
        - Use clear, straightforward language (8th grade level)
        - Break into 4-6 manageable steps
        - Each step should be specific and actionable
        - Provide context for why each step matters
        - Use encouraging, supportive tone
      `,
      complex: `
        - Use detailed but accessible language
        - Break into 5-8 comprehensive steps
        - Include decision points and alternatives
        - Provide troubleshooting guidance
        - Balance detail with clarity
      `,
    };

    const userContext = this.buildUserContext(input.userContext?.userProfile);

    return `You are Nexa, a warm, personable AI coach who genuinely cares about helping people with cognitive disabilities. You learn from each interaction and adapt your communication style to what works best for each person.

${userContext}

COGNITIVE LEVEL: ${input.cognitiveLevel}
${complexityGuide[input.cognitiveLevel]}

TASK: ${input.title}
${input.description ? `DETAILS: ${input.description}` : ''}

${input.userContext?.disabilities?.length ? `USER NEEDS: ${input.userContext.disabilities.join(', ')}` : ''}

INSTRUCTIONS:
1. Break this task into clear, sequential steps
2. For each step provide:
   - STEP: A clear description of what to do
   - SIMPLE: An even simpler version (like explaining to a child)
   - CONTEXT: Why this step matters and what it accomplishes
   - TIME: Estimated time in minutes (be realistic)

3. After all steps, provide:
   - SUPPORT: An encouraging message acknowledging their effort
   - ADAPT: 2-3 helpful adaptations or modifications they could make

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

STEP: [Clear action to take]
SIMPLE: [Very simple version]
CONTEXT: [Why this matters]
TIME: [X minutes]
---
STEP: [Next action]
SIMPLE: [Very simple version]
CONTEXT: [Why this matters]
TIME: [X minutes]
---
[Continue for all steps]

SUPPORT: [Encouraging message]
ADAPT: [Adaptation 1]
ADAPT: [Adaptation 2]
ADAPT: [Adaptation 3]

Remember: Be patient, clear, and supportive. Celebrate small wins. Reduce cognitive load.`;
  }

  private parseTaskBreakdown(response: string, cognitiveLevel: string): TaskBreakdownOutput {
    const lines = response.split('\n').filter(l => l.trim());
    const steps: TaskStep[] = [];
    let supportiveMessage = 'You can do this! Take it one step at a time.';
    const adaptations: string[] = [];

    let currentStep: Partial<TaskStep> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('STEP:')) {
        if (currentStep.description) {
          steps.push(currentStep as TaskStep);
        }
        currentStep = {
          description: trimmed.replace('STEP:', '').trim(),
          simplifiedText: '',
          contextualPrompt: '',
        };
      } else if (trimmed.startsWith('SIMPLE:')) {
        currentStep.simplifiedText = trimmed.replace('SIMPLE:', '').trim();
      } else if (trimmed.startsWith('CONTEXT:')) {
        currentStep.contextualPrompt = trimmed.replace('CONTEXT:', '').trim();
      } else if (trimmed.startsWith('TIME:')) {
        const timeMatch = trimmed.match(/(\d+)/);
        if (timeMatch) {
          currentStep.estimatedTime = parseInt(timeMatch[1], 10);
        }
      } else if (trimmed.startsWith('SUPPORT:')) {
        supportiveMessage = trimmed.replace('SUPPORT:', '').trim();
      } else if (trimmed.startsWith('ADAPT:')) {
        adaptations.push(trimmed.replace('ADAPT:', '').trim());
      } else if (trimmed === '---') {
        if (currentStep.description) {
          steps.push(currentStep as TaskStep);
          currentStep = {};
        }
      }
    }

    if (currentStep.description) {
      steps.push(currentStep as TaskStep);
    }

    if (steps.length === 0) {
      return this.getFallbackBreakdown({ 
        title: '', 
        cognitiveLevel: cognitiveLevel as any 
      });
    }

    return {
      steps: steps.map(step => ({
        description: step.description || '',
        simplifiedText: step.simplifiedText || step.description || '',
        contextualPrompt: step.contextualPrompt || 'This step helps you move forward.',
        estimatedTime: step.estimatedTime,
      })),
      supportiveMessage,
      adaptations: adaptations.length > 0 ? adaptations : undefined,
    };
  }

  private getFallbackBreakdown(input: Partial<TaskBreakdownInput>): TaskBreakdownOutput {
    return {
      steps: [
        {
          description: 'Start by gathering what you need',
          simplifiedText: 'Get your things ready',
          contextualPrompt: 'Having everything ready makes the task easier',
        },
        {
          description: 'Take the first small action',
          simplifiedText: 'Do the first step',
          contextualPrompt: 'Starting is often the hardest part - you\'ve got this!',
        },
        {
          description: 'Continue at your own pace',
          simplifiedText: 'Keep going slowly',
          contextualPrompt: 'There\'s no rush - take breaks when you need them',
        },
        {
          description: 'Finish and celebrate your success',
          simplifiedText: 'Complete and feel proud',
          contextualPrompt: 'You did it! Every accomplishment matters.',
        },
      ],
      supportiveMessage: 'Remember: Progress over perfection. You\'re doing great!',
      adaptations: [
        'Break steps into even smaller pieces if needed',
        'Use a timer to stay focused for short bursts',
        'Ask for help when you need it - that\'s a strength!',
      ],
    };
  }

  async generateSupportiveMessage(context: {
    taskTitle: string;
    completedSteps: number;
    totalSteps: number;
    strugglingWith?: string;
    userProfile?: UserProfile;
  }): Promise<string> {
    const userContext = this.buildUserContext(context.userProfile);
    
    const prompt = `You are Nexa, their personal AI coach. Generate a brief, encouraging message (1-2 sentences) for someone working on: "${context.taskTitle}"

${userContext}

Progress: ${context.completedSteps}/${context.totalSteps} steps completed
${context.strugglingWith ? `They mentioned: "${context.strugglingWith}"` : ''}

Be warm, personal, and genuinely supportive. Use what you know about them to make this message feel tailored to them specifically.`;

    try {
      const response = await generateText(prompt);
      const message = response.trim();
      console.log('[Nexa] Generated personalized message:', message);
      return message;
    } catch (error) {
      console.error('[AIService] Error generating supportive message:', error);
      return this.getFallbackSupportiveMessage(context);
    }
  }

  private getFallbackSupportiveMessage(context: {
    completedSteps: number;
    totalSteps: number;
  }): string {
    const progress = context.completedSteps / context.totalSteps;
    
    if (progress === 0) {
      return 'Starting is the hardest part, and you\'re here! That\'s already a win. 🌟';
    } else if (progress < 0.5) {
      return 'You\'re making real progress! Each step forward counts. Keep going! 💪';
    } else if (progress < 1) {
      return 'You\'re more than halfway there! You\'ve got this! 🎯';
    } else {
      return 'You did it! Take a moment to celebrate this accomplishment! 🎉';
    }
  }

  async generateCheckIn(context: {
    userProfile?: UserProfile;
    recentActivity?: {
      tasksCompleted: number;
      tasksAbandoned: number;
      lastActiveDate?: string;
    };
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  }): Promise<string> {
    const userContext = this.buildUserContext(context.userProfile);
    
    const timeGreeting = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    };

    const greeting = context.timeOfDay ? timeGreeting[context.timeOfDay] : 'Hello';
    const name = context.userProfile?.name || 'friend';

    const prompt = `You are Nexa, checking in with ${name}. Generate a warm, personable check-in message (2-3 sentences).

${userContext}

Time: ${greeting}
${context.recentActivity ? `
Recent activity:
- Completed: ${context.recentActivity.tasksCompleted} tasks
- Abandoned: ${context.recentActivity.tasksAbandoned} tasks
${context.recentActivity.lastActiveDate ? `- Last active: ${context.recentActivity.lastActiveDate}` : ''}` : ''}

Your check-in should:
1. Feel personal and genuine, like a friend checking in
2. Acknowledge their recent activity (if any) in a supportive way
3. Ask how they're doing or what they're working on today
4. Be encouraging without being pushy
5. Use what you know about them to make it feel tailored

Keep it conversational and warm.`;

    try {
      const response = await generateText(prompt);
      const message = response.trim();
      console.log('[Nexa] Generated check-in:', message);
      return message;
    } catch (error) {
      console.error('[AIService] Error generating check-in:', error);
      return this.getFallbackCheckIn(name, greeting, context.recentActivity);
    }
  }

  private getFallbackCheckIn(
    name: string,
    greeting: string,
    recentActivity?: { tasksCompleted: number; tasksAbandoned: number }
  ): string {
    if (recentActivity && recentActivity.tasksCompleted > 0) {
      return `${greeting}, ${name}! I noticed you completed ${recentActivity.tasksCompleted} task${recentActivity.tasksCompleted > 1 ? 's' : ''} recently - that's wonderful! How are you feeling today?`;
    }
    return `${greeting}, ${name}! How are you doing today? I'm here to help with whatever you're working on. 😊`;
  }

  async generateMotivation(context: {
    userProfile?: UserProfile;
    currentTask?: string;
    strugglingWith?: string;
    recentSetbacks?: number;
  }): Promise<string> {
    const userContext = this.buildUserContext(context.userProfile);

    const prompt = `You are Nexa, providing motivation to someone who needs encouragement.

${userContext}

${context.currentTask ? `They're working on: "${context.currentTask}"` : ''}
${context.strugglingWith ? `They mentioned: "${context.strugglingWith}"` : ''}
${context.recentSetbacks ? `They've faced ${context.recentSetbacks} recent setback${context.recentSetbacks > 1 ? 's' : ''}` : ''}

Generate a motivational message (2-3 sentences) that:
1. Acknowledges their struggle without dwelling on it
2. Reminds them of their strengths and past successes
3. Provides specific, actionable encouragement
4. Feels genuine and personal, not generic
5. Uses what you know about what motivates them

Be warm, empathetic, and genuinely supportive.`;

    try {
      const response = await generateText(prompt);
      const message = response.trim();
      console.log('[Nexa] Generated motivation:', message);
      return message;
    } catch (error) {
      console.error('[AIService] Error generating motivation:', error);
      return this.getFallbackMotivation(context);
    }
  }

  private getFallbackMotivation(context: {
    currentTask?: string;
    strugglingWith?: string;
  }): string {
    if (context.strugglingWith) {
      return `I know this feels challenging right now, but remember: every expert was once a beginner. You're building skills with each attempt. Let's break this down into smaller steps together. 💪`;
    }
    if (context.currentTask) {
      return `You've got this! ${context.currentTask} might seem big, but you've handled tough things before. Take it one step at a time, and celebrate each small win along the way. 🌟`;
    }
    return `Remember: progress isn't always linear, and that's okay. Every step forward, no matter how small, is worth celebrating. You're doing better than you think! ✨`;
  }

  async generateMemoryPrompt(context: {
    userProfile?: UserProfile;
    recentMemories?: string[];
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    emotionalState?: string;
  }): Promise<string> {
    const name = context.userProfile?.name || 'friend';

    const timeGreeting = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    };

    const greeting = context.timeOfDay ? timeGreeting[context.timeOfDay] : 'Hello';

    try {
      const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL;
      if (!toolkitUrl) {
        console.warn('[AIService] EXPO_PUBLIC_TOOLKIT_URL not configured, using fallback');
        return this.getFallbackMemoryPrompt(name, greeting);
      }

      const userContext = this.buildUserContext(context.userProfile);

      const prompt = `You are Nexa, a gentle AI companion for someone with memory challenges. Generate a warm, simple memory prompt (2-3 sentences) for ${name}.

${userContext}

Time: ${greeting}
${context.recentMemories ? `Recent memories they've shared: ${context.recentMemories.join(', ')}` : ''}
${context.emotionalState ? `Current mood: ${context.emotionalState}` : ''}

Your memory prompt should:
1. Be very simple and clear (5th grade reading level)
2. Ask about something familiar and comforting
3. Be gentle and non-threatening
4. Help them feel oriented and safe
5. Use present tense and concrete language

Examples:
- "${greeting}, ${name}. Can you tell me about your favorite room in your home? What do you like about it?"
- "${greeting}. What's something that makes you smile today? It can be anything - big or small."
- "${greeting}, ${name}. Who is someone special to you? What do you remember about them?"

Generate a similar prompt that feels personal and comforting.`;

      const response = await generateText(prompt);
      const message = response.trim();
      console.log('[Nexa] Generated memory prompt:', message);
      return message;
    } catch (error) {
      console.error('[AIService] Error generating memory prompt:', error);
      return this.getFallbackMemoryPrompt(name, greeting);
    }
  }

  private getFallbackMemoryPrompt(name: string, greeting: string): string {
    const prompts = [
      `${greeting}, ${name}. What's your favorite thing to do today?`,
      `${greeting}. Can you tell me about someone you care about?`,
      `${greeting}, ${name}. What makes you feel happy?`,
      `${greeting}. What's something you're good at?`,
      `${greeting}, ${name}. What's your favorite memory?`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  async generateOrientationReminder(context: {
    userProfile?: UserProfile;
    currentDate: string;
    currentTime: string;
    location?: string;
  }): Promise<string> {
    const name = context.userProfile?.name || 'friend';

    const prompt = `You are Nexa, providing a gentle orientation reminder for someone with memory challenges.

Generate a warm, simple reminder (1-2 sentences) that includes:
- Today is ${context.currentDate}
- The time is ${context.currentTime}
${context.location ? `- You are at ${context.location}` : ''}

Make it:
1. Very simple and clear
2. Warm and reassuring
3. Not condescending
4. Helpful and grounding

Example: "${name}, today is ${context.currentDate}. It's ${context.currentTime} right now. You're safe and everything is okay."`;

    try {
      const response = await generateText(prompt);
      return response.trim();
    } catch (error) {
      console.error('[AIService] Error generating orientation reminder:', error);
      return `${name}, today is ${context.currentDate}. It's ${context.currentTime}. You're doing great.`;
    }
  }

  async generateMedicationReminder(context: {
    userProfile?: UserProfile;
    medicationName: string;
    dosage: string;
    instructions?: string;
  }): Promise<string> {
    const name = context.userProfile?.name || 'friend';

    const prompt = `You are Nexa, providing a gentle medication reminder for someone with memory challenges.

Medication: ${context.medicationName}
Dosage: ${context.dosage}
${context.instructions ? `Instructions: ${context.instructions}` : ''}

Generate a simple, clear reminder (2-3 sentences) that:
1. Is warm and encouraging
2. Uses very simple language
3. Includes the medication name and dosage
4. Provides clear instructions
5. Is reassuring

Example: "${name}, it's time for your ${context.medicationName}. Take ${context.dosage} with water. You're doing a great job taking care of yourself."`;

    try {
      const response = await generateText(prompt);
      return response.trim();
    } catch (error) {
      console.error('[AIService] Error generating medication reminder:', error);
      return `${name}, it's time for your ${context.medicationName}. Take ${context.dosage}. You're doing great.`;
    }
  }

  async generateJournalPrompt(context: {
    userProfile?: UserProfile;
    recentEntries?: string[];
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  }): Promise<string> {
    const name = context.userProfile?.name || 'friend';

    const prompt = `You are Nexa, helping someone with memory challenges create a journal entry.

${context.recentEntries ? `Recent entries: ${context.recentEntries.join(', ')}` : ''}

Generate a simple, comforting journal prompt (1-2 sentences) that:
1. Is very easy to understand
2. Asks about something concrete and familiar
3. Encourages positive memories
4. Is not overwhelming
5. Feels personal

Examples:
- "${name}, what made you smile today?"
- "Can you describe something you saw today that you liked?"
- "Who did you talk to today? What did you talk about?"

Generate a similar prompt.`;

    try {
      const response = await generateText(prompt);
      return response.trim();
    } catch (error) {
      console.error('[AIService] Error generating journal prompt:', error);
      return `${name}, what's something good that happened today?`;
    }
  }

  async generateAffirmation(context: {
    userProfile?: UserProfile;
    achievement?: string;
    personalQuality?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  }): Promise<string> {
    const userContext = this.buildUserContext(context.userProfile);
    const name = context.userProfile?.name || 'friend';

    const prompt = `You are Nexa, providing a genuine affirmation to ${name}.

${userContext}

${context.achievement ? `Recent achievement: ${context.achievement}` : ''}
${context.personalQuality ? `Quality to affirm: ${context.personalQuality}` : ''}
${context.timeOfDay ? `Time: ${context.timeOfDay}` : ''}

Generate a heartfelt affirmation (1-2 sentences) that:
1. Feels personal and specific to them
2. Acknowledges their inherent worth and capabilities
3. Is genuine and not overly saccharine
4. Builds their confidence authentically
5. Uses what you know about what they respond well to

Make it feel like it comes from someone who truly sees and values them.`;

    try {
      const response = await generateText(prompt);
      const message = response.trim();
      console.log('[Nexa] Generated affirmation:', message);
      return message;
    } catch (error) {
      console.error('[AIService] Error generating affirmation:', error);
      return this.getFallbackAffirmation(context);
    }
  }

  private getFallbackAffirmation(context: {
    achievement?: string;
    personalQuality?: string;
  }): string {
    if (context.achievement) {
      return `${context.achievement} - that took real effort and determination. You should be proud of yourself! 🌟`;
    }
    if (context.personalQuality) {
      return `Your ${context.personalQuality} is one of your greatest strengths. Never forget how valuable that makes you. ✨`;
    }
    
    const affirmations = [
      'You are capable of amazing things, even on the days when it doesn\'t feel like it. 💫',
      'Your effort matters more than perfection. You\'re doing great! 🌟',
      'You bring unique value to the world just by being you. That\'s something to celebrate! ✨',
      'Every challenge you face is making you stronger and more resilient. You\'ve got this! 💪',
      'You deserve kindness and patience - especially from yourself. 🌸',
    ];
    
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }
}

export const aiService = new AIService();
