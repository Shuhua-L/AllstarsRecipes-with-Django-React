from django.urls import path
from django.urls import re_path
from . import views

app_name = "backend"
urlpatterns = [
    # Testing
    path('api', views.index, name="backend"),

    # API
    path('api/boxes', views.boxes, name='boxes'),

    # User authentication 
    path("usr/login", views.login_view, name="login"),
    path("usr/register", views.register_view, name="register"),
    path("usr/logout", views.logout, name="logout"),
]