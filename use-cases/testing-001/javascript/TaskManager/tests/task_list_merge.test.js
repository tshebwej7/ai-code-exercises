const {
mergeTaskLists,
resolveTaskConflict,
arraysEqual
} = require('../task_list_merge');

const { Task, TaskPriority, TaskStatus } = require('../models');

describe('Task List Merge', () => {
function createTask(title, updatedAt = new Date()) {
const task = new Task(title, '', TaskPriority.MEDIUM);
task.updatedAt = updatedAt;
return task;
}

describe('arraysEqual()', () => {
test('returns true for equal arrays', () => {
expect(arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
});

```
test('returns true when arrays contain the same values in different order', () => {
  expect(arraysEqual(['a', 'b'], ['b', 'a'])).toBe(true);
});

test('returns false when arrays have different lengths', () => {
  expect(arraysEqual(['a'], ['a', 'b'])).toBe(false);
});

test('returns false when arrays contain different values', () => {
  expect(arraysEqual(['a', 'b'], ['a', 'c'])).toBe(false);
});
```

});

describe('mergeTaskLists()', () => {
test('adds local-only tasks to the remote creation list', () => {
const localTask = createTask('Local task');

```
  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    {}
  );

  expect(result.mergedTasks[localTask.id]).toBe(localTask);
  expect(result.toCreateRemote[localTask.id]).toBe(localTask);
  expect(result.toCreateLocal).toEqual({});
});

test('adds remote-only tasks to the local creation list', () => {
  const remoteTask = createTask('Remote task');

  const result = mergeTaskLists(
    {},
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[remoteTask.id]).toBe(remoteTask);
  expect(result.toCreateLocal[remoteTask.id]).toBe(remoteTask);
  expect(result.toCreateRemote).toEqual({});
});

test('keeps the newer remote task when resolving a conflict', () => {
  const localTask = createTask(
    'Local version',
    new Date('2026-01-01')
  );

  const remoteTask = createTask(
    'Remote version',
    new Date('2026-01-02')
  );

  remoteTask.id = localTask.id;

  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[localTask.id].title)
    .toBe('Remote version');

  expect(result.toUpdateLocal[localTask.id])
    .toBeDefined();
});

test('keeps the newer local task when local is newer', () => {
  const localTask = createTask(
    'Local version',
    new Date('2026-01-02')
  );

  const remoteTask = createTask(
    'Remote version',
    new Date('2026-01-01')
  );

  remoteTask.id = localTask.id;

  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[localTask.id].title)
    .toBe('Local version');

  expect(result.toUpdateRemote[localTask.id])
    .toBeDefined();
});

test('completed status wins over an incomplete remote task', () => {
  const localTask = createTask(
    'Local task',
    new Date('2026-01-02')
  );

  const remoteTask = createTask(
    'Remote task',
    new Date('2026-01-01')
  );

  localTask.id = remoteTask.id;
  localTask.markAsDone();

  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[localTask.id].status)
    .toBe(TaskStatus.DONE);
});

test('merges tags from both versions', () => {
  const localTask = createTask('Task');
  const remoteTask = createTask('Task');

  localTask.id = remoteTask.id;
  localTask.tags = ['work'];
  remoteTask.tags = ['urgent'];

  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[localTask.id].tags)
    .toEqual(expect.arrayContaining(['work', 'urgent']));

  expect(result.mergedTasks[localTask.id].tags)
    .toHaveLength(2);
});

test('does not duplicate identical tags', () => {
  const localTask = createTask('Task');
  const remoteTask = createTask('Task');

  localTask.id = remoteTask.id;
  localTask.tags = ['work', 'urgent'];
  remoteTask.tags = ['urgent', 'work'];

  const result = mergeTaskLists(
    { [localTask.id]: localTask },
    { [remoteTask.id]: remoteTask }
  );

  expect(result.mergedTasks[localTask.id].tags)
    .toEqual(expect.arrayContaining(['work', 'urgent']));

  expect(result.mergedTasks[localTask.id].tags)
    .toHaveLength(2);
});
```

});

describe('resolveTaskConflict()', () => {
test('returns the merged task and update flags', () => {
const localTask = createTask(
'Local',
new Date('2026-01-01')
);

```
  const remoteTask = createTask(
    'Remote',
    new Date('2026-01-02')
  );

  const [
    mergedTask,
    shouldUpdateLocal,
    shouldUpdateRemote
  ] = resolveTaskConflict(localTask, remoteTask);

  expect(mergedTask).toBeDefined();
  expect(shouldUpdateLocal).toBe(true);
  expect(shouldUpdateRemote).toBe(false);
});
```

});
});
