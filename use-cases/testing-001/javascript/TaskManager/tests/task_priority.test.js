const {
calculateTaskScore,
sortTasksByImportance,
getTopPriorityTasks
} = require('../task_priority');

const { Task, TaskPriority, TaskStatus } = require('../models');

describe('Task Priority', () => {
describe('calculateTaskScore()', () => {
test('gives higher-priority tasks a higher base score', () => {
const low = new Task('Low', '', TaskPriority.LOW);
const medium = new Task('Medium', '', TaskPriority.MEDIUM);
const high = new Task('High', '', TaskPriority.HIGH);
const urgent = new Task('Urgent', '', TaskPriority.URGENT);

```
  expect(calculateTaskScore(low)).toBeLessThan(calculateTaskScore(medium));
  expect(calculateTaskScore(medium)).toBeLessThan(calculateTaskScore(high));
  expect(calculateTaskScore(high)).toBeLessThan(calculateTaskScore(urgent));
});

test('adds a score boost for an overdue task', () => {
  const overdue = new Task(
    'Overdue',
    '',
    TaskPriority.MEDIUM,
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  const noDueDate = new Task(
    'No due date',
    '',
    TaskPriority.MEDIUM
  );

  expect(calculateTaskScore(overdue))
    .toBeGreaterThan(calculateTaskScore(noDueDate));
});

test('reduces the score of completed tasks', () => {
  const todo = new Task('Todo', '', TaskPriority.HIGH);
  const done = new Task('Done', '', TaskPriority.HIGH);

  done.markAsDone();

  expect(calculateTaskScore(done))
    .toBeLessThan(calculateTaskScore(todo));
});

test('reduces the score of tasks in review', () => {
  const todo = new Task('Todo', '', TaskPriority.HIGH);
  const review = new Task('Review', '', TaskPriority.HIGH);

  review.status = TaskStatus.REVIEW;

  expect(calculateTaskScore(review))
    .toBeLessThan(calculateTaskScore(todo));
});

test('boosts tasks containing a priority tag', () => {
  const normal = new Task('Normal', '', TaskPriority.MEDIUM);
  const critical = new Task(
    'Critical',
    '',
    TaskPriority.MEDIUM,
    null,
    ['critical']
  );

  expect(calculateTaskScore(critical))
    .toBeGreaterThan(calculateTaskScore(normal));
});

test('boosts recently updated tasks', () => {
  const recent = new Task('Recent', '', TaskPriority.MEDIUM);
  const old = new Task('Old', '', TaskPriority.MEDIUM);

  old.updatedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  expect(calculateTaskScore(recent))
    .toBeGreaterThan(calculateTaskScore(old));
});
```

});

describe('sortTasksByImportance()', () => {
test('sorts tasks from highest score to lowest score', () => {
const low = new Task('Low', '', TaskPriority.LOW);
const urgent = new Task('Urgent', '', TaskPriority.URGENT);
const high = new Task('High', '', TaskPriority.HIGH);

```
  const sorted = sortTasksByImportance([low, urgent, high]);

  expect(sorted).toEqual([urgent, high, low]);
});

test('does not modify the original array', () => {
  const first = new Task('First', '', TaskPriority.LOW);
  const second = new Task('Second', '', TaskPriority.URGENT);
  const original = [first, second];

  const sorted = sortTasksByImportance(original);

  expect(original).toEqual([first, second]);
  expect(sorted).not.toBe(original);
});
```

});

describe('getTopPriorityTasks()', () => {
test('returns the requested number of highest-priority tasks', () => {
const low = new Task('Low', '', TaskPriority.LOW);
const high = new Task('High', '', TaskPriority.HIGH);
const urgent = new Task('Urgent', '', TaskPriority.URGENT);

```
  const result = getTopPriorityTasks([low, high, urgent], 2);

  expect(result).toEqual([urgent, high]);
});

test('defaults to returning five tasks', () => {
  const tasks = Array.from(
    { length: 7 },
    (_, index) =>
      new Task(`Task ${index}`, '', TaskPriority.MEDIUM)
  );

  expect(getTopPriorityTasks(tasks)).toHaveLength(5);
});

test('returns all tasks when the limit exceeds the task count', () => {
  const tasks = [
    new Task('First'),
    new Task('Second'),
    new Task('Third')
  ];

  expect(getTopPriorityTasks(tasks, 10)).toHaveLength(3);
});
```

});
});
