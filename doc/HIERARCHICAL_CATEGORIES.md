# Hierarchical Category System

This document describes the implementation of a hierarchical category system with unlimited parent-child relationships and drag-and-drop ordering functionality.

## Features

### 🏗️ Hierarchical Structure
- **Unlimited Depth**: Categories can have unlimited levels of nesting
- **Parent-Child Relationships**: Each category can have a parent and multiple children
- **Path Tracking**: Each category maintains a path string for efficient querying
- **Level Tracking**: Each category knows its depth level in the hierarchy

### 🎯 Ordering System
- **Drag & Drop**: Visual drag-and-drop interface for reordering categories
- **Order Field**: Each category has an `order` field for custom sorting
- **Same-Level Reordering**: Categories can be reordered within the same parent level
- **Automatic Order Management**: System automatically manages order values

### 🎨 User Interface
- **Tree View**: Hierarchical tree display with expand/collapse functionality
- **Visual Indicators**: Color-coded categories with level indicators
- **Parent Selection**: Dropdown selector for choosing parent categories
- **Breadcrumb Navigation**: Shows the full path to any category

## Database Schema

### Category Model Updates

```prisma
model Category {
  id                  String     @id @default(cuid())
  slug                String     @unique
  name                String
  description         String?
  image               String?
  color               String?    @default("blue")
  order               Int        @default(0)    // NEW: Order within parent
  level               Int        @default(0)    // NEW: Depth level
  path                String     @default("")   // NEW: Full path string
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  // ... existing fields ...
  parentId            String?
  parent              Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children            Category[] @relation("CategoryHierarchy")
  posts               Post[]
}
```

### New Fields Explained

- **`order`**: Integer field for ordering categories within the same parent level
- **`level`**: Integer field indicating the depth level (0 = root, 1 = first level, etc.)
- **`path`**: String field containing the full path from root to current category (e.g., "parent1/parent2/current")

## API Endpoints

### GET /api/categories
- **Query Parameters**:
  - `format=hierarchy` (default): Returns categories in hierarchical tree structure
  - `format=flat`: Returns categories as flat list with hierarchy info

### POST /api/categories
- **Body**: FormData with category information including `parentId`
- **Features**: Automatically calculates `level`, `path`, and `order` fields

### GET /api/categories/[id]
- **Query Parameters**:
  - `breadcrumb=true`: Include breadcrumb path in response

### PUT /api/categories/[id]
- **Body**: FormData with updated category information
- **Features**: Handles parent changes and updates descendant hierarchy

### DELETE /api/categories/[id]
- **Validation**: Prevents deletion of categories with posts or children
- **Features**: Automatically reorders remaining categories

### POST /api/categories/reorder
- **Body**: JSON with array of reorder operations
- **Features**: Batch reordering with validation

## Service Layer

### CategoryService Functions

```typescript
// Get categories in hierarchical structure
getCategoriesHierarchy(): Promise<CategoryWithChildren[]>

// Get categories as flat list
getCategoriesFlat(): Promise<CategoryWithChildren[]>

// Get single category with hierarchy
getCategoryById(id: string): Promise<CategoryWithChildren | null>

// Create new category
createCategory(data: CreateCategoryData): Promise<CategoryWithChildren>

// Update category
updateCategory(id: string, data: UpdateCategoryData): Promise<CategoryWithChildren>

// Delete category
deleteCategory(id: string): Promise<void>

// Reorder categories
reorderCategories(data: ReorderCategoriesData[]): Promise<void>

// Get breadcrumb path
getCategoryBreadcrumb(categoryId: string): Promise<CategoryWithChildren[]>
```

## User Interface Components

### 1. Hierarchical Category Tree (`/dashboard/categories`)

**Features**:
- Drag-and-drop reordering using @dnd-kit
- Expand/collapse functionality
- Visual hierarchy with indentation
- Color-coded categories
- Action buttons (edit, delete)
- Level indicators

**Key Components**:
- `SortableCategoryItem`: Individual category row with drag handle
- `CategoryTree`: Recursive tree component
- `DndContext`: Drag-and-drop context provider

### 2. Parent Category Selector (`ParentCategorySelector.tsx`)

**Features**:
- Hierarchical dropdown with tree structure
- Expand/collapse categories
- Breadcrumb display for selected category
- Clear selection option
- "No parent" option for root categories

### 3. Category Forms

**New Category Form** (`/dashboard/categories/new`):
- Parent category selector
- All existing fields
- Automatic hierarchy calculation

