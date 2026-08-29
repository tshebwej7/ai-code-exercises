const { Task, TaskPriority, TaskStatus } = require('../models');

describe('Task', () => {
describe('constructor', () => {
test('creates a task with the supplied values', () => {
const dueDate = new Date('2026-09-15T12:00:00Z');
const task = new Task(
'Build feature',
'Implement the feature',
TaskPriority.HIGH,
dueDate,
['critical']
);

```
  expect(task.title).toBe('Build feature');
  expect(task.description).toBe('Implement the feature');
  expect(task.priority).toBe(TaskPriority.HIGH);
  expect(task.status).toBe(TaskStatus.TODO);
  expect(task.dueDate).toBe(dueDate);
  expect(task.tags).toEqual(['critical']);
  expect(task.id).toEqual(expect.any(String));
  expect(task.createdAt).toEqual(expect.any(Date));
  expect(task.updatedAt).toEqual(task.createdAt);
  expect(task.completedAt).toBeNull();
});

test('uses the documented default values', () => {
  const task = new Task('Simple task');

  expect(task.description).toBe('');
  expect(task.priority).toBe(TaskPriority.MEDIUM);
  expect(task.status).toBe(TaskStatus.TODO);
  expect(task.dueDate).toBeNull();
  expect(task.tags).toEqual([]);
  expect(task.completedAt).toBeNull();
});

test('creates tasks with unique IDs', () => {
  const firstTask = new Task('First task');
  const secondTask = new Task('Second task');

  expect(firstTask.id).not.toBe(secondTask.id);
});
```

});

describe('update()', () => {
test('updates existing task properties', () => {
const task = new Task('Original title');

```
  task.update({
    title: 'Updated title',
    description: 'Updated description',
    priority: TaskPriority.HIGH
  });

  expect(task.title).toBe('Updated title');
  expect(task.description).toBe('Updated description');
  expect(task.priority).toBe(TaskPriority.HIGH);
});

test('does not add unknown properties', () => {
  const task = new Task('Original title');

  task.update({
    unknownProperty: 'should not be added'
  });

  expect(task.unknownProperty).toBeUndefined();
});

test('updates updatedAt when a task is updated', () => {
  const task = new Task('Original title');
  const originalUpdatedAt = task.updatedAt;

  task.update({ title: 'Updated title' });

  expect(task.updatedAt).toBeInstanceOf(Date);
  expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(
    originalUpdatedAt.getTime()
  );
});
```

});

describe('markAsDone()', () => {
test('changes the task status to DONE', () => {
const task = new Task('Complete task');

```
  task.markAsDone();

  expect(task.status).toBe(TaskStatus.DONE);
});

test('sets completedAt', () => {
  const task = new Task('Complete task');

  task.markAsDone();

  expect(task.completedAt).toBeInstanceOf(Date);
});

test('sets updatedAt to the completion time', () => {
  const task = new Task('Complete task');

  task.markAsDone();

  expect(task.updatedAt).toBe(task.completedAt);
});
```

});

describe('isOverdue()', () => {
test('returns false when there is no due date', () => {
const task = new Task('No deadline');

```
  expect(task.isOverdue()).toBe(false);
});

test('returns false when the due date is in the future', () => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const task = new Task('Future task', '', TaskPriority.MEDIUM, futureDate);

  expect(task.isOverdue()).toBe(false);
});

test('returns true for an unfinished task with a past due date', () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const task = new Task('Overdue task', '', TaskPriority.MEDIUM, pastDate);

  expect(task.isOverdue()).toBe(true);
});

test('returns false for a completed task with a past due date', () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const task = new Task('Completed task', '', TaskPriority.MEDIUM, pastDate);

  task.markAsDone();

  expect(task.isOverdue()).toBe(false);
});
```

});
});
