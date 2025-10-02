import { generateText } from '@rork/toolkit-sdk';
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
}

export const aiService = new AIService();
