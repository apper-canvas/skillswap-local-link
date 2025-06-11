import { delay } from '../index';
import skillData from '../mockData/skills.json';

class SkillService {
  constructor() {
    this.skills = [...skillData];
  }

  async getAll() {
    await delay(300);
    return [...this.skills];
  }

  async getById(id) {
    await delay(250);
    const skill = this.skills.find(s => s.id === id);
    if (!skill) throw new Error('Skill not found');
    return { ...skill };
  }

  async create(skillData) {
    await delay(400);
    const newSkill = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...skillData
    };
    this.skills.push(newSkill);
    return { ...newSkill };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.skills.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Skill not found');
    
    this.skills[index] = { ...this.skills[index], ...updates };
    return { ...this.skills[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.skills.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Skill not found');
    
    this.skills.splice(index, 1);
    return true;
  }
}

export default new SkillService();