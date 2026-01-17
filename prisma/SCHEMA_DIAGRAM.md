# Database Schema Diagram

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SMART HEALTH DATABASE SCHEMA                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                      USER MANAGEMENT & AUTHENTICATION                         │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    User     │
                              ├─────────────┤
                              │ id (PK)     │
                              │ email       │
                              │ password    │
                              │ name        │
                              │ role        │◄──── UserRole: PARENT, EXPERT, ADMIN
                              │ status      │◄──── UserStatus: ACTIVE, INACTIVE, SUSPENDED
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┬──────────────┐
                    │                │                │              │
                    ▼                ▼                ▼              ▼
            ┌──────────┐      ┌──────────┐    ┌──────────┐  ┌──────────────┐
            │  Child   │      │   Post   │    │  Recipe  │  │ Notification │
            └──────────┘      └──────────┘    └──────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         CHILD HEALTH TRACKING                                 │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    Child    │
                              ├─────────────┤
                              │ id (PK)     │
                              │ name        │
                              │ dateOfBirth │
                              │ gender      │◄──── Gender: MALE, FEMALE, OTHER
                              │ parentId(FK)│
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐  ┌─────────────┐  ┌──────────┐
            │ GrowthRecord │  │ Vaccination │  │ MealPlan │
            ├──────────────┤  ├─────────────┤  └─────┬────┘
            │ height       │  │ vaccineName │        │
            │ weight       │  │ scheduledDate│       │
            │ headCircum.  │  │ completedDate│       │
            └──────────────┘  └─────────────┘        │
                                                      ▼
                                                ┌──────────┐
                                                │   Meal   │
                                                └──────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                       NUTRITION & MEAL PLANNING                               │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐                                    ┌──────────┐
    │   Recipe    │                                    │ MealPlan │
    ├─────────────┤                                    ├──────────┤
    │ id (PK)     │                                    │ id (PK)  │
    │ title       │                                    │ name     │
    │ ingredients │◄──── JSON                          │ childId  │
    │ instructions│◄──── JSON                          │ startDate│
    │ calories    │                                    │ endDate  │
    │ protein     │                                    └────┬─────┘
    │ carbs       │                                         │
    │ fat         │                                         │
    │ minAge      │                                         │
    │ maxAge      │                                         │
    │ status      │◄──── RecipeStatus                      │
    │ difficulty  │◄──── DifficultyLevel                   │
    │ authorId(FK)│                                         │
    └──────┬──────┘                                         │
           │                                                │
           │              ┌──────────────┐                  │
           └─────────────►│     Meal     │◄─────────────────┘
                          ├──────────────┤
                          │ id (PK)      │
                          │ recipeId(FK) │
                          │ mealPlanId(FK)│
                          │ userId(FK)   │
                          │ mealType     │◄──── MealType: BREAKFAST, LUNCH, DINNER, SNACK
                          │ scheduledFor │
                          │ completed    │
                          └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         COMMUNITY & CONTENT                                   │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    Post     │
                              ├─────────────┤
                              │ id (PK)     │
                              │ title       │
                              │ content     │
                              │ category    │◄──── PostCategory
                              │ status      │◄──── PostStatus
                              │ views       │
                              │ likes       │
                              │ authorId(FK)│
                              └──────┬──────┘
                                     │
                                     │
                                     ▼
                              ┌─────────────┐
                              │   Comment   │
                              ├─────────────┤
                              │ id (PK)     │
                              │ content     │
                              │ postId (FK) │
                              │ authorId(FK)│
                              │ parentId(FK)│◄──── Self-referencing for nested comments
                              │ likes       │
                              └─────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                            NOTIFICATIONS                                      │
└──────────────────────────────────────────────────────────────────────────────┘

                          ┌────────────────┐
                          │  Notification  │
                          ├────────────────┤
                          │ id (PK)        │
                          │ userId (FK)    │
                          │ type           │◄──── NotificationType
                          │ title          │
                          │ message        │
                          │ link           │
                          │ read           │
                          │ createdAt      │
                          └────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                           │
└──────────────────────────────────────────────────────────────────────────────┘

PK  = Primary Key
FK  = Foreign Key
──► = One-to-Many Relationship
◄── = Enum/Type Reference

┌──────────────────────────────────────────────────────────────────────────────┐
│                         KEY RELATIONSHIPS                                     │
└──────────────────────────────────────────────────────────────────────────────┘

1. User → Child (1:N)
   - One parent can have multiple children
   - CASCADE delete: Deleting user deletes all their children

2. Child → GrowthRecord (1:N)
   - One child has multiple growth records over time
   - CASCADE delete: Deleting child deletes all growth records

3. Child → Vaccination (1:N)
   - One child has multiple vaccination records
   - CASCADE delete: Deleting child deletes all vaccinations

4. User → Recipe (1:N)
   - One user can create multiple recipes
   - CASCADE delete: Deleting user deletes their recipes

5. Recipe → Meal (1:N)
   - One recipe can be used in multiple meals
   - SET NULL: Deleting recipe doesn't delete meals

6. MealPlan → Meal (1:N)
   - One meal plan contains multiple meals
   - CASCADE delete: Deleting meal plan deletes all meals

7. User → Post (1:N)
   - One user can write multiple posts
   - CASCADE delete: Deleting user deletes their posts

8. Post → Comment (1:N)
   - One post can have multiple comments
   - CASCADE delete: Deleting post deletes all comments

9. Comment → Comment (1:N - Self-referencing)
   - Comments can have nested replies
   - CASCADE delete: Deleting parent comment deletes all replies

10. User → Notification (1:N)
    - One user can have multiple notifications
    - CASCADE delete: Deleting user deletes their notifications

┌──────────────────────────────────────────────────────────────────────────────┐
│                         CONTENT MODERATION FLOW                               │
└──────────────────────────────────────────────────────────────────────────────┘

User Creates Content
        │
        ▼
    ┌────────┐
    │ DRAFT  │ ──► User saves but doesn't submit
    └────────┘
        │
        │ User submits
        ▼
    ┌─────────┐
    │ PENDING │ ──► Waiting for admin/expert review
    └─────────┘
        │
        ├──► Admin approves ──► ┌──────────┐
        │                       │ APPROVED │ ──► Visible to public
        │                       └──────────┘
        │
        └──► Admin rejects ──► ┌──────────┐
                               │ REJECTED │ ──► Not visible, reason stored
                               └──────────┘

Applies to: Recipes and Posts
```
