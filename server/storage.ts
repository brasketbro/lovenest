import { 
  type User, type InsertUser,
  type Photo, type InsertPhoto,
  type Message, type InsertMessage,
  type Milestone, type InsertMilestone,
  type BucketItem, type InsertBucketItem,
  type Relationship, type InsertRelationship
} from "@shared/schema";

export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Photo methods
  getPhotos(): Promise<Photo[]>;
  getPhotoById(id: number): Promise<Photo | undefined>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;

  // Message methods
  getMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<boolean>;

  // Milestone methods
  getMilestones(): Promise<Milestone[]>;
  getMilestoneById(id: number): Promise<Milestone | undefined>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  deleteMilestone(id: number): Promise<boolean>;

  // Bucket list methods
  getBucketItems(): Promise<BucketItem[]>;
  getBucketItemById(id: number): Promise<BucketItem | undefined>;
  createBucketItem(bucketItem: InsertBucketItem): Promise<BucketItem>;
  updateBucketItem(id: number, bucketItem: Partial<InsertBucketItem>): Promise<BucketItem | undefined>;
  toggleBucketItemCompletion(id: number, completed: boolean, completedDate?: string): Promise<BucketItem | undefined>;
  deleteBucketItem(id: number): Promise<boolean>;

  // Relationship methods
  getRelationship(): Promise<Relationship | undefined>;
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  updateRelationship(id: number, relationship: Partial<InsertRelationship>): Promise<Relationship | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private photos: Map<number, Photo>;
  private messages: Map<number, Message>;
  private milestones: Map<number, Milestone>;
  private bucketItems: Map<number, BucketItem>;
  private relationships: Map<number, Relationship>;

  private userCurrentId: number;
  private photoCurrentId: number;
  private messageCurrentId: number;
  private milestoneCurrentId: number;
  private bucketItemCurrentId: number;
  private relationshipCurrentId: number;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
    this.messages = new Map();
    this.milestones = new Map();
    this.bucketItems = new Map();
    this.relationships = new Map();

    this.userCurrentId = 1;
    this.photoCurrentId = 1;
    this.messageCurrentId = 1;
    this.milestoneCurrentId = 1;
    this.bucketItemCurrentId = 1;
    this.relationshipCurrentId = 1;

    // Add initial data
    this.initializeData();
  }

  private initializeData() {
    // Create default relationship
    this.createRelationship({
      startDate: "2024-03-10",
      partner1: "Mehak",
      partner2: "Swapnil"
    });

    // Add initial milestones
    this.createMilestone({
      title: "Started Talking",
      date: "2024-03-10",
      description: "We met on a dating app and started talking."
    });

    this.createMilestone({
      title: "Instagram Connection",
      date: "2024-03-13",
      description: "We moved our conversation to Instagram."
    });

    this.createMilestone({
      title: "Official Relationship",
      date: "2024-03-15",
      description: "Swapnil proposed and asked Mehak to be his girlfriend. She said yes!"
    });

    // No initial bucket list items - users will add their own

    // No initial photos - user will add their own

    // No initial messages - users will add their own
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Photo methods
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPhotoById(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.photoCurrentId++;
    const photo: Photo = { 
      ...insertPhoto, 
      id, 
      createdAt: new Date(),
      caption: insertPhoto.caption || null
    };
    this.photos.set(id, photo);
    return photo;
  }

  async updatePhoto(id: number, updateData: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;

    const updatedPhoto: Photo = { 
      ...photo,
      ...updateData
    };
    this.photos.set(id, updatedPhoto);
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    return this.photos.delete(id);
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.messages.set(id, message);
    return message;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Milestone methods
  async getMilestones(): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getMilestoneById(id: number): Promise<Milestone | undefined> {
    return this.milestones.get(id);
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = this.milestoneCurrentId++;
    const milestone: Milestone = { 
      ...insertMilestone, 
      id, 
      createdAt: new Date(),
      description: insertMilestone.description || null 
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    return this.milestones.delete(id);
  }

  // Bucket list methods
  async getBucketItems(): Promise<BucketItem[]> {
    return Array.from(this.bucketItems.values()).sort((a, b) => {
      // Sort completed items to the top
      if (a.completed !== b.completed) {
        return a.completed ? -1 : 1;
      }
      // Then sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getBucketItemById(id: number): Promise<BucketItem | undefined> {
    return this.bucketItems.get(id);
  }

  async createBucketItem(insertBucketItem: InsertBucketItem): Promise<BucketItem> {
    const id = this.bucketItemCurrentId++;
    // Explicitly create object to ensure all fields are set
    const bucketItem: BucketItem = { 
      id, 
      title: insertBucketItem.title,
      createdAt: new Date(),
      targetDate: insertBucketItem.targetDate || null,
      notes: insertBucketItem.notes || null,
      completed: insertBucketItem.completed ?? false,
      completedDate: insertBucketItem.completedDate || null
    };
    this.bucketItems.set(id, bucketItem);
    return bucketItem;
  }

  async updateBucketItem(id: number, updateData: Partial<InsertBucketItem>): Promise<BucketItem | undefined> {
    const bucketItem = this.bucketItems.get(id);
    if (!bucketItem) return undefined;

    const updatedBucketItem: BucketItem = { 
      ...bucketItem,
      ...updateData
    };
    this.bucketItems.set(id, updatedBucketItem);
    return updatedBucketItem;
  }

  async toggleBucketItemCompletion(id: number, completed: boolean, completedDate?: string): Promise<BucketItem | undefined> {
    const bucketItem = this.bucketItems.get(id);
    if (!bucketItem) return undefined;

    const updatedBucketItem: BucketItem = { 
      ...bucketItem,
      completed,
      completedDate: completed ? (completedDate !== undefined ? completedDate : new Date().toISOString().split('T')[0]) : null
    };
    this.bucketItems.set(id, updatedBucketItem);
    return updatedBucketItem;
  }

  async deleteBucketItem(id: number): Promise<boolean> {
    return this.bucketItems.delete(id);
  }

  // Relationship methods
  async getRelationship(): Promise<Relationship | undefined> {
    return Array.from(this.relationships.values())[0];
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    const id = this.relationshipCurrentId++;
    const relationship: Relationship = { 
      ...insertRelationship, 
      id 
    };
    this.relationships.set(id, relationship);
    return relationship;
  }

  async updateRelationship(id: number, updateData: Partial<InsertRelationship>): Promise<Relationship | undefined> {
    const relationship = this.relationships.get(id);
    if (!relationship) return undefined;

    const updatedRelationship: Relationship = { 
      ...relationship,
      ...updateData
    };
    this.relationships.set(id, updatedRelationship);
    return updatedRelationship;
  }
}

export const storage = new MemStorage();
