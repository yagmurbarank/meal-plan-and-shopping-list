package com.menushoppinglist.repository;

import com.menushoppinglist.model.Recipe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, String> {
    List<Recipe> findByCuisineIgnoreCase(String cuisine);
}