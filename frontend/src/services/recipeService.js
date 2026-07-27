import turkishRecipes from "../data/turkish_recipes.json";
import worldRecipes from "../data/world_recipes.json";

const API_BASE_URL = "http://localhost:8081/api/recipes";

export const fetchRecipes = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Backend servisine ulaşılamadı");
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend bağlantısı kurulamadı, yerel JSON verileri yükleniyor...", error.message);
    return [...turkishRecipes, ...worldRecipes];
  }
};

export const recipeService = {
  async getAllRecipes() {
    const res = await fetch(API_BASE_URL);
    return await res.json();
  },

  async addRecipe(recipeData) {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });
    return await res.json();
  },
};