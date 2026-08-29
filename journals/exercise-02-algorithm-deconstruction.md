# Exercise 2 — Algorithm Deconstruction Challenge

## Selected Algorithm

**Task Priority Sorting Algorithm**

**Language:** JavaScript

**Primary file:**

`use-cases/code-algorithms/javascript/TaskManager/task_priority.js`

---

## Objective

The objective of this exercise was to understand and deconstruct an existing algorithm using AI rather than immediately modifying or improving the implementation.

---

## Initial Understanding

Initially, I thought the algorithm primarily sorted tasks according to their priority.

After examining the implementation more closely, I discovered that this understanding was incomplete.

The algorithm calculates a weighted importance score for each task using several characteristics:

- priority;
- due-date proximity;
- task status;
- important tags;
- recent update time.

The final score is then used to rank the tasks.

---

## Algorithm Overview

```text
Task
 ↓
Calculate priority score
 ↓
Calculate due-date adjustment
 ↓
Apply status adjustment
 ↓
Check important tags
 ↓
Check recent update
 ↓
Calculate final score
 ↓
Sort tasks by score
 ↓
Return highest-ranked tasks
```

---

## Step 1 — Priority

The algorithm defines four priority weights:

```text
LOW     = 1
MEDIUM  = 2
HIGH    = 3
URGENT  = 4
```

The priority weight is multiplied by 10.

Therefore:

```text
LOW     → 10
MEDIUM  → 20
HIGH    → 30
URGENT  → 40
```

The priority therefore provides the base score for the task.

---

## Step 2 — Due Date

If the task has a due date, the algorithm calculates the number of days until the task is due.

The implementation uses `Math.ceil()` when calculating this value.

The resulting score adjustment is:

```text
Overdue          +30
Due today        +20
Due within 2 days +15
Due within 7 days +10
More than 7 days   +0
```

If the task has no due date, the due-date adjustment is not applied.

---

## Step 3 — Status

The algorithm also considers the current status of the task.

The adjustments are:

```text
DONE       -50
REVIEW     -15
Other        0
```

This means a task with a high priority can still receive a relatively low final score if it has already been completed.

---

## Step 4 — Tags

The algorithm checks whether the task has any of the following tags:

```text
blocker
critical
urgent
```

If at least one matching tag exists, the task receives:

```text
+8
```

The bonus is applied when there is at least one matching tag.

---

## Step 5 — Recent Update

The algorithm calculates how many complete days have passed since the task was last updated.

The implementation uses `Math.floor()` for this calculation.

If the task was updated less than one day ago, it receives:

```text
+5
```

---

## Complete Scoring Formula

The algorithm can therefore be represented conceptually as:

```text
Final Score =
    Priority Base
  + Due-Date Adjustment
  + Status Adjustment
  + Tag Bonus
  + Recent-Update Bonus
```

Or:

```text
Final Score =
    (Priority Weight × 10)
    + Due-Date Bonus
    + Status Adjustment
    + Tag Bonus
    + Recent-Update Bonus
```

---

## Worked Example

Suppose a task has:

```text
Priority: HIGH
Due date: tomorrow
Status: TODO
Tags: urgent
Updated: today
```

The calculation is:

```text
Priority        +30
Due date        +15
Status            0
Tag              +8
Recent update    +5
-------------------
Final score      58
```

Therefore:

```text
Final Score = 58
```

---

## Second Example

Suppose a task has:

```text
Priority: URGENT
Due date: tomorrow
Status: DONE
Tags: critical
Updated: today
```

The calculation is:

```text
Priority        +40
Due date        +15
Status          -50
Tag              +8
Recent update    +5
-------------------
Final score      18
```

Therefore:

```text
Final Score = 18
```

This demonstrates that a task's priority does not by itself determine its final ranking.

---

## Sorting

After calculating scores, the algorithm sorts the tasks from highest score to lowest score.

Conceptually:

```text
Task A → 43
Task B → 18
Task C → 67
Task D → 31
```

becomes:

```text
Task C → 67
Task A → 43
Task D → 31
Task B → 18
```

The implementation creates a copy of the task array before sorting.

Therefore, the original input array is not intentionally reordered by the sorting operation.

---

## Selecting the Top Tasks

`getTopPriorityTasks()` builds on the sorting operation.

