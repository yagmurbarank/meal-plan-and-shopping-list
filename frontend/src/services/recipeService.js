import turkishRecipes from "../data/turkish_recipes.json";
import worldRecipes from "../data/world_recipes.json";

const API_BASE_URL = "http://localhost:8080/api/recipes";

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