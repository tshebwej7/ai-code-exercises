# Exercise 7 — Algorithm Deconstruction

## Selected Algorithm

**Task Priority Sorting Algorithm**

### Purpose

The algorithm calculates an importance score for each task and then sorts tasks from the highest calculated score to the lowest.

The score considers multiple factors:

- task priority;
- due-date proximity;
- completion status;
- review status;
- special tags;
- how recently the task was updated.

The algorithm also provides a function for returning only the top N tasks.

## Initial Understanding

Before using AI, my initial understanding was that the algorithm determines which tasks are most important by combining several task attributes into one numerical score.

I understood that higher-priority tasks should generally receive higher scores, while urgent due dates should increase the score.

I also understood that completed tasks should become less important in the ranking.

## What I Discovered

The algorithm uses a weighted scoring model rather than relying on a single task property.

The final score is influenced by:

| Factor                        | Effect |
| ----------------------------- | ------ |
| LOW priority                  | +10    |
| MEDIUM priority               | +20    |
| HIGH priority                 | +30    |
| URGENT priority               | +40    |
| Overdue                       | +30    |
| Due today                     | +20    |
| Due within 2 days             | +15    |
| Due within 7 days             | +10    |
| DONE                          | -50    |
| REVIEW                        | -15    |
| blocker/critical/urgent tag   | +8     |
| Updated less than one day ago | +5     |

The calculated score is then used to sort tasks in descending order.

## Important Insight

The algorithm does not directly change the task's priority field.

Instead, it calculates a separate numerical importance score from several characteristics of the task.

This allows different factors to influence the final ordering.

## Sorting

`sortTasksByImportance()` creates a copy of the task array and sorts the copy according to the calculated scores.

The original task array is therefore not directly modified by the sorting operation.

## Top Priority Tasks

`getTopPriorityTasks()` sorts the tasks and then uses `slice()` to return only the requested number of highest-scoring tasks.

## Misconceptions Clarified

One possible misconception is that the task's priority value alone determines its position.

It does not.

A lower-priority task can potentially receive a higher overall score if other factors, such as an overdue due date, special tags, and recent updates, increase its score sufficiently.

The algorithm therefore ranks tasks according to a combined weighted score rather than priority alone.

# Exercise 7 — Algorithm Deconstruction Challenge

## Selected Algorithm

**Task Priority Sorting Algorithm**

The selected algorithm is the JavaScript implementation provided in the course material.

Its purpose is to calculate an importance score for each task and then sort tasks from the highest score to the lowest score.

The algorithm considers:

- priority;
- due-date proximity;
- completion/review status;
- special tags;
- recent updates.

---

# Algorithm Structure

The algorithm consists of three main functions:

```text
calculateTaskScore()
        ↓
sortTasksByImportance()
        ↓
getTopPriorityTasks()
```

### `calculateTaskScore()`

Calculates a numerical importance score for one task.

### `sortTasksByImportance()`

Calculates task importance and sorts the tasks from highest score to lowest.

### `getTopPriorityTasks()`

Returns only the first N tasks from the sorted collection.

---

# Scoring System

## Priority

| Priority | Weight | Score |
| -------- | -----: | ----: |
| LOW      |      1 |    10 |
| MEDIUM   |      2 |    20 |
| HIGH     |      3 |    30 |
| URGENT   |      4 |    40 |

The priority weight is multiplied by 10.

---

## Due Date

| Condition             | Score |
| --------------------- | ----: |
| Overdue               |   +30 |
| Due today             |   +20 |
| Due within 2 days     |   +15 |
| Due within 7 days     |   +10 |
| More than 7 days away |    +0 |

Tasks that are due sooner receive a higher score.

---

## Status

| Status         | Score effect |
| -------------- | -----------: |
| DONE           |          −50 |
| REVIEW         |          −15 |
| Other statuses |            0 |

The purpose is to reduce the importance of tasks that are already completed or awaiting review.

---

## Special Tags

If a task contains at least one of:

- `blocker`
- `critical`
- `urgent`

the score receives:

```text
+8
```

---

## Recent Update

If a task was updated less than one day ago:

```text
+5
```

---

# Overall Formula

Conceptually:

```text
Final Score =
    Priority Score
  + Due-Date Score
  + Status Adjustment
  + Tag Bonus
  + Recent-Update Bonus
```

---

# Example Calculations

## Example 1

```text
Priority: URGENT
Due: within 2 days
Status: TODO
Tag: urgent
Updated: today
```

```text
40 + 15 + 0 + 8 + 5 = 68
```

Final score:

**68**

---

## Example 2

```text
Priority: HIGH
Due: within 7 days
Status: TODO
No special tag
Updated: 3 days ago
```

```text
30 + 10 + 0 + 0 + 0 = 40
```

Final score:

**40**

---

## Example 3

```text
Priority: URGENT
Due: overdue
Status: DONE
Tag: critical
Updated: today
```

```text
40 + 30 - 50 + 8 + 5 = 33
```

Final score:

**33**

This example demonstrates that several positive factors can be offset by the completion penalty.

---

# Sorting Process

`sortTasksByImportance()` creates a copy of the input array before sorting it.

The comparison is based on:

```javascript
calculateTaskScore(b) - calculateTaskScore(a);
```

This places the task with the higher calculated score first.

The use of:

```javascript
[...tasks];
```

means the original task array is not directly modified by the sorting operation.

---

# Top Priority Tasks

`getTopPriorityTasks()` first sorts the tasks.

