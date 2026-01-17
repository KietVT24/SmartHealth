-- Smart Health Database Schema for Supabase
-- Generated from Prisma Schema
-- Run this in Supabase SQL Editor to create all tables

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('PARENT', 'EXPERT', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "PostCategory" AS ENUM ('NUTRITION', 'HEALTH', 'DEVELOPMENT', 'PARENTING', 'RECIPE', 'QUESTION', 'EXPERIENCE', 'OTHER');
CREATE TYPE "NotificationType" AS ENUM ('VACCINATION_REMINDER', 'MEAL_REMINDER', 'GROWTH_TRACKING', 'POST_APPROVED', 'POST_REJECTED', 'RECIPE_APPROVED', 'RECIPE_REJECTED', 'COMMENT_REPLY', 'SYSTEM');

-- ============================================
-- TABLES
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "role" "UserRole" DEFAULT 'PARENT' NOT NULL,
    "status" "UserStatus" DEFAULT 'ACTIVE' NOT NULL,
    "emailVerified" TIMESTAMP,
    "verificationToken" TEXT UNIQUE,
    "resetToken" TEXT UNIQUE,
    "resetTokenExpiry" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Children Table
CREATE TABLE IF NOT EXISTS "children" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP NOT NULL,
    "gender" "Gender" NOT NULL,
    "avatar" TEXT,
    "parentId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Growth Records Table
CREATE TABLE IF NOT EXISTS "growth_records" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "childId" UUID NOT NULL REFERENCES "children"("id") ON DELETE CASCADE,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "headCircumference" DOUBLE PRECISION,
    "notes" TEXT,
    "measuredAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Vaccinations Table
CREATE TABLE IF NOT EXISTS "vaccinations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "childId" UUID NOT NULL REFERENCES "children"("id") ON DELETE CASCADE,
    "vaccineName" TEXT NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP NOT NULL,
    "completedDate" TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS "recipes" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "ingredients" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "difficulty" "DifficultyLevel" DEFAULT 'MEDIUM' NOT NULL,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "status" "RecipeStatus" DEFAULT 'PENDING' NOT NULL,
    "rejectionReason" TEXT,
    "authorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "tags" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "publishedAt" TIMESTAMP
);

-- Meal Plans Table
CREATE TABLE IF NOT EXISTS "meal_plans" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "childId" UUID NOT NULL REFERENCES "children"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Meals Table
CREATE TABLE IF NOT EXISTS "meals" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "mealPlanId" UUID REFERENCES "meal_plans"("id") ON DELETE CASCADE,
    "recipeId" UUID REFERENCES "recipes"("id") ON DELETE SET NULL,
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "mealType" "MealType" NOT NULL,
    "scheduledFor" TIMESTAMP NOT NULL,
    "completed" BOOLEAN DEFAULT FALSE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Posts Table
CREATE TABLE IF NOT EXISTS "posts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "authorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "category" "PostCategory" DEFAULT 'OTHER' NOT NULL,
    "tags" TEXT,
    "status" "PostStatus" DEFAULT 'PENDING' NOT NULL,
    "rejectionReason" TEXT,
    "views" INTEGER DEFAULT 0 NOT NULL,
    "likes" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "publishedAt" TIMESTAMP
);

-- Comments Table
CREATE TABLE IF NOT EXISTS "comments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "postId" UUID NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
    "parentId" UUID REFERENCES "comments"("id") ON DELETE CASCADE,
    "likes" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- Children indexes
CREATE INDEX IF NOT EXISTS "children_parentId_idx" ON "children"("parentId");

-- Growth Records indexes
CREATE INDEX IF NOT EXISTS "growth_records_childId_idx" ON "growth_records"("childId");
CREATE INDEX IF NOT EXISTS "growth_records_measuredAt_idx" ON "growth_records"("measuredAt");

-- Vaccinations indexes
CREATE INDEX IF NOT EXISTS "vaccinations_childId_idx" ON "vaccinations"("childId");
CREATE INDEX IF NOT EXISTS "vaccinations_scheduledDate_idx" ON "vaccinations"("scheduledDate");

-- Recipes indexes
CREATE INDEX IF NOT EXISTS "recipes_authorId_idx" ON "recipes"("authorId");
CREATE INDEX IF NOT EXISTS "recipes_status_idx" ON "recipes"("status");
CREATE INDEX IF NOT EXISTS "recipes_publishedAt_idx" ON "recipes"("publishedAt");

-- Meal Plans indexes
CREATE INDEX IF NOT EXISTS "meal_plans_childId_idx" ON "meal_plans"("childId");
CREATE INDEX IF NOT EXISTS "meal_plans_startDate_idx" ON "meal_plans"("startDate");

-- Meals indexes
CREATE INDEX IF NOT EXISTS "meals_mealPlanId_idx" ON "meals"("mealPlanId");
CREATE INDEX IF NOT EXISTS "meals_userId_idx" ON "meals"("userId");
CREATE INDEX IF NOT EXISTS "meals_scheduledFor_idx" ON "meals"("scheduledFor");

-- Posts indexes
CREATE INDEX IF NOT EXISTS "posts_authorId_idx" ON "posts"("authorId");
CREATE INDEX IF NOT EXISTS "posts_status_idx" ON "posts"("status");
CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts"("category");
CREATE INDEX IF NOT EXISTS "posts_publishedAt_idx" ON "posts"("publishedAt");

-- Comments indexes
CREATE INDEX IF NOT EXISTS "comments_authorId_idx" ON "comments"("authorId");
CREATE INDEX IF NOT EXISTS "comments_postId_idx" ON "comments"("postId");
CREATE INDEX IF NOT EXISTS "comments_parentId_idx" ON "comments"("parentId");

-- Notifications indexes
CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_read_idx" ON "notifications"("read");
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt");

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON "children" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_growth_records_updated_at BEFORE UPDATE ON "growth_records" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON "vaccinations" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON "recipes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON "meal_plans" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON "meals" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON "posts" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON "comments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "children" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "growth_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vaccinations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recipes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meal_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize based on your needs)
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON "users"
    FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON "users"
    FOR UPDATE USING (auth.uid()::text = id);

-- Parents can view their own children
CREATE POLICY "Parents can view own children" ON "children"
    FOR SELECT USING (auth.uid()::text = "parentId");

-- Parents can manage their own children
CREATE POLICY "Parents can manage own children" ON "children"
    FOR ALL USING (auth.uid()::text = "parentId");

-- Public can view approved recipes
CREATE POLICY "Public can view approved recipes" ON "recipes"
    FOR SELECT USING (status = 'APPROVED');

-- Users can create recipes
CREATE POLICY "Users can create recipes" ON "recipes"
    FOR INSERT WITH CHECK (auth.uid()::text = "authorId");

-- Public can view approved posts
CREATE POLICY "Public can view approved posts" ON "posts"
    FOR SELECT USING (status = 'APPROVED');

-- Users can create posts
CREATE POLICY "Users can create posts" ON "posts"
    FOR INSERT WITH CHECK (auth.uid()::text = "authorId");

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample admin user
-- INSERT INTO "users" ("email", "password", "name", "role", "emailVerified")
-- VALUES ('admin@smarthealth.com', '$2a$12$...', 'Admin User', 'ADMIN', NOW());

-- ============================================
-- NOTES
-- ============================================

-- 1. Make sure to update RLS policies based on your authentication setup
-- 2. The password field should store bcrypt hashed passwords
-- 3. JSON fields (ingredients, instructions, tags) should be valid JSON strings
-- 4. Consider adding full-text search indexes for posts and recipes in production
-- 5. Monitor and optimize indexes based on query patterns
