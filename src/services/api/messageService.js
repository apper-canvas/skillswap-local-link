import { delay } from '../index';
import messageData from '../mockData/messages.json';

class MessageService {
  constructor() {
    this.messages = [...messageData];
  }

  async getAll() {
    await delay(300);
    return [...this.messages];
  }

  async getById(id) {
    await delay(250);
    const message = this.messages.find(m => m.id === id);
    if (!message) throw new Error('Message not found');
    return { ...message };
  }

  async create(messageData) {
    await delay(200); // Faster for real-time chat feel
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...messageData
    };
    this.messages.push(newMessage);
    return { ...newMessage };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.messages[index] = { ...this.messages[index], ...updates };
    return { ...this.messages[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.messages.splice(index, 1);
    return true;
  }
}

export default new MessageService();