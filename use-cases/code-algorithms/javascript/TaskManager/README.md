# Task Manager CLI

A command-line interface (CLI) application for managing tasks.

The Task Manager supports creating, updating, listing, analyzing, and deleting tasks. Tasks can have descriptions, priorities, due dates, tags, and statuses.

---

## Features

The Task Manager provides commands for:

- Creating new tasks
- Listing tasks
- Filtering tasks by status
- Filtering tasks by priority
- Finding overdue tasks
- Updating task status
- Updating task priority
- Updating task due dates
- Adding tags
- Removing tags
- Viewing individual task details
- Deleting tasks
- Viewing task statistics

---

## Prerequisites

Before using the application, install:

- Node.js version 12 or higher
- npm

npm is included with Node.js.

You can verify your installation with:

```bash
node --version
npm --version
```

---

## Installation

Clone or download the project source code.

Navigate to the Task Manager directory:

```bash
cd TaskManager
```

Install the project dependencies:

```bash
npm install
```

The project uses:

- `commander` for the command-line interface
- `uuid` for generating unique task IDs

---

## Running the Application

The main entry point is:

```text
cli.js
```

Run the application with:

```bash
node cli.js [command] [options]
```

Running the CLI without a command displays the help menu.

On Unix-based systems, the script can also be made executable:

```bash
chmod +x cli.js
```

It can then be run with:

```bash
./cli.js [command] [options]
```

---

# Commands

## 1. Create a Task

Create a new task with:

```bash
node cli.js create <title> [options]
```

### Options

| Option                            | Description                         |
| --------------------------------- | ----------------------------------- |
| `-d, --description <description>` | Task description; defaults to empty |
| `-p, --priority <priority>`       | Priority from 1 to 4; defaults to 2 |
| `-u, --due <due_date>`            | Due date in `YYYY-MM-DD` format     |
| `-t, --tags <tags>`               | Comma-separated list of tags        |

### Example

```bash
node cli.js create "Complete project" -d "Finish the task manager project" -p 3 -u 2023-12-31 -t "work,coding,important"
```

---

## 2. List Tasks

List tasks with:

```bash
node cli.js list [options]
```

### Options

| Option                      | Description             |
| --------------------------- | ----------------------- |
| `-s, --status <status>`     | Filter by task status   |
| `-p, --priority <priority>` | Filter by priority      |
| `-o, --overdue`             | Show only overdue tasks |

### Examples

List all tasks:

```bash
node cli.js list
```

List tasks with `todo` status:

```bash
node cli.js list -s todo
```

List high-priority tasks:

```bash
node cli.js list -p 3
```

List overdue tasks:

```bash
node cli.js list -o
```

---

## 3. Update Task Status

Change a task's status with:

```bash
node cli.js status <task_id> <status>
```

Available statuses are:

| Status        | Meaning                       |
| ------------- | ----------------------------- |
| `todo`        | Task has not been started     |
| `in_progress` | Task is currently in progress |
| `review`      | Task is waiting for review    |
| `done`        | Task has been completed       |

### Example

```bash
node cli.js status abc123 in_progress
```

Replace `abc123` with the actual task ID.

---

## 4. Update Task Priority

Change a task's priority with:

```bash
node cli.js priority <task_id> <priority>
```

Available priorities:

| Value | Priority |
| ----: | -------- |
|   `1` | LOW      |
|   `2` | MEDIUM   |
|   `3` | HIGH     |
|   `4` | URGENT   |

### Example

```bash
node cli.js priority abc123 3
```

---

## 5. Update a Task's Due Date

Change the due date with:

```bash
node cli.js due <task_id> <due_date>
```

The date should use:

```text
YYYY-MM-DD
```

### Example

```bash
node cli.js due abc123 2023-12-31
```

---

## 6. Add a Tag

Add a tag to a task:

```bash
node cli.js tag <task_id> <tag>
```

### Example

```bash
node cli.js tag abc123 important
```

---

## 7. Remove a Tag

Remove a tag with:

```bash
node cli.js untag <task_id> <tag>
```

### Example

```bash
node cli.js untag abc123 important
```

---

## 8. Show Task Details

Display the details of a specific task:

```bash
node cli.js show <task_id>
```

### Example

```bash
node cli.js show abc123
```

---

## 9. Delete a Task

Delete a task using:

```bash
node cli.js delete <task_id>
```

### Example

```bash
node cli.js delete abc123
```

---

## 10. View Task Statistics

Display task statistics with:

```bash
node cli.js stats
```

The statistics include:

