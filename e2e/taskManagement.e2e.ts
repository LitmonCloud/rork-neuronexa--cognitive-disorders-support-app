describe('Task Management', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a new task', async () => {
    await element(by.id('add-task-button')).tap();
    
    await element(by.id('task-title-input')).typeText('Buy groceries');
    await element(by.id('task-description-input')).typeText('Get milk and bread');
    
    await element(by.text('Create Task')).tap();
    
    await expect(element(by.text('Buy groceries'))).toBeVisible();
  });

  it('should view task details', async () => {
    await element(by.text('Buy groceries')).tap();
    
    await expect(element(by.text('Get milk and bread'))).toBeVisible();
  });

  it('should edit a task', async () => {
    await element(by.text('Buy groceries')).swipe('left');
    await element(by.text('Edit')).tap();
    
    await element(by.id('task-title-input')).clearText();
    await element(by.id('task-title-input')).typeText('Buy groceries and snacks');
    
    await element(by.text('Save')).tap();
    
    await expect(element(by.text('Buy groceries and snacks'))).toBeVisible();
  });

  it('should delete a task', async () => {
    await element(by.text('Buy groceries and snacks')).swipe('left');
    await element(by.text('Delete')).tap();
    await element(by.text('Confirm')).tap();
    
    await expect(element(by.text('Buy groceries and snacks'))).not.toBeVisible();
  });

  it('should complete a task', async () => {
    await element(by.id('add-task-button')).tap();
    await element(by.id('task-title-input')).typeText('Test task');
    await element(by.text('Create Task')).tap();
    
    await element(by.text('Test task')).tap();
    await element(by.text('Mark Complete')).tap();
    
    await expect(element(by.text('Task Completed!'))).toBeVisible();
  });
});
