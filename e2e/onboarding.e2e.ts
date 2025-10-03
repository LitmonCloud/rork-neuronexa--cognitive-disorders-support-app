describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show onboarding on first launch', async () => {
    await expect(element(by.text('Welcome to NeuroNexa'))).toBeVisible();
  });

  it('should navigate through onboarding screens', async () => {
    await expect(element(by.text('Welcome to NeuroNexa'))).toBeVisible();
    
    await element(by.text('Next')).tap();
    await expect(element(by.text('Designed for Neurodiversity'))).toBeVisible();
    
    await element(by.text('Next')).tap();
    await expect(element(by.text('Start Your Journey'))).toBeVisible();
  });

  it('should complete onboarding and navigate to tasks', async () => {
    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.text('Get Started')).tap();
    
    await expect(element(by.text('My Tasks'))).toBeVisible();
  });

  it('should allow skipping onboarding', async () => {
    await element(by.text('Skip')).tap();
    
    await expect(element(by.text('My Tasks'))).toBeVisible();
  });

  it('should activate trial after onboarding', async () => {
    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.text('Get Started')).tap();
    
    await element(by.text('Settings')).tap();
    await expect(element(by.text('Premium Trial Active'))).toBeVisible();
  });
});
