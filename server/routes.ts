import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertScholarshipSchema,
  insertPostSchema,
  insertCategorySchema,
  insertLevelSchema,
  insertCountrySchema,
  insertTagSchema,
  insertSuccessStorySchema,
  insertSubscriberSchema,
  insertSeoSettingsSchema
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const MemorySessionStore = MemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fullsco-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
      store: new MemorySessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden: Admin access required" });
  };

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;
        
        return res.json(userResponse);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from response
    const userResponse = { ...req.user as any };
    delete userResponse.password;
    
    res.json(userResponse);
  });

  // User routes
  app.post("/api/users", isAdmin, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/users", isAdmin, async (req, res) => {
    const users = await storage.listUsers();
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const userCopy = { ...user };
      delete userCopy.password;
      return userCopy;
    });
    res.json(safeUsers);
  });

  // Category routes
  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/categories", async (req, res) => {
    const categories = await storage.listCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category = await storage.getCategory(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    try {
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, data);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const success = await storage.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  });

  // Level routes
  app.post("/api/levels", isAdmin, async (req, res) => {
    try {
      const data = insertLevelSchema.parse(req.body);
      const level = await storage.createLevel(data);
      res.status(201).json(level);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/levels", async (req, res) => {
    const levels = await storage.listLevels();
    res.json(levels);
  });

  // Country routes
  app.post("/api/countries", isAdmin, async (req, res) => {
    try {
      const data = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(data);
      res.status(201).json(country);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/countries", async (req, res) => {
    const countries = await storage.listCountries();
    res.json(countries);
  });

  // Scholarship routes
  app.post("/api/scholarships", isAdmin, async (req, res) => {
    try {
      const data = insertScholarshipSchema.parse(req.body);
      const scholarship = await storage.createScholarship(data);
      res.status(201).json(scholarship);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/scholarships", async (req, res) => {
    const { featured, country, level, category } = req.query;
    const filters: any = {};
    
    if (featured !== undefined) {
      filters.isFeatured = featured === "true";
    }
    
    if (country) {
      const countryId = parseInt(country as string);
      if (!isNaN(countryId)) {
        filters.countryId = countryId;
      }
    }
    
    if (level) {
      const levelId = parseInt(level as string);
      if (!isNaN(levelId)) {
        filters.levelId = levelId;
      }
    }
    
    if (category) {
      const categoryId = parseInt(category as string);
      if (!isNaN(categoryId)) {
        filters.categoryId = categoryId;
      }
    }
    
    const scholarships = await storage.listScholarships(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(scholarships);
  });

  app.get("/api/scholarships/featured", async (req, res) => {
    const scholarships = await storage.listScholarships({ isFeatured: true });
    res.json(scholarships);
  });

  app.get("/api/scholarships/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid scholarship ID" });
    }
    const scholarship = await storage.getScholarship(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.json(scholarship);
  });

  app.get("/api/scholarships/slug/:slug", async (req, res) => {
    const slug = req.params.slug;
    const scholarship = await storage.getScholarshipBySlug(slug);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.json(scholarship);
  });

  app.put("/api/scholarships/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid scholarship ID" });
    }
    try {
      const data = insertScholarshipSchema.partial().parse(req.body);
      const scholarship = await storage.updateScholarship(id, data);
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json(scholarship);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/scholarships/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid scholarship ID" });
    }
    const success = await storage.deleteScholarship(id);
    if (!success) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.json({ message: "Scholarship deleted successfully" });
  });

  // Post (article) routes
  app.post("/api/posts", isAdmin, async (req, res) => {
    try {
      const data = insertPostSchema.parse(req.body);
      const post = await storage.createPost(data);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/posts", async (req, res) => {
    const { featured, author } = req.query;
    const filters: any = {};
    
    if (featured !== undefined) {
      filters.isFeatured = featured === "true";
    }
    
    if (author) {
      const authorId = parseInt(author as string);
      if (!isNaN(authorId)) {
        filters.authorId = authorId;
      }
    }
    
    const posts = await storage.listPosts(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(posts);
  });

  app.get("/api/posts/featured", async (req, res) => {
    const posts = await storage.listPosts({ isFeatured: true });
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const post = await storage.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Increment view count
    await storage.incrementPostViews(id);
    
    // Get updated post with incremented view count
    const updatedPost = await storage.getPost(id);
    res.json(updatedPost);
  });

  app.get("/api/posts/slug/:slug", async (req, res) => {
    const slug = req.params.slug;
    const post = await storage.getPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Increment view count
    await storage.incrementPostViews(post.id);
    
    // Get updated post with incremented view count
    const updatedPost = await storage.getPost(post.id);
    res.json(updatedPost);
  });

  app.put("/api/posts/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    try {
      const data = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(id, data);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/posts/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const success = await storage.deletePost(id);
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  });

  // Tag routes
  app.post("/api/tags", isAdmin, async (req, res) => {
    try {
      const data = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(data);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/tags", async (req, res) => {
    const tags = await storage.listTags();
    res.json(tags);
  });

  // Post-Tag relationship routes
  app.post("/api/posts/:postId/tags/:tagId", isAdmin, async (req, res) => {
    const postId = parseInt(req.params.postId);
    const tagId = parseInt(req.params.tagId);
    
    if (isNaN(postId) || isNaN(tagId)) {
      return res.status(400).json({ message: "Invalid post ID or tag ID" });
    }
    
    const post = await storage.getPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const tag = await storage.getTag(tagId);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    const postTag = await storage.addTagToPost(postId, tagId);
    res.status(201).json(postTag);
  });

  app.get("/api/posts/:postId/tags", async (req, res) => {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const post = await storage.getPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const tags = await storage.getPostTags(postId);
    res.json(tags);
  });

  app.delete("/api/posts/:postId/tags/:tagId", isAdmin, async (req, res) => {
    const postId = parseInt(req.params.postId);
    const tagId = parseInt(req.params.tagId);
    
    if (isNaN(postId) || isNaN(tagId)) {
      return res.status(400).json({ message: "Invalid post ID or tag ID" });
    }
    
    const success = await storage.removeTagFromPost(postId, tagId);
    if (!success) {
      return res.status(404).json({ message: "Post-tag relationship not found" });
    }
    
    res.json({ message: "Tag removed from post successfully" });
  });

  // Success Story routes
  app.post("/api/success-stories", isAdmin, async (req, res) => {
    try {
      const data = insertSuccessStorySchema.parse(req.body);
      const story = await storage.createSuccessStory(data);
      res.status(201).json(story);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/success-stories", async (req, res) => {
    const stories = await storage.listSuccessStories();
    res.json(stories);
  });

  app.get("/api/success-stories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid success story ID" });
    }
    const story = await storage.getSuccessStory(id);
    if (!story) {
      return res.status(404).json({ message: "Success story not found" });
    }
    res.json(story);
  });

  app.get("/api/success-stories/slug/:slug", async (req, res) => {
    const slug = req.params.slug;
    const story = await storage.getSuccessStoryBySlug(slug);
    if (!story) {
      return res.status(404).json({ message: "Success story not found" });
    }
    res.json(story);
  });

  app.put("/api/success-stories/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid success story ID" });
    }
    try {
      const data = insertSuccessStorySchema.partial().parse(req.body);
      const story = await storage.updateSuccessStory(id, data);
      if (!story) {
        return res.status(404).json({ message: "Success story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/success-stories/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid success story ID" });
    }
    const success = await storage.deleteSuccessStory(id);
    if (!success) {
      return res.status(404).json({ message: "Success story not found" });
    }
    res.json({ message: "Success story deleted successfully" });
  });

  // Newsletter subscriber routes
  app.post("/api/subscribers", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      
      // Check if subscriber already exists
      const existingSubscriber = await storage.getSubscriberByEmail(data.email);
      if (existingSubscriber) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      
      const subscriber = await storage.createSubscriber(data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/subscribers", isAdmin, async (req, res) => {
    const subscribers = await storage.listSubscribers();
    res.json(subscribers);
  });

  // SEO settings routes
  app.post("/api/seo-settings", isAdmin, async (req, res) => {
    try {
      const data = insertSeoSettingsSchema.parse(req.body);
      
      // Check if setting for this path already exists
      const existingSetting = await storage.getSeoSettingByPath(data.pagePath);
      if (existingSetting) {
        // Update instead of create
        const updated = await storage.updateSeoSetting(existingSetting.id, data);
        return res.json(updated);
      }
      
      const seoSetting = await storage.createSeoSetting(data);
      res.status(201).json(seoSetting);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/seo-settings", isAdmin, async (req, res) => {
    const settings = await storage.listSeoSettings();
    res.json(settings);
  });

  app.get("/api/seo-settings/path", async (req, res) => {
    const path = req.query.path as string;
    if (!path) {
      return res.status(400).json({ message: "Path parameter is required" });
    }
    
    const setting = await storage.getSeoSettingByPath(path);
    if (!setting) {
      return res.json({ 
        pagePath: path,
        metaTitle: "FULLSCO - Scholarship Blog",
        metaDescription: "Find and apply for scholarships worldwide with FULLSCO."
      });
    }
    
    res.json(setting);
  });

  app.put("/api/seo-settings/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid SEO setting ID" });
    }
    try {
      const data = insertSeoSettingsSchema.partial().parse(req.body);
      const setting = await storage.updateSeoSetting(id, data);
      if (!setting) {
        return res.status(404).json({ message: "SEO setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
