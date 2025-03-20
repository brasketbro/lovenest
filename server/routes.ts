import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPhotoSchema, 
  insertMessageSchema, 
  insertMilestoneSchema, 
  insertBucketItemSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();

  // Error handler for validation errors
  const handleValidationError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // Relationship endpoints
  apiRouter.get("/relationship", async (_req, res) => {
    try {
      const relationship = await storage.getRelationship();
      res.json(relationship);
    } catch (err) {
      res.status(500).json({ message: "Failed to get relationship data" });
    }
  });

  // Photo endpoints
  apiRouter.get("/photos", async (_req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (err) {
      res.status(500).json({ message: "Failed to get photos" });
    }
  });

  apiRouter.get("/photos/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const photos = await storage.getPhotosByCategory(category);
      res.json(photos);
    } catch (err) {
      res.status(500).json({ message: "Failed to get photos by category" });
    }
  });

  apiRouter.post("/photos", async (req, res) => {
    try {
      const photo = insertPhotoSchema.parse(req.body);
      const newPhoto = await storage.createPhoto(photo);
      res.status(201).json(newPhoto);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.put("/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const updateData = insertPhotoSchema.partial().parse(req.body);
      const updatedPhoto = await storage.updatePhoto(id, updateData);
      
      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(updatedPhoto);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.delete("/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const success = await storage.deletePhoto(id);
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Message endpoints
  apiRouter.get("/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  apiRouter.post("/messages", async (req, res) => {
    try {
      const message = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(message);
      res.status(201).json(newMessage);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.delete("/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const success = await storage.deleteMessage(id);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Milestone endpoints
  apiRouter.get("/milestones", async (_req, res) => {
    try {
      const milestones = await storage.getMilestones();
      res.json(milestones);
    } catch (err) {
      res.status(500).json({ message: "Failed to get milestones" });
    }
  });

  apiRouter.post("/milestones", async (req, res) => {
    try {
      const milestone = insertMilestoneSchema.parse(req.body);
      const newMilestone = await storage.createMilestone(milestone);
      res.status(201).json(newMilestone);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.delete("/milestones/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid milestone ID" });
      }

      const success = await storage.deleteMilestone(id);
      if (!success) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete milestone" });
    }
  });

  // Bucket list endpoints
  apiRouter.get("/bucket-items", async (_req, res) => {
    try {
      const bucketItems = await storage.getBucketItems();
      res.json(bucketItems);
    } catch (err) {
      res.status(500).json({ message: "Failed to get bucket list items" });
    }
  });

  apiRouter.post("/bucket-items", async (req, res) => {
    try {
      const bucketItem = insertBucketItemSchema.parse(req.body);
      const newBucketItem = await storage.createBucketItem(bucketItem);
      res.status(201).json(newBucketItem);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.put("/bucket-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bucket item ID" });
      }

      const updateData = insertBucketItemSchema.partial().parse(req.body);
      const updatedBucketItem = await storage.updateBucketItem(id, updateData);
      
      if (!updatedBucketItem) {
        return res.status(404).json({ message: "Bucket item not found" });
      }
      
      res.json(updatedBucketItem);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.put("/bucket-items/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bucket item ID" });
      }

      const { completed, completedDate } = z.object({
        completed: z.boolean(),
        completedDate: z.string().optional(),
      }).parse(req.body);

      const updatedBucketItem = await storage.toggleBucketItemCompletion(id, completed, completedDate);
      
      if (!updatedBucketItem) {
        return res.status(404).json({ message: "Bucket item not found" });
      }
      
      res.json(updatedBucketItem);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  apiRouter.delete("/bucket-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bucket item ID" });
      }

      const success = await storage.deleteBucketItem(id);
      if (!success) {
        return res.status(404).json({ message: "Bucket item not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete bucket item" });
    }
  });

  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
