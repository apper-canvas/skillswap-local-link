import { delay } from '../index';
import matchData from '../mockData/matches.json';

class MatchService {
  constructor() {
    this.matches = [...matchData];
  }

  async getAll() {
    await delay(300);
    return [...this.matches];
  }

  async getById(id) {
    await delay(250);
    const match = this.matches.find(m => m.id === id);
    if (!match) throw new Error('Match not found');
    return { ...match };
  }

  async create(matchData) {
    await delay(400);
    const newMatch = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...matchData
    };
    this.matches.push(newMatch);
    return { ...newMatch };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Match not found');
    
    this.matches[index] = { ...this.matches[index], ...updates };
    return { ...this.matches[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Match not found');
    
    this.matches.splice(index, 1);
    return true;
  }
}

export default new MatchService();