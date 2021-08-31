"""RoboticArm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from arm import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('connect',views.connectRobot),
    path('main_page', views.main_page),
    path('Movej2',views.Movej2),
    path('Movej1',views.Movej1),
    path('Movej1j2',views.Movej1j2),
    path('RunScript',views.RunScript),
    path('getTorF',views.getTorF),
    path('requestPP',views.getPosition),
    path('runsConv',views.runConv),
    path('disconnect',views.DisconnectRobot),
    path('openGripper',views.openGripper),
]