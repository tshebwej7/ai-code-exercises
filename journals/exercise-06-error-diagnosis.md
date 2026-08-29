# Exercise 6 — Error Diagnosis Challenge

## Part 1 — User List Rendering Error

### Problem

The `userList.js` implementation attempted to render a maximum of five users.

The loop was:

```javascript
for (let i = 0; i < 5; i++) {
```

However, the supplied sample data contained only three users.

---

## Root Cause

When the loop reached index `3`, the expression:

```javascript
users[3];
```

returned `undefined` because the array contained only indexes `0`, `1`, and `2`.

The following statement then attempted to access a property of that undefined value:

```javascript
const userName = user.name;
```

This caused the runtime failure.

---

## Execution Flow

```text
loadDashboard()
      ↓
renderUserList(sampleResponse.users)
      ↓
users contains 3 users
      ↓
loop begins
      ↓
i = 0 → valid user
      ↓
i = 1 → valid user
      ↓
i = 2 → valid user
      ↓
i = 3 → users[3] is undefined
      ↓
user.name
      ↓
runtime error
```

---

## Secondary Test Problem

The test expected:

```javascript
expect(userCards.length).toBe(5);
```

However, the sample data contains three users.

The test comment also states:

```javascript
// Expecting 3 users from the sample data
```

Therefore, the test expectation was inconsistent with the supplied sample data.

---

## Minimal Fix

The loop was changed to:

```javascript
for (let i = 0; i < Math.min(users.length, 5); i++) {
```

This preserves the intended maximum of five users while preventing the loop from accessing an array element that does not exist.

The test expectation was changed from:

```javascript
expect(userCards.length).toBe(5);
```

to:

```javascript
expect(userCards.length).toBe(3);
```

---

## Why This Fix Is Appropriate

The existing code comment states that the application should process users "up to a maximum of 5."

Using:

```javascript
Math.min(users.length, 5);
```

implements that requirement directly.

It means:

- fewer than five users → render all available users;
- exactly five users → render all five;
- more than five users → render only five.

---

## Regression Consideration

The important behavior to protect is that the function must never attempt to access a user outside the bounds of the array.

A useful set of test cases would include:

```text
0 users  → 0 cards
3 users  → 3 cards
5 users  → 5 cards
more than 5 users → 5 cards
```

---

## AI-Assisted Debugging Reflection

AI was useful for tracing the execution path and identifying the difference between the application defect and the incorrect test expectation.

The important lesson was that an AI-generated diagnosis still needs to be verified against the actual source code and test data.

The source code showed that the loop assumed five elements existed, while the actual sample array contained only three.

The test itself also contained a conflicting expectation.

---

## Key Learning

The main lesson from this debugging exercise was to distinguish between:

1. the immediate runtime error;
2. the root cause in the application;
3. incorrect assumptions in the test.

The runtime failure was caused by accessing `.name` on an undefined array element.

The root cause was the fixed loop boundary of five despite the array containing fewer elements.

The test also required correction because it expected five cards even though the supplied sample data contained three users.

This demonstrates why debugging should examine both the implementation and the tests rather than assuming that a failing test automatically means the application code alone is wrong.

# Part 2 — Task Manager Variable Scope Error

## Problem

The `addTask()` function was intended to add a new task to the application's global task list.

However, the function declared another variable named `tasks`:

```javascript
let tasks = {
  id: Date.now(),
  name: taskName,
  completed: false,
};
```

This created a local variable that shadowed the global `tasks` array.

---

## Root Cause

The application has a global task array:

```javascript
let tasks = [];
```

The `addTask()` function accidentally declared a local variable with the same name.

As a result, the new task was stored in the local variable instead of being added to the global task array.

The rest of the application continued using the global array.

---

## Execution Flow

```text
Global tasks array
       ↓
initApp()
       ↓
2 tasks stored globally
       ↓
addTask("New test task")
       ↓
local `tasks` variable created
       ↓
new task stored only in local variable
       ↓
displayTasks()
       ↓
displayTasks() uses global tasks array
       ↓
new task is missing
```

---

## Test Failure

The test expects the task list to contain three tasks after adding one task to the initial two.

However, the original `addTask()` implementation returned a newly created task object rather than the complete task array.

This meant the expected array behavior could not occur.

---

## Fix

The local variable was renamed to `task` and the new task was explicitly added to the global array:

```javascript
function addTask(taskName) {
  const task = {
    id: Date.now(),
    name: taskName,
    completed: false,
  };

  tasks.push(task);

  console.log("Task added:", task);
  displayTasks();
  return tasks;
}
```

---

## Why the Fix Works

`task` represents the individual task being created.

`tasks` continues to represent the application's global array.

The new task is inserted into that array using:

```javascript
tasks.push(task);
```

Therefore the global state is updated and other functions such as `displayTasks()`, `toggleTaskStatus()`, and `deleteTask()` can work with the newly added task.

---

## AI-Assisted Debugging Reflection

The AI analysis helped identify variable shadowing as the root cause.

The important insight was that the problem was not simply the variable name itself.

The deeper problem was that a local variable named `tasks` hid the global task array, preventing the new task from being stored in the application's shared state.

The test was useful because it expressed the intended behavior: after initializing two tasks and adding one more, the task collection should contain three tasks.

---

## Key Learning

This debugging exercise demonstrated the importance of understanding JavaScript variable scope.

A local variable can shadow a variable from an outer scope.

When this happens, code inside the function may operate on a different variable from the one used by the rest of the application.

The fix requires both removing the accidental shadowing and explicitly updating the shared task collection.
