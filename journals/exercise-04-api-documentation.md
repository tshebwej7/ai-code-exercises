# Exercise 4 — API Documentation

## Selected API Endpoint

**Method:** GET

**Endpoint:** `/api/products`

**Technology:** JavaScript / Express API

---

# Part 1 — Original Endpoint

The selected API endpoint retrieves products and supports filtering, sorting, and pagination.

It accepts the following query parameters:

- `category`
- `minPrice`
- `maxPrice`
- `sort`
- `order`
- `page`
- `limit`
- `inStock`

---

# Part 2 — Comprehensive API Documentation

## GET /api/products

### Description

Retrieves products from the system.

The endpoint supports filtering products by category and price, sorting the results, pagination, and optionally limiting results to products that are currently in stock.

---

## Query Parameters

| Parameter  | Type    | Default     | Description                                                        |
| ---------- | ------- | ----------- | ------------------------------------------------------------------ |
| `category` | string  | —           | Filters products by category                                       |
| `minPrice` | number  | —           | Minimum product price                                              |
| `maxPrice` | number  | —           | Maximum product price                                              |
| `sort`     | string  | `createdAt` | Field used for sorting                                             |
| `order`    | string  | `desc`      | Sorting direction                                                  |
| `page`     | integer | `1`         | Page number                                                        |
| `limit`    | integer | `20`        | Number of products per page                                        |
| `inStock`  | boolean | —           | When true, only products with stock greater than zero are returned |

### Parameter Constraints

`page` must be at least `1`.

`limit` must be between `1` and `100`.

`order` accepts:

```text
asc
desc
```

---

# Successful Response

### HTTP 200

The successful response contains:

```json
{
  "products": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

## Product Object

A product contains:

| Field           | Type             | Description               |
| --------------- | ---------------- | ------------------------- |
| `_id`           | string           | Unique product identifier |
| `name`          | string           | Product name              |
| `description`   | string           | Product description       |
| `price`         | number           | Product price             |
| `category`      | string           | Product category          |
| `stockQuantity` | integer          | Available quantity        |
| `createdAt`     | date-time string | Creation timestamp        |
| `updatedAt`     | date-time string | Last update timestamp     |

---

## Pagination Object

The pagination object contains:

- `total` — total number of products
- `page` — current page number
- `limit` — number of items per page
- `pages` — total number of pages

---

# Error Response

### HTTP 500

The documented server error response contains:

```json
{
  "error": "string",
  "message": "string"
}
```

The available information does not specify additional error status codes or authentication requirements.

---

# Example Request

```http
GET /api/products
```

---

# Example With Filters

```http
GET /api/products?category=electronics&minPrice=100&maxPrice=1000&sort=price&order=asc&page=1&limit=20&inStock=true
```

---

# Part 3 — OpenAPI Representation

```yaml
openapi: 3.0.0
info:
  title: Product API
  version: 1.0.0
  description: API endpoint for retrieving products with filtering, sorting, and pagination.

paths:
  /api/products:
    get:
      summary: Retrieve products
      description: Retrieve products with filtering, sorting, and pagination.
      parameters:
        - name: category
          in: query
          schema:
            type: string
          description: Filter products by category

        - name: minPrice
          in: query
          schema:
            type: number
          description: Filter products with price greater than or equal to this value

        - name: maxPrice
          in: query
          schema:
            type: number
          description: Filter products with price less than or equal to this value

        - name: sort
          in: query
          schema:
            type: string
            default: createdAt
          description: Field to sort by

        - name: order
          in: query
          schema:
            type: string
            enum:
              - asc
              - desc
            default: desc
          description: Sort order

        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
          description: Page number

        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
          description: Number of items per page

        - name: inStock
          in: query
          schema:
            type: boolean
          description: When true, only products with stock greater than zero are returned

      responses:
        "200":
          description: Successful operation
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: "#/components/schemas/Product"

                  pagination:
                    $ref: "#/components/schemas/Pagination"

        "500":
          description: Server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

