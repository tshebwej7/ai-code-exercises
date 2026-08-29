# Code Understanding Journal

## Exercise 1: Codebase Exploration Challenge

### Part 1 — Understanding a Specific Feature

**Feature explored:** Task creation and status updates
**Language:** JavaScript / Node.js

---

## 1. Main Components Involved

### `cli.js`

`cli.js` is the command-line entry point of the application.

It receives commands from the user. For this exercise, the two relevant commands are:

- `create`
- `status`

The `create` command collects task information and passes it to `TaskManager.createTask()`.

The `status` command passes a task ID and the requested status to `TaskManager.updateTaskStatus()`.

Therefore, `cli.js` is responsible for handling user interaction at the command-line level rather than directly managing task state or persistence.

---

### `app.js`

`app.js` contains the `TaskManager` class.

It acts as the application-level coordinator between the CLI, task model, and storage layer.

The two relevant methods are:

- `createTask()`
- `updateTaskStatus()`

`createTask()` creates a new `Task` and sends it to `TaskStorage`.

`updateTaskStatus()` determines how the requested status change should be handled.

---

### `models.js`

`models.js` defines:

- `Task`
- `TaskStatus`
- `TaskPriority`

The `Task` object represents the state of an individual task.

A newly created task receives a UUID and starts with the status `TODO`.

The model provides two relevant state-changing methods:

- `update()`
- `markAsDone()`

`update()` changes existing task properties and updates `updatedAt`.

`markAsDone()` specifically handles completion by setting:

- `status` to `DONE`;
- `completedAt` to the current time;
- `updatedAt` to the completion time.

---

### `storage.js`

`storage.js` contains the `TaskStorage` class.

It maintains tasks in memory using an object keyed by task ID.

It is also responsible for persistence to the JSON storage file.

Relevant methods include:

- `load()`
- `save()`
- `addTask()`
- `getTask()`
- `updateTask()`

Therefore, the storage layer is responsible for moving task data between the application's in-memory representation and persistent JSON storage.

---

# 2. Execution Flow — Creating a Task

The task-creation flow is:

```text
User
  ↓
cli.js
  ↓
create command
  ↓
TaskManager.createTask()
  ↓
new Task(...)
  ↓
TaskStorage.addTask()
  ↓
TaskStorage.save()
  ↓
JSON storage file
```

### Detailed flow

1. The user executes the `create` command.
2. `cli.js` receives the task information.
3. The CLI passes the information to `TaskManager.createTask()`.
4. `createTask()` validates the optional due date.
5. A new `Task` object is constructed.
6. The `Task` constructor generates a UUID.
7. The task's supplied properties are assigned.
8. The initial status is set to `TODO`.
9. Creation and update timestamps are initialized.
10. `TaskManager` passes the new task to `TaskStorage.addTask()`.
11. `TaskStorage` places the task into its in-memory `tasks` collection.
12. `addTask()` calls `save()`.
13. `save()` converts the tasks to JSON and writes them to the storage file.
14. The task ID is returned to the application and reported by the CLI.

The important separation is that the CLI does not directly write the task to the JSON file. The operation passes through the application and storage layers.

---

# 3. Execution Flow — Updating Task Status

The status-update flow begins with:

```text
User
  ↓
cli.js
  ↓
TaskManager.updateTaskStatus()
```

At this point, the implementation has two different paths.

## When the new status is `DONE`

```text
TaskManager.updateTaskStatus()
          ↓
       getTask()
          ↓
    Task.markAsDone()
          ↓
        save()
          ↓
     JSON storage
```

`markAsDone()` performs more than simply changing the status.

It sets:

```text
status      → DONE
completedAt → current time
updatedAt   → completion time
```

The storage is then saved.

---

## When the new status is not `DONE`

```text
TaskManager.updateTaskStatus()
          ↓
   storage.updateTask()
          ↓
      task.update()
          ↓
         save()
          ↓
    JSON storage
```

