Shopping List API

A RESTful API for managing a shopping list, built with Node.js, TypeScript, and Express. Users can add, view, update, and delete items using HTTP requests.

Table of Contents





Setup



API Endpoints



Response Format



Error Codes



Testing

Setup





Clone the repository:
git clone https://github.com/<your-username>/shopping-list-api.git
cd shopping-list-api


Install dependencies:
npm install

Start the server:
npm run dev

The server runs on http://localhost:3000.


API Endpoints

GET /
Description: Check if the API is running.
Response:
{
  "data": { "message": "Shopping List API is running!" },
  "error": null
}


GET /items
Description: Retrieve all items in the shopping list.
Response (200):
{
  "data": [
    {
      "id": "<uuid>",
      "name": "Milk",
      "quantity": "2L",
      "purchased": false
    },
    ...
  ],
  "error": null
}


POST /items
Description: Add a new item to the shopping list.
Request Body:
{
  "name": "Milk",
  "quantity": "2L"
}

Response (201):
{
  "data": {
    "id": "<uuid>",
    "name": "Milk",
    "quantity": "2L",
    "purchased": false
  },
  "error": null
}


Errors:
400: {"data": null, "error": "Name and quantity are required"}



GET /items/:id
Description: Retrieve a single item by ID.
Response (200):
{
  "data": {
    "id": "<uuid>",
    "name": "Milk",
    "quantity": "2L",
    "purchased": false
  },
  "error": null
}

Errors:
404: {"data": null, "error": "Item not found"}


PUT /items/:id
Description: Update an item's name, quantity, or purchased status.
Request Body:
{
  "name": "Whole Milk",
  "quantity": "1L",
  "purchased": true
}

Response (200):
{
  "data": {
    "id": "<uuid>",
    "name": "Whole Milk",
    "quantity": "1L",
    "purchased": true
  },
  "error": null
}


Errors:

400: {"data": null, "error": "At least one field (name, quantity, or purchased) must be provided"}
404: {"data": null, "error": "Item not found"}


DELETE /items/:id
Description: Delete an item by ID.

Response (204):
{"data": null, "error": null}


Errors:
404: {"data": null, "error": "Item not found"}


Response Format

All responses follow this JSON structure:
{
  "data": any,
  "error": string | null
}


Error Codes

200: OK (successful GET or PUT).
201: Created (successful POST).
204: No Content (successful DELETE).
400: Bad Request (invalid input).
404: Not Found (item or resource not found).
500: Internal Server Error (unexpected errors).


Testing

Test the API using Postman:

Create a collection named "Shopping List API Tests".
Add requests for each endpoint as described above.
Save and export the collection for reuse.