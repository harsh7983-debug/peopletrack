from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AttendanceViewSet, DashboardSummary
from django.urls import path

router = DefaultRouter()
router.register('employees', EmployeeViewSet)
router.register('attendance', AttendanceViewSet)

urlpatterns = router.urls + [
    path('dashboard/', DashboardSummary.as_view())
]