The generic `update()` method changes the supplied task properties and refreshes `updatedAt`.

Therefore, the application deliberately treats completion differently from the other status changes.

---

# 4. How the Components Interact

The overall relationship can be represented as:

```text
                 CLI
               cli.js
                  │
                  ▼
           TaskManager
             app.js
                  │
          ┌───────┴────────┐
          ▼                ▼
       Task Model       TaskStorage
       models.js        storage.js
          │                │
          │                ▼
          │           JSON file
          │
          └── represents
              task state
```

The responsibilities are separated:

- `cli.js` handles command-line interaction.
- `app.js` coordinates application operations.
- `models.js` represents task data and task state transitions.
- `storage.js` handles persistence.

This separation means that each part has a relatively distinct responsibility.

---

# 5. Data Storage and Retrieval

The application maintains tasks in memory inside `TaskStorage.tasks`.

The collection is keyed by task ID.

When the application starts, `load()` checks whether the storage file exists.

If it exists:

1. The file is read.
2. Its JSON is parsed.
3. Each saved task is used to reconstruct a `Task`.
4. Saved properties are restored.
5. The task is placed into the in-memory collection.

When data needs to be persisted, `save()`:

1. Gets the task objects from the in-memory collection.
2. Converts them into an array.
3. Serializes the array to JSON.
4. Writes the JSON to the storage file.

Therefore:

```text
JSON file
   ↓ load()
In-memory TaskStorage
   ↓ modifications
In-memory TaskStorage
   ↓ save()
JSON file
```

---

# 6. External Dependencies

The relevant external dependency is `uuid`.

`models.js` uses it to generate unique task IDs.

The application also uses Node.js built-in modules:

- `fs` for file-system operations;
- `path` for path-related operations.

The CLI uses the `commander` package for command-line argument and command handling.

These dependencies support the application but do not replace the application's own task-management logic.

---

# 7. Interesting Design Approach

One interesting approach is the separation between the task model and persistence layer.

`Task` is responsible for representing and changing the state of an individual task.

`TaskStorage` is responsible for storing and retrieving those task objects.

Another notable design decision is that completing a task is treated as a distinct state transition rather than just another generic update.

This allows completion to trigger additional state changes:

```text
status
completedAt
updatedAt
```

---

# 8. Important Things That Could Be Misunderstood

### `DONE` is not just another status assignment

A developer might initially assume that all statuses are changed through the same generic update mechanism.

The code does not do this.

`DONE` uses `markAsDone()`, which also records completion information.

### `TaskStorage` has both memory and persistence responsibilities

The tasks are not read from the JSON file every time a task is requested.

The JSON data is loaded into memory, and subsequent operations work with the in-memory collection.

Persistence occurs when `save()` is called.

### Creating a `Task` and saving a `Task` are separate responsibilities

The `Task` constructor creates the object and initializes its state.

`TaskStorage` is responsible for persisting it.

### `TaskManager` is the coordinator

The CLI does not need to know how a task is stored internally.

Likewise, the storage layer does not handle command-line interaction.

---

# 9. Mental Model

A useful mental model is:

> **The CLI receives the user's request, TaskManager coordinates the operation, Task represents the task's state, and TaskStorage persists the state.**

For creation:

```text
Request
  ↓
CLI
  ↓
TaskManager
  ↓
Task
  ↓
Storage
  ↓
JSON
```

For completion:

```text
Request
  ↓
CLI
  ↓
TaskManager
  ↓
Task.markAsDone()
  ↓
Storage.save()
  ↓
JSON
```

---

# 10. Validation Requirements

The following are requirements for small changes that could be used to test whether I genuinely understand the code. They are intentionally expressed as requirements rather than implementations.

### Validation 1 — Task creation

Modify the task-creation behavior so that a newly created task receives an additional piece of task information while preserving the existing creation flow and persistence mechanism.

