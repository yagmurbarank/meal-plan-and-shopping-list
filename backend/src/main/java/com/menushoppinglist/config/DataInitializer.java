package com.menushoppinglist.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.menushoppinglist.model.Recipe;
import com.menushoppinglist.repository.RecipeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RecipeRepository recipeRepository;
    private final ObjectMapper objectMapper;

    public DataInitializer(RecipeRepository recipeRepository, ObjectMapper objectMapper) {
        this.recipeRepository = recipeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (recipeRepository.count() == 0) {
            loadRecipes("/data/turkish_recipes.json");
            loadRecipes("/data/world_recipes.json");
        }
    }

    private void loadRecipes(String path) {
        try (InputStream inputStream = getClass().getResourceAsStream(path)) {
            if (inputStream == null) {
                return;
            }

            List<Recipe> recipes = objectMapper.readValue(inputStream, new TypeReference<List<Recipe>>() {});

            for (Recipe recipe : recipes) {
                if (recipe.getIngredients() != null) {
                    recipe.getIngredients().forEach(ingredient -> ingredient.setRecipe(recipe));
                }
            }

            recipeRepository.saveAll(recipes);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}