**Edit Category Form** (`/dashboard/categories/[id]/edit`):
- Parent category selector with current selection
- Prevents circular references
- Updates descendant hierarchy

## Usage Examples

### Creating a Hierarchical Category Structure

```typescript
// Root category
const technology = await createCategory({
  name: "Technology",
  slug: "technology",
  description: "Technology-related content"
})

// First level subcategory
const programming = await createCategory({
  name: "Programming",
  slug: "programming",
  description: "Programming tutorials and articles",
  parentId: technology.id
})

// Second level subcategory
const javascript = await createCategory({
  name: "JavaScript",
  slug: "javascript",
  description: "JavaScript tutorials",
  parentId: programming.id
})
```

### Reordering Categories

```typescript
// Reorder categories within the same parent level
await reorderCategories([
  {
    categoryId: "category-1",
    newOrder: 2,
    newParentId: "parent-category-id"
  },
  {
    categoryId: "category-2", 
    newOrder: 1,
    newParentId: "parent-category-id"
  }
])
```

### Getting Category Hierarchy

```typescript
// Get full hierarchy
const hierarchy = await getCategoriesHierarchy()
// Returns: [
//   {
//     id: "tech",
//     name: "Technology",
//     children: [
//       {
//         id: "prog",
//         name: "Programming", 
//         children: [
//           { id: "js", name: "JavaScript", children: [] }
//         ]
//       }
//     ]
//   }
// ]

// Get flat list with hierarchy info
const flat = await getCategoriesFlat()
// Returns: [
//   { id: "tech", name: "Technology", level: 0, path: "tech" },
//   { id: "prog", name: "Programming", level: 1, path: "tech/prog" },
//   { id: "js", name: "JavaScript", level: 2, path: "tech/prog/js" }
// ]
```

## Migration

To apply the database changes:

```bash
npx prisma migrate dev --name add_category_hierarchy_fields
```

This will add the `order`, `level`, and `path` fields to existing categories and populate them with appropriate values.

## Performance Considerations

### Database Indexes
Consider adding indexes for better performance:

```sql
-- Index for parent-child queries
CREATE INDEX idx_category_parent_id ON "Category"("parentId");

-- Index for level-based queries  
CREATE INDEX idx_category_level ON "Category"("level");

-- Index for path-based queries
CREATE INDEX idx_category_path ON "Category"("path");
```

### Query Optimization
- Use `include` selectively to avoid over-fetching
- Implement pagination for large category trees
- Cache frequently accessed hierarchy structures

## Security & Validation

### Circular Reference Prevention
The system prevents categories from being set as their own descendants:

```typescript
// This will throw an error
if (parent.path.includes(existingCategory.id)) {
  throw new Error('Cannot set parent to a descendant category')
}
```

### Permission Checks
All category operations require appropriate permissions:
- `categories:create` for creating categories
- `categories:update` for updating/reordering categories  
- `categories:delete` for deleting categories

### Validation Rules
- Categories with posts cannot be deleted
- Categories with children cannot be deleted
- Slug uniqueness is enforced across all levels
- Required fields are validated

## Future Enhancements

### Potential Improvements
1. **Bulk Operations**: Import/export category hierarchies
2. **Category Templates**: Predefined category structures
3. **Category Analytics**: Usage statistics and insights
4. **Advanced Filtering**: Filter categories by level, parent, etc.
5. **Category Permissions**: Role-based access to specific categories
6. **Category Migration**: Tools for restructuring hierarchies

### Performance Optimizations
1. **Lazy Loading**: Load category children on demand
2. **Virtual Scrolling**: Handle large category trees efficiently
3. **Caching**: Cache hierarchy structures in Redis
4. **Database Optimization**: Materialized views for complex queries

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure database is backed up before running migrations
2. **Circular References**: Check for existing circular relationships before updates
3. **Order Conflicts**: Reset order values if they become inconsistent
4. **Path Corruption**: Rebuild paths if they become invalid

### Debug Tools

```typescript
// Check category hierarchy integrity
const validateHierarchy = async () => {
  const categories = await getCategoriesFlat()
  for (const cat of categories) {
    if (cat.parentId) {
      const parent = categories.find(c => c.id === cat.parentId)
      if (!parent) {
        console.error(`Category ${cat.name} has invalid parent ${cat.parentId}`)
      }
    }
  }
}
```

This hierarchical category system provides a robust foundation for organizing content with unlimited nesting levels and intuitive drag-and-drop management.
