# Exercise 8 — AI Solution Verification Challenge

## Selected Scenario

**JavaScript Merge Sort with a Subtle Bug**

## Repository Location

```text
use-cases/debug-limitations/javascript/
```

## Files

- `merge_sort.js`
- `tests/merge_sort.test.js`

## Objective

The objective of this exercise is to use AI to diagnose and solve a subtle sorting-function bug and then verify the AI-generated solution using three verification strategies:

1. Collaborative Solution Verification
2. Learning Through Alternative Approaches
3. Developing a Critical Eye

The goal is not simply to accept an AI-generated fix, but to understand, verify, and critically evaluate the proposed solution before implementing it.

# Verification Process

## AI's Proposed Solution

The AI identified the bug in the leftover-left-elements loop:

```javascript
while (i < left.length) {
  result.push(left[i]);
  j++;
}
```

The loop condition depends on `i`, but the implementation increments `j`.

The proposed correction was:

```javascript
while (i < left.length) {
  result.push(left[i]);
  i++;
}
```

## Verification 1 — Collaborative Solution Verification

I checked whether the proposed correction actually causes the loop's controlling variable to change.

Before the correction:

```text
condition: i < left.length
increment: j++
```

The variable controlling termination was not being incremented.

After the correction:

```text
condition: i < left.length
increment: i++
```

The loop now progresses toward its termination condition.

The correction is therefore consistent with the logic of the loop.

## Verification 2 — Alternative Approach

I manually traced the merge process using two sorted arrays.

The manual trace demonstrated that the main merge loop correctly advances either `i` or `j` depending on which value is selected.

When the right array is exhausted while elements remain in the left array, the second loop must advance `i` because it is processing elements from the left array.

This independently confirmed the proposed correction.

## Verification 3 — Developing a Critical Eye

I examined the correction against several edge cases:

- empty arrays;
- single-element arrays;
- duplicate values;
- already sorted arrays;
- reverse-sorted arrays;
- negative values.

The correction changes only the incorrect increment in the affected loop and does not alter the overall merge-sort structure.

The existing base case handles arrays with zero or one element.

## Test Verification

After implementing the correction, I ran the project's test suite.

The purpose of running the tests was to verify that the corrected implementation produces the expected sorting behavior and that the original bug no longer causes the test suite to hang or fail.

## Confidence After Verification

My confidence in the solution increased after performing the three verification strategies.

The important lesson was that identifying an apparently obvious bug is not enough.

The proposed fix must also be tested against the algorithm's logic, alternative reasoning, edge cases, and the existing automated tests.

## Key Learning

The most important lesson from this exercise is that AI-generated solutions should be treated as proposed solutions rather than unquestionable answers.

Verification helped distinguish between:

- what the AI claimed;
- what the code actually does;
- and what the tests demonstrate.

This makes AI a development partner rather than a replacement for developer judgment.
