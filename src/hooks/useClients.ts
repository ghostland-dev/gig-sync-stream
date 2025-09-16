import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  platform: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  status: 'active' | 'inactive' | 'blocked';
  starred: boolean;
  createdAt: string;
  lastContact: string;
  totalProjects: number;
  totalRevenue: number;
  averageRating: number;
  notes: string;
  tags: string[];
  address?: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  social?: {
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  budget: number;
  paidAmount: number;
  startDate: string;
  endDate?: string;
  deadline: string;
  platform: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  tags: string[];
  deliverables: string[];
  communications: Array<{
    id: string;
    type: 'message' | 'meeting' | 'call' | 'email';
    date: string;
    subject: string;
    notes: string;
  }>;
}

const getDefaultClients = (): Client[] => [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-0123',
    platform: 'fiverr',
    status: 'active',
    starred: true,
    createdAt: '2025-01-15',
    lastContact: '2025-04-05',
    totalProjects: 5,
    totalRevenue: 12500,
    averageRating: 4.8,
    notes: 'Excellent client, always pays on time. Prefers detailed project briefs.',
    tags: ['vip', 'recurring', 'web-dev'],
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      zipCode: '94105'
    },
    social: {
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.com'
    }
  },
  {
    id: '2',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    phone: '+44 20 7946 0958',
    platform: 'upwork',
    status: 'active',
    starred: false,
    createdAt: '2025-02-20',
    lastContact: '2025-04-03',
    totalProjects: 3,
    totalRevenue: 8750,
    averageRating: 4.6,
    notes: 'Marketing agency owner. Usually has multiple projects running.',
    tags: ['agency', 'marketing', 'design'],
    address: {
      street: '45 Business Road',
      city: 'London',
      country: 'UK',
      zipCode: 'SW1A 1AA'
    },
    social: {
      website: 'https://smithmarketing.co.uk'
    }
  }
];

const getDefaultProjects = (): Project[] => [
  {
    id: '1',
    clientId: '1',
    title: 'E-commerce Website Development',
    description: 'Build a modern e-commerce platform with React and Node.js',
    status: 'active',
    budget: 5000,
    paidAmount: 2500,
    startDate: '2025-03-01',
    deadline: '2025-05-01',
    platform: 'fiverr',
    tags: ['react', 'nodejs', 'ecommerce'],
    deliverables: ['Homepage design', 'Product catalog', 'Shopping cart', 'Payment integration'],
    communications: [
      {
        id: '1',
        type: 'message',
        date: '2025-04-05',
        subject: 'Project update',
        notes: 'Discussed payment integration requirements'
      }
    ]
  }
];

export const useClients = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', getDefaultClients());
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', getDefaultProjects());
  const [isLoading, setIsLoading] = useState(false);

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'totalProjects' | 'totalRevenue' | 'averageRating'>): Promise<Client> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalProjects: 0,
      totalRevenue: 0,
      averageRating: 0,
    };

    setClients(prev => [newClient, ...prev]);
    setIsLoading(false);
    return newClient;
  };

  const updateClient = async (clientId: string, updates: Partial<Client>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    ));
    setIsLoading(false);
  };

  const deleteClient = async (clientId: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    setClients(prev => prev.filter(client => client.id !== clientId));
    setProjects(prev => prev.filter(project => project.clientId !== clientId));
    setIsLoading(false);
  };

  const toggleClientStar = (clientId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, starred: !client.starred } : client
    ));
  };

  const getClient = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
  };

  const getClientProjects = (clientId: string): Project[] => {
    return projects.filter(project => project.clientId === clientId);
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'communications'>): Promise<Project> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      communications: []
    };

    setProjects(prev => [newProject, ...prev]);
    
    // Update client stats
    setClients(prev => prev.map(client => {
      if (client.id === projectData.clientId) {
        return {
          ...client,
          totalProjects: client.totalProjects + 1,
          totalRevenue: client.totalRevenue + projectData.budget
        };
      }
      return client;
    }));

    setIsLoading(false);
    return newProject;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
    setIsLoading(false);
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    // Update client stats
    setClients(prev => prev.map(client => {
      if (client.id === project.clientId) {
        return {
          ...client,
          totalProjects: Math.max(0, client.totalProjects - 1),
          totalRevenue: Math.max(0, client.totalRevenue - project.budget)
        };
      }
      return client;
    }));

    setIsLoading(false);
  };

  const searchClients = (query: string): Client[] => {
    const searchTerm = query.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      client.notes.toLowerCase().includes(searchTerm)
    );
  };

  const getClientsByPlatform = (platform: string): Client[] => {
    return clients.filter(client => client.platform === platform);
  };

  const getStarredClients = (): Client[] => {
    return clients.filter(client => client.starred);
  };

  const getClientStats = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
    const averageRevenue = totalClients > 0 ? totalRevenue / totalClients : 0;
    
    return {
      totalClients,
      activeClients,
      totalRevenue,
      averageRevenue,
      platformBreakdown: {
        fiverr: clients.filter(c => c.platform === 'fiverr').length,
        upwork: clients.filter(c => c.platform === 'upwork').length,
        malt: clients.filter(c => c.platform === 'malt').length,
        codeur: clients.filter(c => c.platform === 'codeur').length,
      }
    };
  };

  return {
    clients,
    projects,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    toggleClientStar,
    getClient,
    getClientProjects,
    addProject,
    updateProject,
    deleteProject,
    searchClients,
    getClientsByPlatform,
    getStarredClients,
    getClientStats
  };
};