package com.menushoppinglist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    private String id;

    private String title;
    private String category; 
    private Integer calories;
    private String cuisine;  
    
    private Boolean isGlutenFree;
    private Boolean isVegan;

    @Column(name = "prep_time")
    private Integer prepTime;

    @Column(name = "cook_time")
    private Integer cookTime;

    private String instructions;

    public Integer getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(Integer prepTime) {
        this.prepTime = prepTime;
    }

    public Integer getCookTime() {
        return cookTime;
    }

    public void setCookTime(Integer cookTime) {
        this.cookTime = cookTime;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ingredient> ingredients;
}