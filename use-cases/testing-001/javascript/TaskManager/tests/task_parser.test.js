const {
parseTaskFromText,
getNextWeekday
} = require('../task_parser');

const { TaskPriority } = require('../models');

describe('Task Parser', () => {
describe('parseTaskFromText()', () => {
test('parses a basic title', () => {
const task = parseTaskFromText('Buy milk');

```
  expect(task.title).toBe('Buy milk');
  expect(task.priority).toBe(TaskPriority.MEDIUM);
  expect(task.dueDate).toBeNull();
  expect(task.tags).toEqual([]);
});

test('trims whitespace from the title', () => {
  const task = parseTaskFromText('   Buy milk   ');

  expect(task.title).toBe('Buy milk');
});

test.each([
  ['!1', TaskPriority.LOW],
  ['!2', TaskPriority.MEDIUM],
  ['!3', TaskPriority.HIGH],
  ['!4', TaskPriority.URGENT],
  ['!low', TaskPriority.LOW],
  ['!medium', TaskPriority.MEDIUM],
  ['!high', TaskPriority.HIGH],
  ['!urgent', TaskPriority.URGENT]
])('parses priority marker %s', (marker, expectedPriority) => {
  const task = parseTaskFromText(`Finish task ${marker}`);

  expect(task.priority).toBe(expectedPriority);
  expect(task.title).toBe('Finish task');
});

test('parses tags', () => {
  const task = parseTaskFromText(
    'Finish report @work @client'
  );

  expect(task.tags).toEqual(['work', 'client']);
  expect(task.title).toBe('Finish report');
});

test('parses today as the due date', () => {
  const task = parseTaskFromText('Submit report #today');

  const expected = new Date();
  expected.setHours(0, 0, 0, 0);

  expect(task.dueDate).toEqual(expected);
  expect(task.title).toBe('Submit report');
});

test('parses tomorrow as the due date', () => {
  const task = parseTaskFromText('Submit report #tomorrow');

  const expected = new Date();
  expected.setHours(0, 0, 0, 0);
  expected.setDate(expected.getDate() + 1);

  expect(task.dueDate).toEqual(expected);
});

test('parses next_week as the due date', () => {
  const task = parseTaskFromText('Prepare meeting #next_week');

  const expected = new Date();
  expected.setHours(0, 0, 0, 0);
  expected.setDate(expected.getDate() + 7);

  expect(task.dueDate).toEqual(expected);
});

test('parses a YYYY-MM-DD date', () => {
  const task = parseTaskFromText('Meeting #2026-09-15');

  expect(task.dueDate).toEqual(
    new Date(2026, 8, 15)
  );
});

test('removes priority, tags and date markers from the title', () => {
  const task = parseTaskFromText(
    'Finish report !3 @work #tomorrow'
  );

  expect(task.title).toBe('Finish report');
  expect(task.priority).toBe(TaskPriority.HIGH);
  expect(task.tags).toEqual(['work']);
  expect(task.dueDate).toBeInstanceOf(Date);
});

test('accepts abbreviated weekday names', () => {
  const task = parseTaskFromText('Attend meeting #mon');

  expect(task.dueDate).toBeInstanceOf(Date);
  expect(task.dueDate.getDay()).toBe(1);
});

test('leaves the due date null for an unrecognized date marker', () => {
  const task = parseTaskFromText('Complete task #notadate');

  expect(task.dueDate).toBeNull();
  expect(task.title).toBe('Complete task');
});
```

});

describe('getNextWeekday()', () => {
test('returns the next occurrence of a weekday', () => {
const monday = new Date(2026, 7, 24);

```
  const result = getNextWeekday(monday, 5);

  expect(result.getDay()).toBe(5);
});

test('moves to the following week when the target is today', () => {
  const monday = new Date(2026, 7, 24);

  const result = getNextWeekday(monday, 1);

  expect(result.getDay()).toBe(1);
  expect(result.getDate()).toBe(31);
});
```

});
});
