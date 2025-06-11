import { delay } from '../index';
import ratingData from '../mockData/ratings.json';

class RatingService {
  constructor() {
    this.ratings = [...ratingData];
  }

  async getAll() {
    await delay(300);
    return [...this.ratings];
  }

  async getById(id) {
    await delay(250);
    const rating = this.ratings.find(r => r.id === id);
    if (!rating) throw new Error('Rating not found');
    return { ...rating };
  }

  async create(ratingData) {
    await delay(400);
    const newRating = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...ratingData
    };
    this.ratings.push(newRating);
    return { ...newRating };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.ratings.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rating not found');
    
    this.ratings[index] = { ...this.ratings[index], ...updates };
    return { ...this.ratings[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.ratings.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rating not found');
    
    this.ratings.splice(index, 1);
    return true;
  }
}

export default new RatingService();