It then uses:

```javascript
slice(0, limit);
```

to return only the first N tasks.

The default limit is five.

For example:

```text
20 tasks
   ↓
sort by score
   ↓
take first 5
   ↓
5 highest-scoring tasks
```

---

# Complexity

The score calculation examines a fixed number of task properties.

The tag check depends on the number of tags.

The sorting operation is the dominant operation when there are many tasks and has typical complexity of:

```text
O(N log N)
```

where N is the number of tasks.

Therefore, for a normal task collection with a small number of tags, the overall algorithm is dominated by sorting and is approximately:

```text
O(N log N)
```

---

# Data Flow

```text
                    TASK
                      │
                      ▼
             calculateTaskScore()
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
      Priority     Due Date      Status
          │           │            │
       +10–40      +0–30        0/-15/-50
          │           │            │
          └───────────┼────────────┘
                      ▼
                  Tags
                    +8
                      │
                      ▼
              Recent Update
                    +5
                      │
                      ▼
               FINAL SCORE
                      │
                      ▼
          sortTasksByImportance()
                      │
                      ▼
             Highest → Lowest
                      │
                      ▼
          getTopPriorityTasks()
                      │
                      ▼
                    Top N
```

---

# Insights and Learning Points

The algorithm is not simply sorting tasks according to their stored priority.

Instead, it converts several characteristics of each task into a single numerical score.

This means a task with a lower stored priority can potentially outrank a higher-priority task if its other scoring factors are sufficiently strong.

Another important insight is that task completion has a very large negative effect.

A completed urgent task can therefore receive a lower overall score than an incomplete task.

The algorithm is consequently a weighted ranking system rather than a simple priority sorter.

---

# Reflection

## 1. How did the AI's explanation change my understanding of the algorithm?

Initially, I understood the algorithm as a way of sorting tasks according to their priority.

After examining it in detail, I understood that the stored task priority is only one component of the final ranking.

The algorithm combines priority, due date, status, tags, and recent activity to produce a single importance score.

This gave me a more accurate understanding of why two tasks with the same priority can appear in different positions.

---

## 2. What aspects were still difficult to understand after the AI explanation?

The most difficult part was understanding how the individual scoring rules interact.

For example, a task can receive several positive bonuses but also receive a large negative adjustment when it is marked as `DONE`.

Understanding the final ranking therefore requires calculating the complete score rather than looking at one property.

The date calculations also require careful attention because the algorithm calculates the number of days relative to the current time.

---

## 3. How would I explain this algorithm to another junior developer?

I would explain it as a points-based ranking system.

Every task starts with points based on its priority.

The algorithm then adds points when the task is approaching its deadline, is overdue, contains an important tag, or was recently updated.

It subtracts points when the task is completed or in review.

After calculating the final score for every task, the application sorts the tasks from the highest score to the lowest score.

If only the most important tasks are required, the application takes the first N tasks from that sorted list.

---

## 4. Did I test my understanding against AI?

Yes.

The understanding was tested by breaking the algorithm into individual scoring components and calculating concrete examples manually.

The manual calculations helped verify that the final score is the sum of the individual positive and negative adjustments.

The sorting logic was also tested conceptually by comparing tasks with different scores.

---

## 5. How might I improve the algorithm based on my understanding?

Possible improvements would need to be considered carefully because changing the scoring weights would change the application's definition of task importance.

Potential areas for future investigation include:

- whether the scoring weights accurately represent the application's business requirements;
- whether the date calculation behaves consistently around time boundaries;
- how ties between tasks with identical scores should be handled;
- whether all task properties are guaranteed to have valid values;
- whether calculating scores repeatedly during sorting is necessary.

These are observations for future investigation rather than changes made during this exercise.

---

# Key Takeaway

The most important lesson from this exercise is that understanding an algorithm requires more than knowing what its function name suggests.

I learned to:

1. break a complex function into logical sections;
2. identify each input and transformation;
3. calculate concrete examples;
4. trace control flow;
5. consider edge cases;
6. analyze performance;
7. verify my understanding using AI rather than simply accepting an explanation.

The AI prompts were most useful when they were combined with manual tracing and concrete examples.

## Verification Against the Repository Tests

I examined the actual `task_priority.test.js` file in the JavaScript Task Manager.

The tests confirm the intended behavior of the algorithm.

### Priority

The tests verify that task scores increase according to priority:

```text
LOW < MEDIUM < HIGH < URGENT
```

### Due Dates

The tests verify that tasks with earlier due dates receive higher scores:

```text
OVERDUE > TODAY > TOMORROW > NEXT WEEK > NEXT MONTH
```

### Status

The tests verify that completed and review tasks receive lower scores:

```text
DONE < REVIEW < TODO
```

The review score is also lower than the score for an in-progress task.

### Tags

The tests verify that the following tags increase a task's score:

- `critical`
- `blocker`
- `urgent`

### Sorting

The tests verify that `sortTasksByImportance()` orders tasks according to their calculated scores.

The tests also verify that sorting does not modify the original task array.

### Top Priority Tasks

The tests verify that `getTopPriorityTasks()`:

1. returns the requested number of highest-scoring tasks;
2. uses a default limit of 5;
3. returns all available tasks when the requested limit is greater than the number of tasks.

### Repository-Level Understanding

Examining the tests helped validate my understanding of the algorithm.

The implementation is a weighted scoring system, while the tests describe the expected relationships between the different scoring factors.

The tests therefore provide executable evidence of how the algorithm is expected to behave.
