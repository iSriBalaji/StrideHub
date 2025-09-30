from django.contrib import admin
from .models import (
    Role,
    Person,
    Project,
    Engagement,
    Review,
    Rating_STD,
    Rating_Rating,
    Feedback_Source,
    Feedback,
    Utilization_Type,
    Utilization,
    DevelopmentPlan,
    DevelopmentGoal,
)

# Explicit registrations
admin.site.register(Role)
admin.site.register(Person)
admin.site.register(Project)
admin.site.register(Engagement)
admin.site.register(Review)
admin.site.register(Rating_STD)
admin.site.register(Rating_Rating)
admin.site.register(Feedback_Source)
admin.site.register(Feedback)
admin.site.register(Utilization_Type)
admin.site.register(Utilization)
admin.site.register(DevelopmentPlan)
admin.site.register(DevelopmentGoal)
