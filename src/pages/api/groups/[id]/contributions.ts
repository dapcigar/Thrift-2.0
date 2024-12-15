import type { NextApiRequest, NextApiResponse } from 'next';

// Mock database
const contributions = [
  {
    id: '1',
    groupId: '1',
    userId: '1',
    memberName: 'John Doe',
    amount: 100,
    dueDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    groupId: '1',
    userId: '2',
    memberName: 'Jane Smith',
    amount: 100,
    dueDate: '2024-01-15',
    status: 'paid',
    paidDate: '2024-01-10'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: groupId } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const groupContributions = contributions.filter(c => c.groupId === groupId);
    
    // Calculate statistics
    const stats = {
      totalContributions: groupContributions.length,
      paidContributions: groupContributions.filter(c => c.status === 'paid').length,
      totalAmount: groupContributions.reduce((sum, c) => sum + c.amount, 0),
      paidAmount: groupContributions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0)
    };

    return res.status(200).json({
      contributions: groupContributions,
      stats
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
