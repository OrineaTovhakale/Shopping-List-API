import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './models/item';

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
let items: Item[] = [];

app.use(express.json());

// Consistent response structure
interface ApiResponse {
  data: any;
  error: string | null;
}

// Error handling middleware
interface ApiError extends Error {
  status?: number;
}

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    data: null,
    error: err.message || 'Internal server error',
  });
};

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ data: { message: 'Shopping List API is running!' }, error: null });
});

// Get all items
app.get('/items', (req: Request, res: Response) => {
  res.json({ data: items, error: null });
});

// Add a new item
app.post('/items', (req: Request, res: Response, next: NextFunction) => {
  const { name, quantity } = req.body;

  // Validation
  if (!name || !quantity) {
    const err: ApiError = new Error('Name and quantity are required');
    err.status = 400;
    return next(err);
  }

  const newItem: Item = {
    id: uuidv4(),
    name,
    quantity,
    purchased: false,
  };

  items.push(newItem);
  res.status(201).json({ data: newItem, error: null });
});

// Get a single item by ID
app.get('/items/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);

  if (!item) {
    const err: ApiError = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.json({ data: item, error: null });
});

// Update an item by ID
app.put('/items/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, quantity, purchased } = req.body;

  // Validation: At least one field must be provided
  if (!name && !quantity && purchased === undefined) {
    const err: ApiError = new Error('At least one field (name, quantity, or purchased) must be provided');
    err.status = 400;
    return next(err);
  }

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    const err: ApiError = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  // Update only provided fields
  const updatedItem: Item = {
    ...items[itemIndex],
    ...(name && { name }),
    ...(quantity && { quantity }),
    ...(purchased !== undefined && { purchased }),
  };

  items[itemIndex] = updatedItem;
  res.json({ data: updatedItem, error: null });
});

// Delete an item by ID
app.delete('/items/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    const err: ApiError = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  items.splice(itemIndex, 1);
  res.status(204).json({ data: null, error: null });
});

// Use error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});