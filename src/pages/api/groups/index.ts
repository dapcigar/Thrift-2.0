import type { NextApiRequest, NextApiResponse } from 'next';
import { SavingsGroup } from '@/types/dashboard';

// This is a mock database for demonstration
let groups: SavingsGroup[] = [
  {
    id: '1',
    name: 'Family Savings Circle',
    description: 'Monthly family savings group',
    memberCount: 5,
    contributionAmount: 100,
    frequency: 'monthly',
    totalSaved: 1500,
    nextPayoutDate: '2024-01-15',
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'coordinator',
        joinDate: '2024-01-01'
      }
    ]
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(groups);

    case 'POST':
      try {
        const newGroup = {
          id: String(groups.length + 1),
          ...req.body,
          totalSaved: 0,
          nextPayoutDate: req.body.startDate,
          members: []
        };
        groups.push(newGroup);
        return res.status(201).json(newGroup);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid group data' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