**What this tests:** understanding of the path from CLI input through `TaskManager`, `Task`, and `TaskStorage`.

### Validation 2 — Task completion

Modify the completion behavior so that an additional observable state change occurs specifically when a task becomes `DONE`, while preserving the existing completion mechanism.

**What this tests:** understanding of why `DONE` uses `markAsDone()` rather than the generic update path.

### Validation 3 — Persistence

Modify the persistence behavior so that a specific task property is preserved correctly when the application is restarted and the JSON storage is loaded again.

**What this tests:** understanding of the relationship between the in-memory `TaskStorage`, `save()`, `load()`, and the JSON representation.

---

## Reflection

The most important discovery in this part of the exercise was that task creation and status updates are not handled by one component. The application uses several layers with different responsibilities.

The most notable distinction was the special handling of `DONE`. Completing a task changes more than its status because the application also records when completion occurred.

The AI-assisted exploration is useful here because it provides another perspective that can be compared against my own reading of the code. The important part is not accepting the explanation automatically, but checking each claim against the source code.

# Part 2 — Deepen Understanding Through Guided Questions

## Feature Explored

**Task prioritization**

## Initial Understanding

My initial understanding was that the application has four priority levels:

- `LOW = 1`
- `MEDIUM = 2`
- `HIGH = 3`
- `URGENT = 4`

I understood that a new task normally receives `MEDIUM` priority and that priority can be supplied during task creation.

I also identified a separate CLI command for changing the priority of an existing task.

The initial flow I identified was:

```text
CLI
 ↓
TaskManager.updateTaskPriority()
 ↓
TaskStorage.updateTask()
 ↓
Task.update()
 ↓
TaskStorage.save()
 ↓
JSON storage
```

## Guided Questions and Discoveries

### Where are priority values defined?

The priority values are defined in the `TaskPriority` object in `models.js`.

The application represents the four priorities numerically:

```text
LOW = 1
MEDIUM = 2
HIGH = 3
URGENT = 4
```

This provides a consistent representation of priority throughout the application.

### What happens when a task is created?

The CLI accepts a priority when the user creates a task.

If the user does not provide one, the application uses `MEDIUM` as the default priority.

The supplied priority is passed into `TaskManager.createTask()`, which constructs a `Task` with that priority.

The resulting task is then passed to `TaskStorage.addTask()` and persisted.

### How is priority changed later?

The CLI provides a dedicated `priority` command.

The command sends the task ID and new priority to:

```text
TaskManager.updateTaskPriority()
```

The method converts the supplied value using `parseInt()` and passes the resulting value to:

```text
TaskStorage.updateTask()
```

The storage layer retrieves the task and calls:

```text
task.update()
```

The updated task is then persisted.

### Does defining four priority values guarantee validation?

No.

This was an important distinction discovered during exploration.

The existence of:

```text
LOW = 1
MEDIUM = 2
HIGH = 3
URGENT = 4
```

defines the application's intended priority values, but it does not automatically mean that every input is validated against those four values.

The implementation must be examined separately to determine what happens when unexpected input is supplied.

This demonstrates why reading the names and constants alone is not sufficient to understand application behavior.

### Does priority affect other behavior?

Priority is part of the Task object's state and is persisted with the task.

The application also provides functionality for retrieving tasks based on priority.

Therefore priority is used as actual application data rather than merely being a label shown to the user.

### How does priority move through the application?

The overall flow is:

```text
User
 ↓
CLI
 ↓
TaskManager
 ↓
Task
 ↓
TaskStorage
 ↓
JSON storage
```

For changing an existing task:

```text
priority command
       ↓
updateTaskPriority()
       ↓
storage.updateTask()
       ↓
task.update()
       ↓
save()
       ↓
JSON file
```

## Initial Understanding vs. Final Understanding

### What my initial understanding got right

- There are four defined priority levels.
- `MEDIUM` is the default priority.
- Priority can be supplied during task creation.
- Existing tasks can have their priority changed.
- The storage layer persists the updated task.

