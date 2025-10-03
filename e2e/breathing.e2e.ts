describe('Breathing Exercises', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to wellness tab', async () => {
    await element(by.text('Wellness')).tap();
    
    await expect(element(by.text('Breathing Exercises'))).toBeVisible();
  });

  it('should show breathing exercise options', async () => {
    await element(by.text('Wellness')).tap();
    
    await expect(element(by.text('Box Breathing'))).toBeVisible();
    await expect(element(by.text('4-7-8 Breathing'))).toBeVisible();
    await expect(element(by.text('Finger Trace'))).toBeVisible();
  });

  it('should start box breathing exercise', async () => {
    await element(by.text('Wellness')).tap();
    await element(by.text('Box Breathing')).tap();
    
    await expect(element(by.text('Breathe In'))).toBeVisible();
  });

  it('should complete breathing exercise', async () => {
    await element(by.text('Wellness')).tap();
    await element(by.text('Box Breathing')).tap();
    
    await waitFor(element(by.text('Exercise Complete'))).toBeVisible().withTimeout(60000);
  });

  it('should reset breathing exercise', async () => {
    await element(by.text('Wellness')).tap();
    await element(by.text('Box Breathing')).tap();
    
    await element(by.text('Reset')).tap();
    
    await expect(element(by.text('Breathe In'))).toBeVisible();
  });
});
