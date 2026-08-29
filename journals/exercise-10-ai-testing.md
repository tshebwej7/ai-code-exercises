# Exercise 10 — Using AI to Help With Testing

## Objective

The objective of this exercise is to use AI to help identify testing requirements, generate useful test cases, and improve confidence in an existing JavaScript Task Manager application.

The AI-generated tests will be reviewed rather than accepted automatically.

## Application Components

The JavaScript Task Manager contains several components:

- `models.js` — defines the `Task` model and task status/priority values.
- `task_priority.js` — calculates task importance and sorts tasks.
- `storage.js` — handles task persistence.
- `task_parser.js` — handles task parsing.
- `task_list_merge.js` — handles task-list merging.
- `app.js` — application-level functionality.
- `cli.js` — command-line interface.

## Initial Testing Strategy

I will divide testing into:

1. Unit tests for individual functions and classes.
2. Edge-case tests for unusual or boundary inputs.
3. Integration tests for interactions between components.

## Important Behaviors to Test

### Task Model

The `Task` class should be tested for:

- construction;
- default values;
- updates;
- completion;
- timestamps;
- overdue detection.

### Task Priority

The priority system should be tested for:

- priority weighting;
- due-date effects;
- status effects;
- tag effects;
- recent-update effects;
- sorting;
- top-priority selection.

### Storage

Storage behavior should be tested for:

- saving tasks;
- loading tasks;
- persistence;
- empty storage conditions;
- invalid or missing data where applicable.

### Integration

Tests should verify that the major components work correctly together.

## AI Verification Principle

AI-generated tests will be treated as proposed tests.

Each proposed test must be evaluated for:

- whether it tests real behavior;
- whether the expected result is correct;
- whether it covers a meaningful edge case;
- whether it duplicates an existing test unnecessarily;
- whether it could pass without actually detecting a defect.

The final test suite should therefore reflect both AI assistance and human verification.

## Storage Testing

I added tests for the `TaskStorage` component.

The tests cover:

- empty storage;
- adding tasks;
- retrieving tasks;
- writing tasks to disk;
- loading tasks from disk;
- preserving date values;
- updating tasks;
- handling updates for nonexistent tasks;
- deleting tasks;
- handling deletion of nonexistent tasks;
- filtering by status;
- filtering by priority;
- retrieving overdue tasks.

### Why Persistence Tests Matter

Testing only `addTask()` in memory would not prove that the task is actually persisted correctly.

The storage implementation writes tasks to a JSON file and reconstructs `Task` objects when loading the file.

Therefore, persistence tests verify both sides of the process:

```text
Task object
    ↓
save()
    ↓
JSON file
    ↓
load()
    ↓
Task object
```

This also allows the tests to verify that values such as dates are reconstructed correctly.

### Test Isolation

The tests use temporary files rather than the application's normal `tasks.json`.

This prevents the tests from modifying real application data and allows each test to start with an isolated storage location.

### AI-Assisted Testing

AI was useful for identifying categories of behavior that should be tested.

However, each generated test still required review to ensure that it corresponded to actual behavior implemented by `TaskStorage`.

The test suite therefore combines AI assistance with verification against the source code.

## Final Testing Results

### Test Areas Completed

The test suite covers:

- Task model behavior
- Task priority calculations
- Task sorting
- Task storage and persistence
- Task parsing
- Task-list merging
- Task conflict resolution
- TaskManager application behavior
- Integration between TaskManager and TaskStorage

### AI's Contribution

AI was used to help identify behaviors that should be tested, propose edge cases, structure test cases, and identify areas of the application that required additional coverage.

### Human Verification

AI-generated testing suggestions were compared against the actual implementation before being used.

Tests were not accepted solely because they were suggested by AI.

Each test was considered in terms of:

- what behavior it verifies;
- whether the expected result matches the implementation;
- whether the scenario is meaningful;
- whether it covers an edge case;
- whether it duplicates another test.

### Most Valuable Testing Insight

A useful testing strategy begins with understanding the behavior of the application rather than simply generating a large number of assertions.

The source code determines what behavior exists, while the tests provide executable evidence that the behavior works as expected.

### Challenges

The most challenging part was identifying meaningful edge cases without changing the intended behavior of the starter application.

AI helped by suggesting possible scenarios, but the source code had to be consulted to determine whether those scenarios actually applied.

### Conclusion

The exercise demonstrated how AI can accelerate test planning and test creation while still requiring human review and verification.

The final objective was not simply to generate tests, but to create tests that provide meaningful confidence in the application's behavior.
