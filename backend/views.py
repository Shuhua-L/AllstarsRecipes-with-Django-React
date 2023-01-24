from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout as django_logout
from django.db import IntegrityError

from .models import *

def index():
    return JsonResponse({"messages": "Response from Django backend."})

'''
API
path: /api/recipes
method: GET - return all recipes
'''
def recipes():
    recipes = Recipe.objects.all()
    return JsonResponse([recipe.serialize() for recipe in recipes], safe=False)

'''
API
path: /api/boxes
method: GET - return an array of boxes
        POST - create a new box
        PUT - add a recipe to the box
        PATCH - edit recipe(s) and title of a box
        DELETE - delete the box
'''
@csrf_exempt
@login_required(login_url="/usr/login")
def boxes(request):
    user = User.objects.get(username=request.user)

    if request.method == "GET":
        boxes = RecipeBox.objects.filter(user=user)
        return JsonResponse([box.serialize() for box in boxes], safe=False)

    data = json.loads(request.body)

    if request.method == "POST":
        # create and save box
        title= data["title"]
        box = RecipeBox(user=user, title=title)
        box.save()

        print("Box added: " + box.title)

        return JsonResponse(box.serialize(), safe=False, status=201)
    
    # find box
    box_id = data["box_id"]
    box = RecipeBox.objects.get(id = box_id)

    if request.method == "PUT":   
        # get or create recipe
        recipe_id = data["recipe_id"]
        recipe, created = Recipe.objects.get_or_create(
            spoonacular_id = recipe_id,
            defaults={ 
                "title": data["recipe_title"],
                "image_url": data["recipe_image"] },
        )

        # add recipe to box
        box.recipes.add(recipe)

        print("Recipe added: " + recipe.title)

        return JsonResponse({"message": "Recipe added successfully."}, status=202)

    if request.method == "PATCH":
        # update box title
        box.title = data["box_title"]
        box.save()

        # remove recipes
        remove_recipes = data["remove_recipes"]
        for recipe_id in remove_recipes:
            recipe = Recipe.objects.get(spoonacular_id = int(recipe_id))
            box.recipes.remove(recipe)

            print("Recipe removed: " + recipe.title)

        return JsonResponse({"message": "Recipe edited successfully."}, status=203)

    if request.method == "DELETE":
        box.delete()

        print("Box deleted: " + box.title)

        return JsonResponse({"message": "Box deleted successfully."}, status=204)
    

'''
path: /usr/login
'''
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "backend/login.html", {
                "message": "Invalid username / password."
            })
    else:
        return render(request, "backend/login.html")

'''
path: /usr/logout
'''
def logout(request):
    django_logout(request)
    return HttpResponseRedirect(reverse("index"))


'''
path: /usr/register
'''
def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "backend/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            # create user's default box
            default_box = RecipeBox(user=user, title="Save for Later")
            default_box.save()
        except IntegrityError as e:
            print(e)
            return render(request, "backend/register.html", {
                "message": "Email address already taken."
            })
            
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "backend/register.html")
