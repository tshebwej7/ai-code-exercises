# Exercise 3 — Code Documentation

## Exercise: Code Documentation

### Selected Function

**Function:** `calculateTaskScore(task)`

**Language:** JavaScript

**Source file:**

`use-cases/code-algorithms/javascript/TaskManager/task_priority.js`

---

# Part 1 — Comprehensive Function Documentation

## Function Purpose

`calculateTaskScore(task)` calculates a numerical importance score for a task.

The function starts with a base score determined by the task's priority and then adjusts that score using several additional characteristics:

- due-date proximity;
- task status;
- task tags;
- how recently the task was updated.

The resulting numerical score is returned to the caller.

---

## Parameters

### `task`

The function expects a task object.

The implementation accesses the following properties:

```text
task.priority
task.dueDate
task.status
task.tags
task.updatedAt
```

The exact task class/type definition is not declared directly in this function.

The function also relies on `TaskPriority` and `TaskStatus`, which are imported from `./models`.

---

## Return Value

The function returns:

**Type:** `number`

The number represents the calculated importance score for the supplied task.

---

# Scoring Logic

## 1. Priority Score

The function defines these priority weights:

```text
LOW     → 1
MEDIUM  → 2
HIGH    → 3
URGENT  → 4
```

The selected weight is multiplied by 10.

Therefore the base scores are:

```text
LOW     → 10
MEDIUM  → 20
HIGH    → 30
URGENT  → 40
```

If the task's priority does not match a defined priority weight, the expression uses `0` as the fallback.

---

## 2. Due-Date Adjustment

If `task.dueDate` exists, the function calculates the number of days between the current time and the due date.

The implementation uses:

```javascript
Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
```

The resulting value determines the adjustment:

```text
daysUntilDue < 0     → +30
daysUntilDue === 0   → +20
daysUntilDue <= 2    → +15
daysUntilDue <= 7    → +10
otherwise            → +0
```

Therefore, overdue tasks receive the largest due-date bonus.

---

## 3. Status Adjustment

The function checks the task status.

If the status is:

```text
DONE
```

the score is reduced by:

```text
-50
```

If the status is:

```text
REVIEW
```

the score is reduced by:

```text
-15
```

Other statuses do not cause a status adjustment.

---

## 4. Tag Bonus

The function checks whether at least one task tag is one of:

```text
blocker
critical
urgent
```

If a matching tag exists, the score increases by:

```text
+8
```

The implementation uses `.some()`, meaning the condition is satisfied when at least one matching tag is found.

---

## 5. Recent-Update Bonus

The function converts `task.updatedAt` into a `Date` and calculates the number of complete days since the task was updated.

It uses:

```javascript
Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
```

If:

```text
daysSinceUpdate < 1
```

the score receives:

```text
+5
```

---

# Complete Formula

Conceptually, the function calculates:

```text
Final Score =
    Priority Base
  + Due-Date Adjustment
  + Status Adjustment
  + Tag Bonus
  + Recent-Update Bonus
```

---

# Example

A task with:

```text
Priority: HIGH
Due date: within the next 2 days
Status: not DONE or REVIEW
Tags: ["urgent"]
Updated: less than one day ago
```

would receive:

```text
Priority       +30
Due date       +15
Status           0
Tag              +8
Recent update    +5
-------------------
Final score     58
```

Therefore, the calculated score would be:

```text
58
```

---

# JSDoc Documentation

```javascript
/**
 * Calculates an importance score for a task.
 *
 * The score is based on the task's priority, due-date proximity,
 * status, tags, and how recently the task was updated.
 *
 * @param {Object} task - Task object to score.
 * @returns {number} The calculated importance score.
 *
 * @description
 * Priority contributes a base score:
 * LOW = 10, MEDIUM = 20, HIGH = 30, URGENT = 40.
 *
 * Due-date adjustments:
 * - Overdue: +30
 * - Due today: +20
 * - Due within 2 days: +15
 * - Due within 7 days: +10
 *
 * Status adjustments:
 * - DONE: -50
 * - REVIEW: -15
 *
 * Tasks containing at least one of the tags
 * "blocker", "critical", or "urgent" receive +8.
 *
 * Tasks updated less than one day ago receive +5.
 */
function calculateTaskScore(task) {
```

This documentation describes the behavior actually implemented by the function.

---

# Part 2 — Intent and Logic Explanation

## High-Level Purpose

The purpose of `calculateTaskScore()` is to transform several properties of a task into one numerical importance score.

