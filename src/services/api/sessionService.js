import { delay } from '../index';
import sessionData from '../mockData/sessions.json';

class SessionService {
  constructor() {
    this.sessions = [...sessionData];
  }

  async getAll() {
    await delay(300);
    return [...this.sessions];
  }

  async getById(id) {
    await delay(250);
    const session = this.sessions.find(s => s.id === id);
    if (!session) throw new Error('Session not found');
    return { ...session };
  }

  async create(sessionData) {
    await delay(400);
    const newSession = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      credits: 1,
      ...sessionData
    };
    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    this.sessions[index] = { ...this.sessions[index], ...updates };
    return { ...this.sessions[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    this.sessions.splice(index, 1);
    return true;
  }
}

export default new SessionService();