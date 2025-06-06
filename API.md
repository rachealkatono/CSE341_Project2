# Health and Recipe API

## Base URL:
`https://cse341-project2-z10v.onrender.com`

---

### GET /recipes
Returns all recipes.

### GET /recipes/:id
Returns a recipe by ID.

### POST /recipes
Creates a new recipe.
```json
{
  "title": "Avocado Toast",
  "ingredients": ["bread", "avocado", "salt"],
  "steps": ["Toast bread", "Mash avocado", "Spread and season"],
  "calories": 250,
  "prepTime": 5,
  "cookTime": 0,
  "category": "Breakfast",
  "isVegan": true
}