This score can then be used to compare and rank tasks.

The function therefore acts as the scoring component of the task-prioritization system.

---

## Logic Flow

```text
Task
 ↓
Read priority
 ↓
Calculate base score
 ↓
Check due date
 ↓
Add due-date adjustment
 ↓
Check status
 ↓
Apply status adjustment
 ↓
Check tags
 ↓
Apply tag bonus
 ↓
Check update time
 ↓
Apply recent-update bonus
 ↓
Return final score
```

---

# Assumptions

The function assumes that the task object provides the properties it accesses.

These include:

```text
priority
dueDate
status
tags
updatedAt
```

It also assumes that the values provided are compatible with the operations performed on them.

For example, the tag-processing code calls:

```javascript
task.tags.some(...)
```

Therefore, the implementation expects `task.tags` to support the `.some()` method.

The function also converts `task.updatedAt` using:

```javascript
new Date(task.updatedAt);
```

---

# Edge Cases

Several edge cases are important when maintaining this function.

### Missing due date

If `task.dueDate` is falsy, the due-date calculation is skipped.

### Unknown priority

An unknown priority results in a priority weight of zero because of:

```javascript
priorityWeights[task.priority] || 0;
```

### Completed task

A `DONE` task receives a `-50` adjustment.

### Review task

A `REVIEW` task receives a `-15` adjustment.

### Important tag

At least one matching tag produces the `+8` bonus.

### No important tag

No tag bonus is added.

### Recently updated task

A task updated less than one day ago receives `+5`.

---

# Non-Obvious Behavior

One important detail is that due-date and update-time calculations use different rounding methods.

The due-date calculation uses:

```javascript
Math.ceil();
```

while the recent-update calculation uses:

```javascript
Math.floor();
```

These functions round numbers differently and therefore can produce different boundary behavior.

Another important detail is that the tag bonus is applied once when at least one matching tag exists. It is not multiplied by the number of matching tags.

---

# Suggested Inline Comments

The existing function already contains comments explaining the major sections.

Useful comments for maintaining the function would focus on the less obvious decisions.

For example:

```javascript
// Convert priority into a weighted base score.
```

```javascript
// Use ceiling so partial days until a due date are treated as the next
// whole-day category.
```

```javascript
// Apply the tag bonus once if any high-importance tag is present.
```

```javascript
// Give recently updated tasks a small importance boost.
```

These comments explain intent without unnecessarily commenting obvious JavaScript syntax.

---

# Potential Improvements

The purpose of this exercise is documentation rather than modification.

However, understanding the function reveals possible areas that could be examined in a future improvement exercise:

1. The scoring values could potentially be centralized so they are easier to adjust.
2. The expected task structure could be documented more explicitly.
3. Validation could be considered for task properties such as `tags` and `updatedAt`.
4. Date-boundary behavior could be tested explicitly.
5. The scoring rules could potentially be separated into smaller functions if maintainability became a concern.

These are potential improvements, not changes made as part of this exercise.

---

# Part 3 — Comparing the Two AI Perspectives

## Prompt 1 Contribution

The comprehensive documentation approach helped identify:

- the function's purpose;
- its parameter;
- its return value;
- its scoring rules;
- its edge cases;
- its usage example.

## Prompt 2 Contribution

The intent-and-logic approach helped identify:

- the overall purpose of the scoring system;
- the sequence of calculations;
- assumptions about the task object;
- non-obvious implementation behavior;
- useful inline comments;
- possible maintainability improvements.

---

# Part 4 — Final Combined Understanding

`calculateTaskScore()` is a weighted scoring function used to assign an importance value to a task.

It begins with a score based on priority.

It then adjusts the score according to due-date proximity, task status, important tags, and recent activity.

The final number represents the task's calculated importance and can subsequently be used by the task-sorting functions to rank tasks.

The function therefore converts multiple task properties into a single numerical value that can be used for prioritization.

---

# Exercise 3 Learning Points

The main lesson from this exercise was that good documentation should describe both **what a function does** and the important details a developer needs to use or maintain it correctly.

I also learned that AI-generated documentation must be checked against the actual source code.

AI can provide a useful explanation, but the source code remains the authority for determining the function's actual behavior.

Another important lesson was that documentation should distinguish between:

- behavior explicitly implemented by the code;
- assumptions about the input;
- possible improvements.

This prevents documentation from incorrectly describing behavior that the program does not actually implement.
