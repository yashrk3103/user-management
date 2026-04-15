import { User } from '../types';

// Mock users database
export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2022-07-04T10:00:00Z',
    updatedAt: '2024-03-04T15:30:00Z',
    lastActive: '2024-03-04T15:30:00Z',
    createdBy: 'System',
    updatedBy: 'John Admin',
  },
  {
    _id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2022-08-15T10:00:00Z',
    updatedAt: '2024-03-03T12:00:00Z',
    lastActive: '2024-03-03T12:00:00Z',
    createdBy: 'John Admin',
    updatedBy: 'Sarah Manager',
  },
  {
    _id: '3',
    name: 'Mike User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    lastActive: '2024-03-01T09:00:00Z',
    createdBy: 'Sarah Manager',
    updatedBy: 'Mike User',
  },
  {
    _id: '4',
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2022-09-10T10:00:00Z',
    updatedAt: '2024-02-28T14:20:00Z',
    lastActive: '2024-02-28T14:20:00Z',
    createdBy: 'John Admin',
    updatedBy: 'Emma Thompson',
  },
  {
    _id: '5',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2023-02-14T10:00:00Z',
    updatedAt: '2024-02-27T11:15:00Z',
    lastActive: '2024-02-27T11:15:00Z',
    createdBy: 'John Admin',
    updatedBy: 'Robert Chen',
  },
  {
    _id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-03-22T10:00:00Z',
    updatedAt: '2024-02-26T16:45:00Z',
    lastActive: '2024-02-26T16:45:00Z',
    createdBy: 'Sarah Manager',
    updatedBy: 'Lisa Anderson',
  },
  {
    _id: '7',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-04-05T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastActive: '2024-01-15T10:00:00Z',
    createdBy: 'Sarah Manager',
    updatedBy: 'David Wilson',
  },
  {
    _id: '8',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2023-05-18T10:00:00Z',
    updatedAt: '2024-02-25T13:30:00Z',
    lastActive: '2024-02-25T13:30:00Z',
    createdBy: 'John Admin',
    updatedBy: 'Jennifer Lee',
  },
  {
    _id: '9',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-06-12T10:00:00Z',
    updatedAt: '2024-02-24T08:00:00Z',
    lastActive: '2024-02-24T08:00:00Z',
    createdBy: 'Sarah Manager',
    updatedBy: 'Michael Brown',
  },
  {
    _id: '10',
    name: 'Jessica Garcia',
    email: 'jessica.garcia@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-07-30T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
    lastActive: '2023-12-20T10:00:00Z',
    createdBy: 'Robert Chen',
    updatedBy: 'Jessica Garcia',
  },
];

// Demo credentials
export const demoCredentials = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
  { email: 'manager@example.com', password: 'manager123', role: 'manager' as const },
  { email: 'user@example.com', password: 'user123', role: 'user' as const },
];

// Get mock users from localStorage or use default
export const getMockUsers = (): User[] => {
  const stored = localStorage.getItem('mockUsers');
  if (stored) {
    return JSON.parse(stored);
  }
  return [...mockUsers];
};

// Save mock users to localStorage
export const saveMockUsers = (users: User[]): void => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};
