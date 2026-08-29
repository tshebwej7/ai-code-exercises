# Exercise 9 — Performance Optimization Challenge

## Selected Scenario

**JavaScript/Node.js Order Service with PostgreSQL**

## Main File

```text
use-cases/debug-performance/javascript/orders-service.js
```

## Main Function

```text
getCustomerOrderDetails()
```

## Objective

The objective is to investigate performance problems in the supplied order-service implementation, identify the actual bottlenecks, use AI to explore possible optimizations, and verify the proposed changes before implementing them.

The focus is on understanding performance concepts rather than simply making the code faster.

## Baseline Performance

Before making any optimization, I ran the supplied application/test setup.

### Baseline Result

- Test/setup command:
- Execution time:
- Number of tests:
- Passing tests:
- Failing tests:
- Timeout/error observed:
- Other observations:

No source-code optimization was performed before collecting this baseline.

### Why the Baseline Matters

The baseline gives me a point of comparison for determining whether an optimization actually improves performance.

I should not assume that a code change is an improvement simply because the code looks cleaner or theoretically more efficient.

The performance should be measured before and after the change.

## Database Analysis

### Existing Indexes

The database initialization script creates:

```text
orders(customer_id, order_date)
order_items(order_id)
products(product_id)
```

The primary-key columns are also indexed through their primary-key constraints.

The existing `orders(customer_id, order_date)` index is particularly relevant because the main query filters orders using both `customer_id` and `order_date`.

The `order_items(order_id)` index is relevant to the correlated subquery that retrieves items for each order.

### Potential Bottlenecks

The query contains two correlated subqueries.

The first retrieves and aggregates order items for each order.

The second retrieves and aggregates status history for each order.

These operations are associated with the outer order row through:

```sql
WHERE oi.order_id = o.order_id
```

and:

```sql
WHERE s.order_id = o.order_id
```

The presence of correlated subqueries is therefore an important area to investigate, but their presence alone does not prove that they are the performance bottleneck.

### Verification Principle

Performance assumptions must be tested with measurements.

The course recommends gathering performance metrics before and after changes, identifying actual bottlenecks, and focusing optimization on measurable improvements rather than perceived improvements.

### Measurement

PostgreSQL `EXPLAIN ANALYZE` should be used to inspect the actual execution plan and determine where database execution time is being spent.

The optimization should only be implemented after identifying evidence of the bottleneck.

### Optimization Decision

The final optimization will be selected based on measured evidence rather than simply choosing the change that appears theoretically faster.

## Initial Performance Findings

The database initialization script creates indexes for:

- `orders(customer_id, order_date)`
- `order_items(order_id)`
- `products(product_id)`

However, the `order_status_history(order_id)` column used by the correlated status-history subquery does not have a corresponding index.

The main query contains:

```sql
WHERE s.order_id = o.order_id
```

for the status-history lookup.

This makes `order_status_history(order_id)` a concrete candidate for optimization.

However, the absence of an index does not by itself prove that it is the dominant performance bottleneck.

The supplied database contains only four orders, so the dataset is too small to demonstrate meaningful large-scale performance characteristics.

Therefore, the correct approach is to use execution-plan analysis and measurement before deciding whether the index provides a meaningful improvement.