- Total number of tasks
- Tasks grouped by status
- Tasks grouped by priority
- Number of overdue tasks
- Number of tasks completed during the last seven days

---

# Step-by-Step Guide: Creating and Managing a Task

This example demonstrates a basic Task Manager workflow.

## Step 1 — Create the task

Run:

```bash
node cli.js create "Complete project" -d "Finish the task manager project" -p 3 -t "work,coding"
```

The application creates the task and assigns it a unique task ID.

Record the returned task ID because it is needed for subsequent commands.

---

## Step 2 — View the task

Use the task ID:

```bash
node cli.js show <task_id>
```

For example:

```bash
node cli.js show abc123
```

This allows you to inspect the task's current information.

---

## Step 3 — Start the task

Change its status to `in_progress`:

```bash
node cli.js status <task_id> in_progress
```

---

## Step 4 — Add an important tag

Add a tag:

```bash
node cli.js tag <task_id> important
```

---

## Step 5 — Increase the priority

If the task becomes more urgent, change its priority:

```bash
node cli.js priority <task_id> 4
```

Priority `4` represents `URGENT`.

---

## Step 6 — Complete the task

When the work is finished:

```bash
node cli.js status <task_id> done
```

The task is now marked as completed.

---

## Step 7 — Check the statistics

Run:

```bash
node cli.js stats
```

This provides an overview of the current tasks and includes information about recently completed tasks.

---

# Running Tests

The project contains a Jest test suite covering the major application components.

The documented test areas include:

- Task model
- TaskManager
- TaskStorage
- Integration tests

---

## Run All Tests

Run:

```bash
npm test
```

---

## Run Individual Test Files

The project documentation provides examples such as:

```bash
npx jest tests/task.test.js
```

```bash
npx jest tests/taskManager.test.js
```

```bash
npx jest tests/taskStorage.test.js
```

```bash
npx jest tests/taskManagerIntegration.test.js
```

---

## Generate Test Coverage

Run:

```bash
npx jest --coverage
```

This generates a coverage report showing which parts of the code are covered by tests.

---

# Data Storage

Tasks are stored in:

```text
tasks.json
```

The file is located in the project directory.

According to the existing project documentation, `tasks.json` is created automatically when the first task is added.

---

# Task Priority Reference

| Value | Priority |
| ----: | -------- |
|     1 | LOW      |
|     2 | MEDIUM   |
|     3 | HIGH     |
|     4 | URGENT   |

---

# Task Status Reference

| Status        | Description                |
| ------------- | -------------------------- |
| `todo`        | Task has not been started  |
| `in_progress` | Task is in progress        |
| `review`      | Task is waiting for review |
| `done`        | Task is completed          |

---

# Common Usage Examples

### Create a high-priority task

```bash
node cli.js create "Prepare presentation" -p 3
```

### List high-priority tasks

```bash
node cli.js list -p 3
```

### List tasks currently in progress

```bash
node cli.js list -s in_progress
```

### Find overdue tasks

```bash
node cli.js list -o
```

### Mark a task as completed

```bash
node cli.js status abc123 done
```

### Display statistics

```bash
node cli.js stats
```

---

# FAQ

## 1. What is the Task Manager CLI?

It is a command-line application for creating, managing, updating, listing, and analyzing tasks.

## 2. What do I need before installing it?

You need Node.js version 12 or higher and npm.

## 3. How do I install the dependencies?

Navigate to the Task Manager directory and run:

```bash
npm install
```

## 4. How do I see the available commands?

Run:

```bash
node cli.js
```

Running the CLI without a command displays the help menu.

## 5. How do I create a task?

Use:

```bash
node cli.js create <title>
```

Additional options can be used for description, priority, due date, and tags.

## 6. How do I change a task's status?

Use:

```bash
node cli.js status <task_id> <status>
```

Valid statuses are `todo`, `in_progress`, `review`, and `done`.

## 7. How do I change task priority?

Use:

```bash
node cli.js priority <task_id> <priority>
```

Priority values range from `1` to `4`.

## 8. Where are tasks stored?

Tasks are stored in a JSON file named:

```text
tasks.json
```

The file is created automatically when the first task is added.

## 9. How do I run the tests?

Run:

```bash
npm test
```

## 10. How do I generate test coverage?

Run:

```bash
npx jest --coverage
```

---

# Documentation Notes

This README was expanded from the supplied Task Manager documentation.

The documented behavior is based on the existing project README and should be kept synchronized with the implementation when the application changes.

Where the available documentation does not specify behavior, this README does not intentionally introduce additional requirements such as authentication, network configuration, environment variables, or deployment procedures.
