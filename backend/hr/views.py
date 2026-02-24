from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from datetime import date

from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer


# Bonus Dashboard API
from rest_framework.views import APIView

class DashboardSummary(APIView):
    def get(self, request):
        total_employees = Employee.objects.count()
        total_attendance = Attendance.objects.count()
        today_present = Attendance.objects.filter(
            date=date.today(),
            status="Present"
        ).count()

        return Response({
            "total_employees": total_employees,
            "total_attendance": total_attendance,
            "today_present": today_present
        })