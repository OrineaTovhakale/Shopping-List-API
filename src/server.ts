import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './models/item';

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
let items: Item[] = [];

app.use(express.json());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Shopping List API is running!' });
});

// Get all items
app.get('/items', (req: Request, res: Response) => {
  res.json(items);
});

// Add a new item
app.post('/items', (req: Request, res: Response) => {
  const { name, quantity } = req.body;

  // Validation
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }

  const newItem: Item = {
    id: uuidv4(),
    name,
    quantity,
    purchased: false,
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// Get a single item by ID
app.get('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json(item);
});

// Update an item by ID
app.put('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, purchased } = req.body;

  // Validation: At least one field must be provided
  if (!name && !quantity && purchased === undefined) {
    return res.status(400).json({ error: 'At least one field (name, quantity, or purchased) must be provided' });
  }

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Update only provided fields
  const updatedItem: Item = {
    ...items[itemIndex],
    ...(name && { name }),
    ...(quantity && { quantity }),
    ...(purchased !== undefined && { purchased }),
  };

  items[itemIndex] = updatedItem;
  res.json(updatedItem);
});

// Delete an item by ID
app.delete('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});