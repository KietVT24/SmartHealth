# Quick Reference Guide - Smart Health Schema

## 📋 Table of Contents

1. [Quick Stats](#quick-stats)
2. [Model Quick Reference](#model-quick-reference)
3. [Enum Values](#enum-values)
4. [Common Queries](#common-queries)
5. [Field Constraints](#field-constraints)

## 📊 Quick Stats

- **Total Models**: 10
- **Total Enums**: 9
- **Total Relationships**: 15+
- **Tables with Moderation**: 2 (Recipe, Post)
- **Tables with Soft Delete**: 1 (User via status)

## 🗂️ Model Quick Reference

### User

```typescript
{
  id: UUID
  email: string (unique)
  password?: string
  name?: string
  role: UserRole (default: PARENT)
  status: UserStatus (default: ACTIVE)
  emailVerified?: DateTime
  verificationToken?: string
  resetToken?: string
  resetTokenExpiry?: DateTime
}
```

**Relations**: children[], posts[], comments[], recipes[], meals[], notifications[]

---

### Child

```typescript
{
  id: UUID
  name: string
  dateOfBirth: DateTime
  gender: Gender
  avatar?: string
  parentId: UUID (FK → User)
}
```

**Relations**: parent, growthRecords[], vaccinations[], mealPlans[]

---

### GrowthRecord

```typescript
{
  id: UUID
  childId: UUID (FK → Child)
  height: number (cm)
  weight: number (kg)
  headCircumference?: number (cm)
  notes?: string
  measuredAt: DateTime
}
```

---

### Vaccination

```typescript
{
  id: UUID
  childId: UUID (FK → Child)
  vaccineName: string
  description?: string
  scheduledDate: DateTime
  completedDate?: DateTime
  notes?: string
}
```

---

### Recipe

```typescript
{
  id: UUID
  title: string
  description?: string
  image?: string
  ingredients: string (JSON)
  instructions: string (JSON)
  prepTime: number (minutes)
  cookTime: number (minutes)
  servings: number
  difficulty: DifficultyLevel (default: MEDIUM)
  calories?: number
  protein?: number (grams)
  carbs?: number (grams)
  fat?: number (grams)
  fiber?: number (grams)
  minAge?: number (months)
  maxAge?: number (months)
  status: RecipeStatus (default: PENDING)
  rejectionReason?: string
  authorId: UUID (FK → User)
  tags?: string (JSON array)
  publishedAt?: DateTime
}
```

**Relations**: author, meals[]

---

### MealPlan

```typescript
{
  id: UUID
  childId: UUID (FK → Child)
  name: string
  description?: string
  startDate: DateTime
  endDate: DateTime
}
```

**Relations**: child, meals[]

---

### Meal

```typescript
{
  id: UUID
  mealPlanId?: UUID (FK → MealPlan)
  recipeId?: UUID (FK → Recipe)
  userId: UUID (FK → User)
  mealType: MealType
  scheduledFor: DateTime
  completed: boolean (default: false)
  notes?: string
}
```

**Relations**: mealPlan?, recipe?, user

---

### Post

```typescript
{
  id: UUID
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  authorId: UUID (FK → User)
  category: PostCategory (default: OTHER)
  tags?: string (JSON array)
  status: PostStatus (default: PENDING)
  rejectionReason?: string
  views: number (default: 0)
  likes: number (default: 0)
  publishedAt?: DateTime
}
```

**Relations**: author, comments[]

---

### Comment

```typescript
{
  id: UUID
  content: string
  authorId: UUID (FK → User)
  postId: UUID (FK → Post)
  parentId?: UUID (FK → Comment, self-referencing)
  likes: number (default: 0)
}
```

**Relations**: author, post, parent?, replies[]

---

### Notification

```typescript
{
  id: UUID
  userId: UUID (FK → User)
  type: NotificationType
  title: string
  message: string
  link?: string
  read: boolean (default: false)
  createdAt: DateTime
}
```

**Relations**: user

---

## 🏷️ Enum Values

### UserRole

- `PARENT` - Regular parent user
- `EXPERT` - Nutrition/health expert
- `ADMIN` - System administrator

### UserStatus

- `ACTIVE` - Active user account
- `INACTIVE` - Temporarily inactive
- `SUSPENDED` - Suspended by admin

### Gender

- `MALE`
- `FEMALE`
- `OTHER`

### MealType

- `BREAKFAST`
- `LUNCH`
- `DINNER`
- `SNACK`

### RecipeStatus

- `DRAFT` - Saved but not submitted
- `PENDING` - Awaiting moderation
- `APPROVED` - Approved and visible
- `REJECTED` - Rejected by moderator

### DifficultyLevel

- `EASY`
- `MEDIUM`
- `HARD`

### PostStatus

- `DRAFT` - Saved but not submitted
- `PENDING` - Awaiting moderation
- `APPROVED` - Approved and visible
- `REJECTED` - Rejected by moderator

### PostCategory

- `NUTRITION`
- `HEALTH`
- `DEVELOPMENT`
- `PARENTING`
- `RECIPE`
- `QUESTION`
- `EXPERIENCE`
- `OTHER`

### NotificationType

- `VACCINATION_REMINDER`
- `MEAL_REMINDER`
- `GROWTH_TRACKING`
- `POST_APPROVED`
- `POST_REJECTED`
- `RECIPE_APPROVED`
- `RECIPE_REJECTED`
- `COMMENT_REPLY`
- `SYSTEM`

---

## 💾 Common Queries (Supabase)

### Get user with children

```typescript
const { data } = await supabase
  .from("users")
  .select("*, children(*)")
  .eq("id", userId)
  .single();
```

### Get child with growth records

```typescript
const { data } = await supabase
  .from("children")
  .select("*, growth_records(*)")
  .eq("id", childId)
  .single();
```

### Get approved recipes with author

```typescript
const { data } = await supabase
  .from("recipes")
  .select("*, author:users(*)")
  .eq("status", "APPROVED")
  .order("publishedAt", { ascending: false });
```

### Get posts with comments and authors

```typescript
const { data } = await supabase
  .from("posts")
  .select(
    `
    *,
    author:users(*),
    comments(*, author:users(*))
  `
  )
  .eq("status", "APPROVED")
  .order("publishedAt", { ascending: false });
```

### Get upcoming vaccinations

```typescript
const { data } = await supabase
  .from("vaccinations")
  .select("*, child:children(*)")
  .eq("child.parentId", userId)
  .is("completedDate", null)
  .gte("scheduledDate", new Date().toISOString())
  .order("scheduledDate", { ascending: true });
```

### Get meal plan with meals and recipes

```typescript
const { data } = await supabase
  .from("meal_plans")
  .select(
    `
    *,
    child:children(*),
    meals(*, recipe:recipes(*))
  `
  )
  .eq("id", mealPlanId)
  .single();
```

### Get unread notifications

```typescript
const { data } = await supabase
  .from("notifications")
  .select("*")
  .eq("userId", userId)
  .eq("read", false)
  .order("createdAt", { ascending: false });
```

### Get nested comments

```typescript
const { data } = await supabase
  .from("comments")
  .select(
    `
    *,
    author:users(*),
    replies:comments(*, author:users(*))
  `
  )
  .eq("postId", postId)
  .is("parentId", null)
  .order("createdAt", { ascending: false });
```

---

## 🔒 Field Constraints

### Required Fields by Model

**User**

- email (unique)

**Child**

- name, dateOfBirth, gender, parentId

**GrowthRecord**

- childId, height, weight

**Vaccination**

- childId, vaccineName, scheduledDate

**Recipe**

- title, ingredients, instructions, prepTime, cookTime, servings, authorId

**MealPlan**

- childId, name, startDate, endDate

**Meal**

- userId, mealType, scheduledFor

**Post**

- title, content, authorId

**Comment**

- content, authorId, postId

**Notification**

- userId, type, title, message

### Unique Constraints

- `users.email`
- `users.verificationToken`
- `users.resetToken`

### Default Values

- Most IDs: `gen_random_uuid()`
- Timestamps: `now()`
- `user.role`: `PARENT`
- `user.status`: `ACTIVE`
- `recipe.difficulty`: `MEDIUM`
- `recipe.status`: `PENDING`
- `post.status`: `PENDING`
- `post.category`: `OTHER`
- `meal.completed`: `false`
- `notification.read`: `false`
- `post.views`: `0`
- `post.likes`: `0`
- `comment.likes`: `0`

---

## 📝 JSON Field Formats

### Recipe.ingredients

```json
[
  {
    "name": "Cà rốt",
    "amount": "2",
    "unit": "củ"
  },
  {
    "name": "Thịt gà",
    "amount": "200",
    "unit": "gram"
  }
]
```

### Recipe.instructions

```json
[
  {
    "step": 1,
    "description": "Rửa sạch cà rốt và thái nhỏ"
  },
  {
    "step": 2,
    "description": "Luộc thịt gà cho chín"
  }
]
```

### Recipe.tags / Post.tags

```json
["dinh-duong", "tre-em", "de-lam"]
```

---

## 🎯 Best Practices

1. **Always hash passwords** before storing (use bcrypt)
2. **Validate JSON fields** before inserting
3. **Use transactions** for related operations
4. **Implement RLS policies** in Supabase for security
5. **Index frequently queried fields**
6. **Sanitize user input** to prevent XSS/SQL injection
7. **Use prepared statements** for dynamic queries
8. **Implement pagination** for large result sets
9. **Cache frequently accessed data**
10. **Monitor query performance** and optimize indexes

---

## 🔗 Quick Links

- [Full Schema Documentation](./SCHEMA_DOCUMENTATION.md)
- [Schema Diagram](./SCHEMA_DIAGRAM.md)
- [Supabase Migration SQL](./supabase_migration.sql)
- [Vietnamese Summary](./SCHEMA_SUMMARY_VI.md)
