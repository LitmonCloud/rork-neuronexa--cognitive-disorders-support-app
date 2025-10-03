describe('AI Coach', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should break down task with AI', async () => {
    await element(by.id('add-task-button')).tap();
    await element(by.id('task-title-input')).typeText('Make dinner');
    await element(by.text('Create Task')).tap();
    
    await element(by.text('Make dinner')).tap();
    await element(by.text('Break Down with AI')).tap();
    
    await waitFor(element(by.text('Step 1'))).toBeVisible().withTimeout(10000);
  });

  it('should start AI coaching mode', async () => {
    await element(by.text('Make dinner')).tap();
    await element(by.text('Start Coaching')).tap();
    
    await expect(element(by.text('Let\'s do this together!'))).toBeVisible();
  });

  it('should complete steps in coaching mode', async () => {
    await element(by.text('Make dinner')).tap();
    await element(by.text('Start Coaching')).tap();
    
    await element(by.text('Complete Step')).tap();
    await expect(element(by.text('Great job!'))).toBeVisible();
    
    await element(by.text('Next Step')).tap();
    await expect(element(by.text('Step 2'))).toBeVisible();
  });

  it('should show progress in coaching mode', async () => {
    await element(by.text('Make dinner')).tap();
    await element(by.text('Start Coaching')).tap();
    
    await expect(element(by.id('progress-indicator'))).toBeVisible();
  });
});
