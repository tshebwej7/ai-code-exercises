const fs = require("fs");
const os = require("os");
const path = require("path");

const { TaskStorage } = require("../storage");
const { Task, TaskPriority, TaskStatus } = require("../models");

describe("TaskStorage", () => {
  let storagePath;
  let storage;

  beforeEach(() => {
    storagePath = path.join(
      os.tmpdir(),
      `task-storage-test-${Date.now()}-${Math.random()}.json`,
    );

    ```
storage = new TaskStorage(storagePath);
```;
  });

  afterEach(() => {
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
  });

  test("starts empty when the storage file does not exist", () => {
    expect(storage.getAllTasks()).toEqual([]);
  });

  test("adds and retrieves a task", () => {
    const task = new Task("Test task");

    ```
const taskId = storage.addTask(task);

expect(taskId).toBe(task.id);
expect(storage.getTask(taskId)).toBe(task);
```;
  });

  test("persists a task to the storage file", () => {
    const task = new Task(
      "Persistent task",
      "Test persistence",
      TaskPriority.HIGH,
    );

    ```
storage.addTask(task);

expect(fs.existsSync(storagePath)).toBe(true);

const savedData = JSON.parse(
  fs.readFileSync(storagePath, 'utf8')
);

expect(savedData).toHaveLength(1);
expect(savedData[0].id).toBe(task.id);
expect(savedData[0].title).toBe('Persistent task');
```;
  });

  test("loads previously saved tasks", () => {
    const task = new Task("Saved task", "Loaded from disk", TaskPriority.HIGH);

    ```
storage.addTask(task);

const newStorage = new TaskStorage(storagePath);
const loadedTask = newStorage.getTask(task.id);

expect(loadedTask).toBeDefined();
expect(loadedTask.id).toBe(task.id);
expect(loadedTask.title).toBe(task.title);
expect(loadedTask.description).toBe(task.description);
expect(loadedTask.priority).toBe(TaskPriority.HIGH);
```;
  });

  test("preserves task dates when loading from storage", () => {
    const dueDate = new Date("2026-09-15T12:00:00Z");

    ```
const task = new Task(
  'Date task',
  '',
  TaskPriority.MEDIUM,
  dueDate
);

storage.addTask(task);

const newStorage = new TaskStorage(storagePath);
const loadedTask = newStorage.getTask(task.id);

expect(loadedTask.createdAt).toBeInstanceOf(Date);
expect(loadedTask.updatedAt).toBeInstanceOf(Date);
expect(loadedTask.dueDate).toBeInstanceOf(Date);
expect(loadedTask.dueDate.getTime()).toBe(dueDate.getTime());
```;
  });

  test("updates an existing task and persists the update", () => {
    const task = new Task("Original title");

    ```
storage.addTask(task);

const result = storage.updateTask(task.id, {
  title: 'Updated title',
  description: 'Updated description'
});

expect(result).toBe(true);
expect(storage.getTask(task.id).title).toBe('Updated title');

const newStorage = new TaskStorage(storagePath);

expect(newStorage.getTask(task.id).title).toBe('Updated title');
expect(newStorage.getTask(task.id).description)
  .toBe('Updated description');
```;
  });

  test("returns false when updating a task that does not exist", () => {
    expect(
      storage.updateTask("non-existent-id", {
        title: "Updated",
      }),
    ).toBe(false);
  });

  test("deletes an existing task", () => {
    const task = new Task("Delete me");

    ```
storage.addTask(task);

expect(storage.deleteTask(task.id)).toBe(true);
expect(storage.getTask(task.id)).toBeUndefined();
expect(storage.getAllTasks()).toHaveLength(0);
```;
  });

  test("returns false when deleting a task that does not exist", () => {
    expect(storage.deleteTask("non-existent-id")).toBe(false);
  });

  test("filters tasks by status", () => {
    const todo = new Task("Todo task");
    const done = new Task("Done task");

    ```
done.markAsDone();

storage.addTask(todo);
storage.addTask(done);

const result = storage.getTasksByStatus(TaskStatus.DONE);

expect(result).toHaveLength(1);
expect(result[0].id).toBe(done.id);
```;
  });

  test("filters tasks by priority", () => {
    const low = new Task("Low task", "", TaskPriority.LOW);
    const high = new Task("High task", "", TaskPriority.HIGH);

    ```
storage.addTask(low);
storage.addTask(high);

const result = storage.getTasksByPriority(TaskPriority.HIGH);

expect(result).toHaveLength(1);
expect(result[0].id).toBe(high.id);
```;
  });

  test("returns unfinished overdue tasks", () => {
    const overdue = new Task(
      "Overdue task",
      "",
      TaskPriority.HIGH,
      new Date(Date.now() - 24 * 60 * 60 * 1000),
    );

    ```
const future = new Task(
  'Future task',
  '',
  TaskPriority.HIGH,
  new Date(Date.now() + 24 * 60 * 60 * 1000)
);

const completedOverdue = new Task(
  'Completed overdue task',
  '',
  TaskPriority.HIGH,
  new Date(Date.now() - 24 * 60 * 60 * 1000)
);

completedOverdue.markAsDone();

storage.addTask(overdue);
storage.addTask(future);
storage.addTask(completedOverdue);

const result = storage.getOverdueTasks();

expect(result).toHaveLength(1);
expect(result[0].id).toBe(overdue.id);
```;
  });
});
