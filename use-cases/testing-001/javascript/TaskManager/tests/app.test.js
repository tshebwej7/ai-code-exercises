const fs = require("fs");
const os = require("os");
const path = require("path");

const { TaskManager } = require("../app");
const { TaskPriority, TaskStatus } = require("../models");

describe("TaskManager", () => {
  let storagePath;
  let manager;

  beforeEach(() => {
    storagePath = path.join(
      os.tmpdir(),
      `task-manager-test-${Date.now()}-${Math.random()}.json`,
    );

    ```
manager = new TaskManager(storagePath);
```;
  });

  afterEach(() => {
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
  });

  test("creates and retrieves a task", () => {
    const taskId = manager.createTask(
      "Build feature",
      "Implement feature",
      TaskPriority.HIGH,
    );

    ```
const task = manager.getTaskDetails(taskId);

expect(task).toBeDefined();
expect(task.title).toBe('Build feature');
expect(task.description).toBe('Implement feature');
expect(task.priority).toBe(TaskPriority.HIGH);
```;
  });

  test("creates a task with a due date", () => {
    const taskId = manager.createTask(
      "Deadline task",
      "",
      TaskPriority.MEDIUM,
      "2026-09-15",
    );

    ```
const task = manager.getTaskDetails(taskId);

expect(task.dueDate).toBeInstanceOf(Date);
expect(task.dueDate.toISOString().startsWith('2026-09-15'))
  .toBe(true);
```;
  });

  test("returns null for an invalid creation date", () => {
    const taskId = manager.createTask(
      "Invalid date task",
      "",
      TaskPriority.MEDIUM,
      "not-a-date",
    );

    ```
expect(taskId).toBeNull();
```;
  });

  test("marks a task as done", () => {
    const taskId = manager.createTask("Complete me");

    ```
const result = manager.updateTaskStatus(
  taskId,
  TaskStatus.DONE
);

expect(result).toBe(true);

const task = manager.getTaskDetails(taskId);

expect(task.status).toBe(TaskStatus.DONE);
expect(task.completedAt).toBeInstanceOf(Date);
```;
  });

  test("returns false when completing a nonexistent task", () => {
    expect(manager.updateTaskStatus("does-not-exist", TaskStatus.DONE)).toBe(
      false,
    );
  });

  test("updates a task priority", () => {
    const taskId = manager.createTask("Priority task");

    ```
const result = manager.updateTaskPriority(
  taskId,
  TaskPriority.HIGH
);

expect(result).toBe(true);
expect(manager.getTaskDetails(taskId).priority)
  .toBe(TaskPriority.HIGH);
```;
  });

  test("updates a task due date", () => {
    const taskId = manager.createTask("Due date task");

    ```
const result = manager.updateTaskDueDate(
  taskId,
  '2026-10-01'
);

expect(result).toBe(true);
expect(manager.getTaskDetails(taskId).dueDate)
  .toBeInstanceOf(Date);
```;
  });

  test("returns false for an invalid due date", () => {
    const taskId = manager.createTask("Due date task");

    ```
expect(
  manager.updateTaskDueDate(taskId, 'invalid-date')
).toBe(false);
```;
  });

  test("adds a tag without duplicating it", () => {
    const taskId = manager.createTask("Tagged task");

    ```
expect(manager.addTagToTask(taskId, 'work')).toBe(true);
expect(manager.addTagToTask(taskId, 'work')).toBe(true);

expect(manager.getTaskDetails(taskId).tags)
  .toEqual(['work']);
```;
  });

  test("removes a tag", () => {
    const taskId = manager.createTask("Tagged task");

    ```
manager.addTagToTask(taskId, 'work');

expect(
  manager.removeTagFromTask(taskId, 'work')
).toBe(true);

expect(manager.getTaskDetails(taskId).tags)
  .toEqual([]);
```;
  });

  test("deletes a task", () => {
    const taskId = manager.createTask("Delete task");

    ```
expect(manager.deleteTask(taskId)).toBe(true);
expect(manager.getTaskDetails(taskId)).toBeUndefined();
```;
  });

  test("filters tasks by status", () => {
    const todoId = manager.createTask("Todo");
    const doneId = manager.createTask("Done");

    ```
manager.updateTaskStatus(doneId, TaskStatus.DONE);

const doneTasks = manager.listTasks(TaskStatus.DONE);

expect(doneTasks).toHaveLength(1);
expect(doneTasks[0].id).toBe(doneId);
expect(doneTasks[0].id).not.toBe(todoId);
```;
  });

  test("filters tasks by priority", () => {
    manager.createTask("Low", "", TaskPriority.LOW);
    const highId = manager.createTask("High", "", TaskPriority.HIGH);

    ```
const highTasks = manager.listTasks(
  null,
  String(TaskPriority.HIGH)
);

expect(highTasks).toHaveLength(1);
expect(highTasks[0].id).toBe(highId);
```;
  });

  test("returns correct statistics", () => {
    const todoId = manager.createTask("Todo", "", TaskPriority.MEDIUM);

    ```
const doneId = manager.createTask(
  'Done',
  '',
  TaskPriority.HIGH
);

manager.updateTaskStatus(doneId, TaskStatus.DONE);

const stats = manager.getStatistics();

expect(stats.total).toBe(2);
expect(stats.byStatus[TaskStatus.TODO]).toBe(1);
expect(stats.byStatus[TaskStatus.DONE]).toBe(1);
expect(stats.byPriority[TaskPriority.MEDIUM]).toBe(1);
expect(stats.byPriority[TaskPriority.HIGH]).toBe(1);
expect(stats.overdue).toBe(0);
expect(stats.completedLastWeek).toBe(1);

expect(manager.getTaskDetails(todoId)).toBeDefined();
```;
  });
});
