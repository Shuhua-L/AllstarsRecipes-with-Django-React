
from . import views
from django.urls import re_path

urlpatterns = [
    # Frontend with React
    # RegExpr: any string not starting with 'api' or "usr"
    re_path(r"^(?!api|usr).*$", views.index, name="index"), 
]