describe('Subscription Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show trial status in settings', async () => {
    await element(by.text('Settings')).tap();
    
    await expect(element(by.text('Premium Trial Active'))).toBeVisible();
  });

  it('should show paywall when limit reached', async () => {
    for (let i = 0; i < 4; i++) {
      await element(by.id('add-task-button')).tap();
      await element(by.id('task-title-input')).typeText(`Task ${i + 1}`);
      await element(by.text('Create Task')).tap();
    }
    
    await expect(element(by.text('Upgrade to Premium'))).toBeVisible();
  });

  it('should display subscription plans', async () => {
    await element(by.text('Settings')).tap();
    await element(by.text('Manage Subscription')).tap();
    
    await expect(element(by.text('Premium Monthly'))).toBeVisible();
    await expect(element(by.text('Premium Lifetime'))).toBeVisible();
  });

  it('should show premium features', async () => {
    await element(by.text('Settings')).tap();
    await element(by.text('Manage Subscription')).tap();
    
    await expect(element(by.text('Unlimited Tasks'))).toBeVisible();
    await expect(element(by.text('Advanced AI Coach'))).toBeVisible();
    await expect(element(by.text('Caregiver Alerts'))).toBeVisible();
  });

  it('should restore purchases', async () => {
    await element(by.text('Settings')).tap();
    await element(by.text('Manage Subscription')).tap();
    await element(by.text('Restore Purchases')).tap();
    
    await expect(element(by.text('Checking purchases...'))).toBeVisible();
  });
});
