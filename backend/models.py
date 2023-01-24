from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    spoonacular_id = models.PositiveIntegerField(unique=True)
    image_url = models.URLField(blank=True)

    def serialize(self):
        return {
            "id": self.spoonacular_id,
            "title": self.title,
            "image": self.image_url
        }

    def __str__(self):
        return f'Recipe: {self.spoonacular_id} {self.title}'


class RecipeBox(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="recipe_box")
    title = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    recipes = models.ManyToManyField("Recipe", related_name="box", blank=True)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.username,         
            "title": self.title,
            "recipes": [{"title":recipe.title, "id":recipe.spoonacular_id, "image":recipe.image_url} for recipe in self.recipes.all()],
            "created_date": self.created_date.strftime("%b %d %Y, %I:%M %p"),
        }

    def __str__(self):
        return f'{self.user.username}: {self.title}'