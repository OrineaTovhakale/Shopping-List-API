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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});