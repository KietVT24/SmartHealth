# Prisma Schema Documentation

## Overview

This document describes the complete database schema for the Smart Health application - a comprehensive child health and nutrition tracking platform.

## Schema Structure

### 1. **User Management & Authentication**

#### User Model

- **Purpose**: Core user authentication and profile management
- **Key Features**:
  - Email/password and OAuth authentication support
  - Role-based access control (PARENT, EXPERT, ADMIN)
  - User status management (ACTIVE, INACTIVE, SUSPENDED)
  - Email verification system
  - Password reset functionality

#### Enums:

- `UserRole`: PARENT, EXPERT, ADMIN
- `UserStatus`: ACTIVE, INACTIVE, SUSPENDED

### 2. **Child Health Tracking**

#### Child Model

- **Purpose**: Store child profiles linked to parent users
- **Fields**: name, dateOfBirth, gender, avatar
- **Relations**: Links to parent user, growth records, vaccinations, meal plans

#### GrowthRecord Model

- **Purpose**: Track child's physical development over time
- **Measurements**: height (cm), weight (kg), head circumference (cm)
- **Features**: Historical tracking with timestamps

#### Vaccination Model

- **Purpose**: Manage vaccination schedules and records
- **Features**:
  - Scheduled and completed dates
  - Vaccination reminders
  - Notes for each vaccination

#### Enums:

- `Gender`: MALE, FEMALE, OTHER

### 3. **Nutrition & Meal Planning**

#### Recipe Model

- **Purpose**: Store nutritional recipes with detailed information
- **Key Features**:
  - Ingredients and cooking instructions (stored as JSON)
  - Nutrition information (calories, protein, carbs, fat, fiber)
  - Age recommendations (min/max age in months)
  - Difficulty levels
  - Content moderation system (DRAFT, PENDING, APPROVED, REJECTED)
  - Author attribution

#### MealPlan Model

- **Purpose**: Create structured meal plans for children
- **Features**: Date range planning, meal organization

#### Meal Model

- **Purpose**: Individual meal entries
- **Features**:
  - Links to recipes
  - Meal type classification (BREAKFAST, LUNCH, DINNER, SNACK)
  - Scheduling and completion tracking
  - Notes for customization

#### Enums:

- `MealType`: BREAKFAST, LUNCH, DINNER, SNACK
- `RecipeStatus`: DRAFT, PENDING, APPROVED, REJECTED
- `DifficultyLevel`: EASY, MEDIUM, HARD

### 4. **Community & Content**

#### Post Model

- **Purpose**: Community articles and discussions
- **Key Features**:
  - Rich content with title, content, excerpt, cover image
  - Category classification
  - Content moderation system
  - Engagement metrics (views, likes)
  - Tag system for better organization

#### Comment Model

- **Purpose**: User comments on posts
- **Features**:
  - Nested comment support (parent-child relationships)
  - Like system
  - Author attribution

#### Enums:

- `PostStatus`: DRAFT, PENDING, APPROVED, REJECTED
- `PostCategory`: NUTRITION, HEALTH, DEVELOPMENT, PARENTING, RECIPE, QUESTION, EXPERIENCE, OTHER

### 5. **Notifications**

#### Notification Model

- **Purpose**: System and user notifications
- **Types**:
  - VACCINATION_REMINDER
  - MEAL_REMINDER
  - GROWTH_TRACKING
  - POST_APPROVED/REJECTED
  - RECIPE_APPROVED/REJECTED
  - COMMENT_REPLY
  - SYSTEM

## Key Design Decisions

### 1. **UUID Primary Keys**

All models use UUID for primary keys to ensure uniqueness across distributed systems and better security.

### 2. **Soft Delete Support**

Models include `status` fields where applicable, allowing for soft deletion and content moderation.

### 3. **Cascade Deletions**

Proper cascade rules ensure data integrity:

- Deleting a user cascades to their children, posts, comments, etc.
- Deleting a child cascades to growth records and vaccinations
- Deleting a recipe sets meal references to null (SetNull)

### 4. **Indexing Strategy**

Strategic indexes on:

- Foreign keys for relationship queries
- Frequently queried fields (email, role, status, dates)
- Fields used in filtering and sorting

### 5. **JSON Storage**

Complex data like recipe ingredients, instructions, and tags are stored as JSON strings for flexibility.

### 6. **Timestamp Tracking**

All models include `createdAt` and `updatedAt` timestamps for audit trails.

### 7. **Content Moderation**

Built-in moderation workflow for user-generated content (recipes and posts):

- DRAFT → PENDING → APPROVED/REJECTED
- Rejection reasons tracked for transparency

## Database Migration Notes

### Important: Supabase Migration

This project has migrated from Prisma to Supabase. While this schema file is maintained for reference and potential future use, the current application uses Supabase directly.

### If Using Prisma:

To apply this schema to a PostgreSQL database:

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy
```

### If Using Supabase:

You'll need to create corresponding tables in Supabase with the same structure. Consider using Prisma's migration SQL as a reference or create tables manually in Supabase Studio.

## Relations Summary

```
User (1) ──→ (N) Child
User (1) ──→ (N) Post
User (1) ──→ (N) Comment
User (1) ──→ (N) Recipe
User (1) ──→ (N) Meal
User (1) ──→ (N) Notification

Child (1) ──→ (N) GrowthRecord
Child (1) ──→ (N) Vaccination
Child (1) ──→ (N) MealPlan

Recipe (1) ──→ (N) Meal

MealPlan (1) ──→ (N) Meal

Post (1) ──→ (N) Comment

Comment (1) ──→ (N) Comment (nested replies)
```

## Next Steps

1. **Review the schema** to ensure it meets all application requirements
2. **Generate Prisma Client** if using Prisma: `npx prisma generate`
3. **Create migrations** or manually create tables in Supabase
4. **Update API routes** to use the new schema structure
5. **Implement content moderation** workflows for recipes and posts
6. **Set up notification system** for reminders and user engagement

## Notes

- All table names use snake_case convention (e.g., `users`, `growth_records`)
- All field names use camelCase in the schema but will be mapped appropriately in the database
- The schema supports multi-language content through the application layer
- Consider adding full-text search indexes for posts and recipes in production
