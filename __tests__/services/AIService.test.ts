import { aiService } from '@/services/ai/AIService';
import { generateText } from '@rork/toolkit-sdk';
import { UserProfile } from '@/types/userProfile';

jest.mock('@rork/toolkit-sdk');

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTaskBreakdown', () => {
    it('should generate task breakdown with simple cognitive level', async () => {
      const mockResponse = `STEP: Gather materials
SIMPLE: Get your things
CONTEXT: Having everything ready helps
TIME: 5
---
STEP: Start the task
SIMPLE: Begin working
CONTEXT: Starting is the hardest part
TIME: 10
---
SUPPORT: You can do this!
ADAPT: Take breaks when needed
ADAPT: Ask for help if stuck`;

      (generateText as jest.Mock).mockResolvedValue(mockResponse);

      const result = await aiService.generateTaskBreakdown({
        title: 'Clean the kitchen',
        cognitiveLevel: 'simple',
      });

      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].description).toBe('Gather materials');
      expect(result.steps[0].simplifiedText).toBe('Get your things');
      expect(result.steps[0].estimatedTime).toBe(5);
      expect(result.supportiveMessage).toBe('You can do this!');
      expect(result.adaptations).toHaveLength(2);
    });

    it('should handle user profile context', async () => {
      const userProfile: UserProfile = {
        name: 'Alex',
        communicationStyle: 'encouraging',
        preferences: [
          { preference: 'Likes visual cues', category: 'learning', strength: 8, lastUpdated: new Date().toISOString() },
        ],
        habits: [],
        favoriteEncouragements: ['You got this!'],
        avoidTopics: ['time pressure'],
        motivationTriggers: ['progress tracking'],
        interactionHistory: [],
      };

      (generateText as jest.Mock).mockResolvedValue('STEP: Test\nSIMPLE: Test\nCONTEXT: Test\n---\nSUPPORT: Great job!');

      await aiService.generateTaskBreakdown({
        title: 'Test task',
        cognitiveLevel: 'moderate',
        userContext: { userProfile },
      });

      const callArgs = (generateText as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('Alex');
      expect(callArgs).toContain('encouraging');
      expect(callArgs).toContain('Likes visual cues');
    });

    it('should return fallback breakdown on error', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateTaskBreakdown({
        title: 'Test task',
        cognitiveLevel: 'simple',
      });

      expect(result.steps).toHaveLength(4);
      expect(result.steps[0].description).toContain('gathering');
      expect(result.supportiveMessage).toContain('Progress over perfection');
    });

    it('should handle malformed AI response', async () => {
      (generateText as jest.Mock).mockResolvedValue('Invalid response format');

      const result = await aiService.generateTaskBreakdown({
        title: 'Test task',
        cognitiveLevel: 'simple',
      });

      expect(result.steps).toHaveLength(4);
      expect(result.supportiveMessage).toBeTruthy();
    });
  });

  describe('generateSupportiveMessage', () => {
    it('should generate personalized supportive message', async () => {
      const mockMessage = 'You are doing great! Keep going!';
      (generateText as jest.Mock).mockResolvedValue(mockMessage);

      const result = await aiService.generateSupportiveMessage({
        taskTitle: 'Clean room',
        completedSteps: 2,
        totalSteps: 5,
      });

      expect(result).toBe(mockMessage);
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('Clean room'));
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('2/5'));
    });

    it('should return fallback message on error', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateSupportiveMessage({
        taskTitle: 'Test task',
        completedSteps: 0,
        totalSteps: 5,
      });

      expect(result).toContain('Starting is the hardest part');
    });

    it('should provide different messages based on progress', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('Force fallback'));

      const startMessage = await aiService.generateSupportiveMessage({
        taskTitle: 'Test',
        completedSteps: 0,
        totalSteps: 5,
      });

      const midMessage = await aiService.generateSupportiveMessage({
        taskTitle: 'Test',
        completedSteps: 2,
        totalSteps: 5,
      });

      const endMessage = await aiService.generateSupportiveMessage({
        taskTitle: 'Test',
        completedSteps: 5,
        totalSteps: 5,
      });

      expect(startMessage).not.toBe(midMessage);
      expect(midMessage).not.toBe(endMessage);
      expect(endMessage).toContain('did it');
    });
  });

  describe('generateCheckIn', () => {
    it('should generate personalized check-in', async () => {
      const mockCheckIn = 'Good morning! How are you today?';
      (generateText as jest.Mock).mockResolvedValue(mockCheckIn);

      const result = await aiService.generateCheckIn({
        timeOfDay: 'morning',
      });

      expect(result).toBe(mockCheckIn);
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('Good morning'));
    });

    it('should include recent activity in check-in', async () => {
      (generateText as jest.Mock).mockResolvedValue('Great job on completing tasks!');

      await aiService.generateCheckIn({
        recentActivity: {
          tasksCompleted: 3,
          tasksAbandoned: 1,
        },
      });

      const callArgs = (generateText as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('Completed: 3');
      expect(callArgs).toContain('Abandoned: 1');
    });

    it('should return fallback check-in on error', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateCheckIn({
        timeOfDay: 'afternoon',
      });

      expect(result).toContain('How are you doing today');
    });
  });

  describe('generateMotivation', () => {
    it('should generate motivational message', async () => {
      const mockMotivation = 'You are stronger than you think!';
      (generateText as jest.Mock).mockResolvedValue(mockMotivation);

      const result = await aiService.generateMotivation({
        currentTask: 'Finish homework',
        strugglingWith: 'Getting started',
      });

      expect(result).toBe(mockMotivation);
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('Finish homework'));
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('Getting started'));
    });

    it('should acknowledge setbacks in motivation', async () => {
      (generateText as jest.Mock).mockResolvedValue('Keep going!');

      await aiService.generateMotivation({
        recentSetbacks: 3,
      });

      const callArgs = (generateText as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('3 recent setbacks');
    });

    it('should return fallback motivation on error', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateMotivation({
        strugglingWith: 'Focus',
      });

      expect(result).toContain('challenging');
      expect(result).toContain('expert was once a beginner');
    });
  });

  describe('generateAffirmation', () => {
    it('should generate personalized affirmation', async () => {
      const mockAffirmation = 'You are capable and strong!';
      (generateText as jest.Mock).mockResolvedValue(mockAffirmation);

      const result = await aiService.generateAffirmation({
        achievement: 'Completed 5 tasks today',
      });

      expect(result).toBe(mockAffirmation);
      expect(generateText).toHaveBeenCalledWith(expect.stringContaining('Completed 5 tasks today'));
    });

    it('should affirm personal qualities', async () => {
      (generateText as jest.Mock).mockResolvedValue('Your determination is inspiring!');

      await aiService.generateAffirmation({
        personalQuality: 'determination',
      });

      const callArgs = (generateText as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('determination');
    });

    it('should return fallback affirmation on error', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateAffirmation({
        achievement: 'Finished project',
      });

      expect(result).toContain('Finished project');
      expect(result).toContain('effort and determination');
    });

    it('should provide random affirmation when no context', async () => {
      (generateText as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await aiService.generateAffirmation({});

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