It sorts the tasks and then takes the first `limit` items.

The default limit is 5.

Conceptually:

```text
All tasks
   ↓
Calculate importance
   ↓
Sort highest → lowest
   ↓
Take first 5
   ↓
Top priority tasks
```

---

## Algorithmic Pattern

The algorithm uses a **weighted scoring and ranking approach**.

Instead of sorting directly using one task property, it combines multiple factors into a single numerical score.

That score becomes the ranking criterion.

The process is:

```text
Multiple task attributes
          ↓
   Weighted calculation
          ↓
      Final score
          ↓
        Ranking
```

---

## Complexity

Let `n` represent the number of tasks.

The algorithm calculates a score for each task and then sorts the tasks.

The dominant operation is sorting.

Therefore, the overall time complexity is approximately:

```text
O(n log n)
```

The implementation also creates a copy of the task array before sorting, resulting in additional space proportional to the number of tasks:

```text
O(n)
```

---

## Edge Cases

Several edge cases were identified during the analysis.

### No due date

A task without a due date receives no due-date bonus.

### Unknown priority

If the priority does not correspond to one of the defined priority weights, the priority lookup falls back to zero.

### Completed task

A task with `DONE` status receives a `-50` adjustment.

### Review task

A task with `REVIEW` status receives a `-15` adjustment.

### No important tags

The task receives no tag bonus.

### Important tag

A task with at least one of the recognized tags receives `+8`.

### Recently updated task

A task updated less than one day ago receives `+5`.

### Date calculations

The implementation uses different rounding methods:

```text
Due date:
Math.ceil()

Recent update:
Math.floor()
```

This distinction can affect how dates close to a boundary are categorized.

---

## Data Flow Diagram

```text
┌──────────────────────┐
│        Task          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Priority calculation │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Due-date adjustment  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Status adjustment    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Tag bonus            │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Recent-update bonus  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Final score        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Sort highest → lowest│
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Top N tasks          │
└──────────────────────┘
```

---

# Reflection

## How did the AI explanation change your understanding?

Initially, I thought the algorithm mainly sorted tasks by priority.

The AI-assisted analysis showed that priority is only one component of a larger weighted scoring system.

The final ranking also depends on due date, status, tags and recent updates.

---

## What remained difficult?

The most difficult parts were understanding how the individual score adjustments interact and understanding the date calculations.

In particular, the use of `Math.ceil()` for due-date calculations and `Math.floor()` for recent-update calculations required careful examination.

---

## How would you explain the algorithm to another junior developer?

I would explain it as a scoring system.

Each task starts with points based on its priority.

The algorithm then adds or subtracts points depending on how soon the task is due, whether it is completed or under review, whether it has important tags, and whether it was recently updated.

After every task has a final score, the tasks are sorted from the highest score to the lowest score.

---

## Did you test your understanding against AI?

Yes.

I used AI to deconstruct the algorithm into smaller components and then compared the explanations and calculated examples against the actual source code.

The AI was used as a tool for validating and deepening my understanding rather than simply replacing the process of reading the code.

---

## How might you improve the algorithm based on your understanding?

Understanding the algorithm revealed several areas that could potentially be examined in a future improvement exercise.

For example:

- whether the scoring weights accurately represent task importance;
- whether the date boundaries behave as intended;
- whether the scoring rules should be configurable;
- whether all edge cases should have explicit handling.

These are observations for possible future improvement.

They were not implemented because this exercise focused on understanding and deconstructing the existing algorithm.

---

# Key Learning Points

The most important lesson was that an algorithm can appear to be a simple priority sorter while actually implementing a multi-factor ranking system.

I learned to break a complex function into smaller stages instead of attempting to understand the entire function at once.

I also learned that variable names, constants and comments do not necessarily provide the complete behavior of an algorithm.

The actual calculations and control flow must be followed.

---

# Final Understanding

The Task Priority Sorting Algorithm can be summarized as:

```text
Priority
   +
Due date
   +
Status
   +
Tags
   +
Recent activity
   ↓
Weighted importance score
   ↓
Sort by score
   ↓
Select highest-ranked tasks
```

The algorithm therefore provides a mechanism for ranking tasks according to several characteristics rather than relying exclusively on their assigned priority.