components:
  schemas:
    Product:
      type: object
      properties:
        _id:
          type: string
          description: Unique identifier for the product

        name:
          type: string
          description: Product name

        description:
          type: string
          description: Product description

        price:
          type: number
          format: float
          description: Product price

        category:
          type: string
          description: Product category

        stockQuantity:
          type: integer
          description: Available quantity in stock

        createdAt:
          type: string
          format: date-time
          description: Creation timestamp

        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp

    Pagination:
      type: object
      properties:
        total:
          type: integer
          description: Total number of items

        page:
          type: integer
          description: Current page number

        limit:
          type: integer
          description: Items per page

        pages:
          type: integer
          description: Total number of pages

    Error:
      type: object
      properties:
        error:
          type: string
          description: Error type

        message:
          type: string
          description: Error message
```

---

# Part 4 — Developer Usage Guide

## Basic Request

To retrieve products without additional filters:

```http
GET /api/products
```

The endpoint uses its documented defaults for sorting and pagination.

---

## Filter by Category

Use the `category` parameter:

```http
GET /api/products?category=electronics
```

---

## Filter by Price

Use `minPrice` and `maxPrice`:

```http
GET /api/products?minPrice=100&maxPrice=1000
```

---

## Sort Results

Specify the field and order:

```http
GET /api/products?sort=price&order=asc
```

The supported order values are:

```text
asc
desc
```

---

## Pagination

Specify the page and number of results:

```http
GET /api/products?page=2&limit=20
```

The page number must be at least 1.

The limit must be between 1 and 100.

---

## Retrieve Only Products in Stock

Use:

```http
GET /api/products?inStock=true
```

This requests products whose stock quantity is greater than zero.

---

## Combining Filters

Multiple query parameters can be combined.

Example:

```http
GET /api/products?category=electronics&minPrice=100&maxPrice=1000&sort=price&order=asc&page=1&limit=20&inStock=true
```

This combines:

- category filtering;
- minimum price;
- maximum price;
- price sorting;
- ascending order;
- pagination;
- in-stock filtering.

---

# Troubleshooting

### Invalid page

The `page` parameter must be at least `1`.

### Invalid limit

The `limit` parameter must be between `1` and `100`.

### Invalid order

The `order` parameter accepts only:

```text
asc
desc
```

### Server error

A server error is documented as HTTP `500`.

The response contains:

```json
{
  "error": "string",
  "message": "string"
}
```

---

# Exercise Reflection

## Which parts of the API were most challenging to document?

The most challenging part was making sure that every query parameter, default value, constraint, and response field was represented accurately without inventing undocumented behavior.

The distinction between the endpoint documentation and the OpenAPI representation also required careful attention.

---

## How did I adjust my prompts?

The first prompt focused on comprehensive human-readable documentation.

The second prompt specifically required conversion into OpenAPI 3.0 YAML.

The third prompt changed the perspective again by asking for a practical guide aimed at a junior developer.

Changing the requested output format and audience helped produce different types of useful documentation from the same API information.

---

## Which documentation format was most effective?

The human-readable Markdown documentation was easiest to understand as a developer because it presents the endpoint, parameters, responses and examples directly.

The OpenAPI format was more structured and machine-readable.

The developer guide was most useful from a practical API-consumer perspective because it demonstrated how the endpoint could be used.

---

## How would I incorporate this approach into my development workflow?

I could use AI to create an initial documentation draft from an existing endpoint, then verify every detail against the actual implementation.

For APIs, I could maintain a machine-readable OpenAPI specification alongside human-readable documentation and usage examples.

The important lesson is that AI-generated documentation must be reviewed against the source rather than accepted without verification.

---

# Final Learning Points

This exercise demonstrated that the same API can be documented from several perspectives.

A comprehensive reference document helps developers understand the API.

An OpenAPI specification provides a structured representation suitable for tools and API documentation systems.

A developer usage guide focuses on practical consumption of the endpoint.

The exercise also reinforced the importance of providing precise information to AI and verifying the generated documentation against the source material.
