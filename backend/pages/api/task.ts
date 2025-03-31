import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize CORS middleware
const cors = Cors({
  origin: 'http://localhost:3001', // Permite requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Function to adapt middleware for Next.js
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

interface TaskData {
  title: string;
  description?: string;
  status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany();
    return res.json(tasks);
  }

  if (req.method === 'POST') {
    const { title, description, status }: TaskData = req.body;
    const newTask = await prisma.task.create({
      data: { title, description, status },
    });
    return res.status(201).json(newTask);
  }

  if (req.method === 'PUT') {
    const { id, title, description, status }: TaskData & { id: number } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });
    return res.status(200).json(updatedTask);
  }

  if (req.method === 'DELETE') {
    const id = parseInt(req.query.id as string, 10);
    if (!id) return res.status(400).json({ error: 'ID is required' });

    await prisma.task.delete({
      where: { id },
    });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