### What my initial understanding missed

Initially, I treated the four priority constants as though they automatically represented the application's validation rules.

The exploration showed that **declaring allowed values and validating user input are separate concerns**.

I also initially focused on priority as a property of an individual task. Further investigation showed that priority is also used by the application's retrieval/filtering functionality.

### Misconception Clarified

A priority constant does not automatically enforce valid input.

For example, defining `URGENT = 4` does not by itself guarantee that a value such as `5` cannot enter the system.

The actual behavior must be determined by examining the validation and update paths.

## Key Insight

The most important insight from this part was that understanding a codebase requires following data through its different layers instead of relying only on variable names or constants.

The priority value travels from the CLI, through `TaskManager`, into the `Task` model, and eventually into persistent storage.

The guided-question approach helped identify areas where my initial interpretation was too broad, particularly the difference between **what the application defines as valid** and **what the code actually enforces**.

## Part 2 Mental Model

```text
Priority definition
        ↓
     Task model
        ↑
        │
CLI ──→ TaskManager
        │
        ↓
   TaskStorage
        │
        ↓
    JSON storage
```

Priority is therefore part of the task's persistent state and can influence how tasks are retrieved.

# Part 3 — Mapping Data Flow and State Management

## Feature Explored

**Marking a task as complete**

## Entry Point

The flow begins at the command-line interface when the user uses the status command with a task ID and the `DONE` status.

The CLI passes the task ID and requested status to `TaskManager.updateTaskStatus()`.

## Components Involved

1. `cli.js` — receives the user's status command.
2. `app.js` — contains `TaskManager.updateTaskStatus()`.
3. `storage.js` — retrieves the task and persists changes.
4. `models.js` — contains `Task.markAsDone()`, which performs the task state transition.
5. `tasks.json` — provides persistent storage.

## Data Flow

```text
User
  ↓
cli.js
  ↓
TaskManager.updateTaskStatus()
  ↓
TaskStorage.getTask()
  ↓
Task.markAsDone()
  ↓
TaskStorage.save()
  ↓
tasks.json
```

## State Changes

When a task is marked as complete:

```text
status      → DONE
completedAt → current timestamp
updatedAt   → current timestamp
```

The `completedAt` and `updatedAt` values are set when `markAsDone()` executes.

## State Management

The current task state exists as a `Task` object inside the `TaskStorage.tasks` in-memory collection.

The changed state is persisted by `TaskStorage.save()`.

The storage system therefore follows this general cycle:

```text
JSON storage
     ↓
load()
     ↓
in-memory Task objects
     ↓
state changes
     ↓
save()
     ↓
JSON storage
```

## Potential Failure Points

### 1. Invalid task ID

If the requested task does not exist, `getTask()` does not return a task. The completion operation therefore returns `false` rather than changing anything.

### 2. Loading persistent data

The JSON storage file may fail to load because of a file-system or JSON parsing problem. `load()` catches and reports the error.

### 3. Saving persistent data

Writing the updated tasks to the JSON file may fail. `save()` catches and reports the error.

## Persistence

After `markAsDone()` changes the task, `updateTaskStatus()` explicitly calls `storage.save()`.

The resulting task state is therefore written to the JSON storage file.

When the application subsequently loads the stored data, the saved status and completion timestamp are restored into a new `Task` object.

## Mental Model

The completion operation can be understood as:

```text
User request
     ↓
CLI receives request
     ↓
TaskManager coordinates operation
     ↓
Storage finds task
     ↓
Task changes its own state
     ↓
Storage persists new state
```

The important distinction is that `Task` is responsible for the task's state transition, while `TaskStorage` is responsible for persistence.

## Key Insight

Marking a task complete is not simply a change from one status value to another.

The application treats completion as a specific state transition because it also records when completion occurred.

The data then has to be persisted so that this new state survives after the current program execution.
