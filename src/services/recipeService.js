import localRecipes from '../data/turkish_recipes.json'

export const fetchRecipes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localRecipes)
    }, 300)
  })
}