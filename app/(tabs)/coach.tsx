import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTasks } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Sparkles, Send, User, Bot, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useRorkAgent, createRorkTool } from '@rork/toolkit-sdk';
import { z } from 'zod';
import PremiumGate from '@/components/PremiumGate';

export default function CoachScreen() {
  const { settings } = useAccessibility();
  const { allTasks, addTask, updateTask, completeTask, breakdownTask } = useTasks();
  const { colors } = useTheme();
  const { profile, learnPreference, recordInteraction, recordHabit } = useUserProfile();
  const insets = useSafeAreaInsets();
  
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage } = useRorkAgent({
    tools: {
      createTask: createRorkTool({
        description: 'Create a new task for the user with AI-powered breakdown',
        zodSchema: z.object({
          title: z.string().describe('Clear, concise task title'),
          description: z.string().optional().describe('Optional detailed description'),
          priority: z.enum(['low', 'medium', 'high']).describe('Task priority level'),
        }),
        async execute(input) {
          const task = await addTask(input.title, input.description, input.priority);
          if (task) {
            await breakdownTask(task.id);
            recordInteraction('task_completed', 'positive', { taskId: task.id, source: 'nexa' });
            learnPreference('task', `creates_${input.priority}_priority_tasks`, 0.3);
          }
          return JSON.stringify({ success: true, taskId: task?.id });
        },
      }),
      
      listTasks: createRorkTool({
        description: 'Get a list of all user tasks with their current status',
        zodSchema: z.object({}),
        execute() {
          return JSON.stringify({
            tasks: allTasks.map(t => ({
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority,
              stepsCompleted: t.steps.filter(s => s.completed).length,
              totalSteps: t.steps.length,
            })),
          });
        },
      }),
      
      completeTask: createRorkTool({
        description: 'Mark a task as completed',
        zodSchema: z.object({
          taskId: z.string().describe('The ID of the task to complete'),
        }),
        execute(input) {
          completeTask(input.taskId);
          recordInteraction('task_completed', 'positive', { taskId: input.taskId });
          learnPreference('motivation', 'responds_to_completion_celebration', 1);
          return JSON.stringify({ success: true });
        },
      }),
      
      updateTaskPriority: createRorkTool({
        description: 'Update the priority of a task',
        zodSchema: z.object({
          taskId: z.string().describe('The ID of the task'),
          priority: z.enum(['low', 'medium', 'high']).describe('New priority level'),
        }),
        execute(input) {
          updateTask(input.taskId, { priority: input.priority });
          return JSON.stringify({ success: true });
        },
      }),
      
      provideEncouragement: createRorkTool({
        description: 'Provide personalized encouragement based on user progress',
        zodSchema: z.object({
          context: z.string().describe('Context about what the user is working on'),
        }),
        execute(input) {
          const completedTasks = allTasks.filter(t => t.status === 'completed').length;
          const totalTasks = allTasks.length;
          
          recordInteraction('encouragement_received', 'positive', { context: input.context });
          learnPreference('motivation', 'seeks_encouragement', 0.5);
          
          const hour = new Date().getHours();
          if (hour < 12) {
            recordHabit('seeks_morning_encouragement');
          } else if (hour >= 18) {
            recordHabit('seeks_evening_encouragement');
          }
          
          return JSON.stringify({
            completedTasks,
            totalTasks,
            message: `You're doing great! You've completed ${completedTasks} out of ${totalTasks} tasks.`,
            userProfile: profile ? {
              name: profile.name,
              communicationStyle: profile.communicationStyle,
              favoriteEncouragements: profile.favoriteEncouragements,
            } : undefined,
          });
        },
      }),
    },
  });

  useEffect(() => {
    if (messages.length === 0 && profile) {
      const greeting = profile.name ? `Hi ${profile.name}!` : 'Hi!';
      const personalTouch = profile.interactions.length > 10 
        ? "It's great to see you again! I've been learning what works best for you." 
        : "I'm excited to get to know you and learn how I can best support you.";
      
      const welcomeContent = `${greeting} I'm Nexa, your personal AI coach. ${personalTouch}\\n\\nI can help you:\\n• Create and organize tasks\\n• Break down complex tasks into simple steps\\n• Track your progress\\n• Provide personalized encouragement\\n• Learn your preferences and adapt to your style\\n\\nWhat would you like to work on today?`;
      
      sendMessage(welcomeContent);
    }
  }, [messages.length, profile, sendMessage]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    
    await sendMessage(userMessage);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const textSize = settings.largeText ? 1.2 : 1;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      gap: 16,
    },
    messageContainer: {
      flexDirection: 'row',
      gap: 10,
      maxWidth: '85%',
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse',
    },
    assistantMessageContainer: {
      alignSelf: 'flex-start',
    },
    avatarContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userAvatar: {
      backgroundColor: colors.primary,
    },
    assistantAvatar: {
      backgroundColor: colors.accent,
    },
    messageBubble: {
      borderRadius: 18,
      padding: 12,
      maxWidth: '100%',
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    assistantBubble: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 22,
    },
    userMessageText: {
      color: colors.surface,
    },
    assistantMessageText: {
      color: colors.text,
    },
    toolCallContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    toolCallText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontStyle: 'italic' as const,
    },
    toolSuccessContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.success + '15',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      marginTop: 4,
    },
    toolSuccessText: {
      fontSize: 13,
      color: colors.success,
      fontWeight: '600' as const,
    },
    toolErrorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.error + '15',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      marginTop: 4,
    },
    toolErrorText: {
      fontSize: 13,
      color: colors.error,
      fontWeight: '600' as const,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.error + '15',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      flex: 1,
    },
    quickActionsContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    quickActionsTitle: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 10,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    quickActionButton: {
      backgroundColor: colors.primaryLight + '20',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    quickActionText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 12,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      maxHeight: 100,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

  const renderMessage = (msg: any, index: number) => {
    const isUser = msg.role === 'user';
    
    return (
      <View
        key={msg.id || index}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        <View style={[styles.avatarContainer, isUser ? styles.userAvatar : styles.assistantAvatar]}>
          {isUser ? (
            <User size={18} color={colors.surface} />
          ) : (
            <Bot size={18} color={colors.surface} />
          )}
        </View>
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          {msg.parts?.map((part: any, i: number) => {
            switch (part.type) {
              case 'text':
                return (
                  <Text
                    key={`${msg.id}-${i}`}
                    style={[
                      styles.messageText,
                      { fontSize: 15 * textSize },
                      isUser ? styles.userMessageText : styles.assistantMessageText,
                    ]}
                  >
                    {part.text}
                  </Text>
                );
              
              case 'tool':
                const toolName = part.toolName;
                
                switch (part.state) {
                  case 'input-streaming':
                  case 'input-available':
                    return (
                      <View key={`${msg.id}-${i}`} style={styles.toolCallContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.toolCallText, { fontSize: 13 * textSize }]}>
                          {toolName === 'createTask' && 'Creating task...'}
                          {toolName === 'listTasks' && 'Fetching your tasks...'}
                          {toolName === 'completeTask' && 'Marking task complete...'}
                          {toolName === 'updateTaskPriority' && 'Updating priority...'}
                          {toolName === 'provideEncouragement' && 'Preparing encouragement...'}
                        </Text>
                      </View>
                    );
                  
                  case 'output-available':
                    return (
                      <View key={`${msg.id}-${i}`} style={styles.toolSuccessContainer}>
                        <CheckCircle2 size={16} color={colors.success} />
                        <Text style={[styles.toolSuccessText, { fontSize: 13 * textSize }]}>
                          {toolName === 'createTask' && 'Task created successfully!'}
                          {toolName === 'completeTask' && 'Task completed!'}
                          {toolName === 'updateTaskPriority' && 'Priority updated!'}
                          {toolName === 'listTasks' && `Found ${part.output?.tasks?.length || 0} tasks`}
                        </Text>
                      </View>
                    );
                  
                  case 'output-error':
                    return (
                      <View key={`${msg.id}-${i}`} style={styles.toolErrorContainer}>
                        <AlertCircle size={16} color={colors.error} />
                        <Text style={[styles.toolErrorText, { fontSize: 13 * textSize }]}>
                          Error: {part.errorText}
                        </Text>
                      </View>
                    );
                }
                break;
            }
            return null;
          })}
          
          {!msg.parts && msg.content && (
            <Text
              style={[
                styles.messageText,
                { fontSize: 15 * textSize },
                isUser ? styles.userMessageText : styles.assistantMessageText,
              ]}
            >
              {msg.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const quickActions = [
    { label: 'Show my tasks', message: 'Can you show me all my tasks?' },
    { label: 'Create a task', message: 'I need help creating a new task' },
    { label: 'How am I doing?', message: 'How am I doing with my tasks?' },
    { label: 'Need motivation', message: 'I need some encouragement' },
  ];

  return (
    <PremiumGate
      feature="Nexa"
      featureDescription="Get personalized cognitive support with AI-powered task management, intelligent breakdowns, and motivational guidance tailored to your needs."
    >
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Sparkles size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { fontSize: 24 * textSize }]}>Nexa</Text>
            <Text style={[styles.headerSubtitle, { fontSize: 14 * textSize }]}>
              Your AI cognitive support coach
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => renderMessage(msg, index))}
        
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={[styles.errorText, { fontSize: 14 * textSize }]}>
              {error.message || 'Something went wrong. Please try again.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {messages.length <= 1 && (
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.quickActionsTitle, { fontSize: 13 * textSize }]}>
            Quick actions:
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText(action.message);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickActionText, { fontSize: 13 * textSize }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={[styles.input, { fontSize: 15 * textSize }]}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.7}
        >
          <Send size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </PremiumGate>
  );
}

