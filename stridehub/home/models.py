from django.db import models
from django.conf import settings

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=100)
    role_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.role_name

class Person(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(  # now required & enforces 1:1 with auth_user.id
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='person',
        # removed: null=True, blank=True
    )
    role_id = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, db_column='role_id', blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    hire_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        base = f"{self.first_name} {self.last_name}".strip()
        return base or self.user.username

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.project_name

class Engagement(models.Model):
    engagement_id = models.AutoField(primary_key=True)
    person_id = models.ForeignKey(Person, on_delete=models.CASCADE, db_column='person_id')
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    role_on_project = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('person_id', 'project_id', 'start_date')

    def __str__(self):
        return f"{self.person_id} - {self.project_id}"

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    person_id = models.ForeignKey(Person, on_delete=models.CASCADE, db_column='person_id')
    engagement_id = models.ForeignKey(Engagement, on_delete=models.SET_NULL, null=True, blank=True, db_column='engagement_id')
    overall_score = models.FloatField(null=True, blank=True)
    outcome = models.TextField(blank=True, null=True)
    review_date = models.DateField()

    def __str__(self):
        return f"Review for {self.person_id} on {self.review_date}"

class Rating_STD(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    weight = models.FloatField()

    def __str__(self):
        return self.category_name

class Rating_Rating(models.Model):
    review_rating_id = models.AutoField(primary_key=True)
    review_id = models.ForeignKey(Review, on_delete=models.CASCADE, db_column='review_id')
    category_id = models.ForeignKey(Rating_STD, on_delete=models.CASCADE, db_column='category_id')
    score = models.IntegerField()
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.review_id} - {self.category_id} ({self.score})"

class Feedback_Source(models.Model):
    feedback_source_id = models.AutoField(primary_key=True)
    feedback_source_name = models.CharField(max_length=100)

    def __str__(self):
        return self.feedback_source_name

class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    author_person_id = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedback_given', db_column='author_person_id')
    subject_person_id = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='feedback_received', db_column='subject_person_id')
    engagement_id = models.ForeignKey(Engagement, on_delete=models.SET_NULL, null=True, blank=True, db_column='engagement_id')
    feedback_source_id = models.ForeignKey(Feedback_Source, on_delete=models.SET_NULL, null=True, blank=True, db_column='feedback_source_id')
    strengths = models.TextField(blank=True, null=True)
    areas_for_growth = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.subject_person_id}"

class Utilization_Type(models.Model):
    utilization_type_id = models.AutoField(primary_key=True)
    utilization_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.utilization_type_name

class Utilization(models.Model):
    utilization_id = models.AutoField(primary_key=True)
    person_id = models.ForeignKey(Person, on_delete=models.CASCADE, db_column='person_id')
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    week_start_date = models.DateField()
    hours = models.FloatField()
    utilization_type_id = models.ForeignKey(Utilization_Type, on_delete=models.CASCADE, db_column='utilization_type_id')

    def __str__(self):
        return f"{self.person_id} - {self.project_id} ({self.week_start_date})"

class DevelopmentPlan(models.Model):
    plan_id = models.AutoField(primary_key=True)
    review_id = models.ForeignKey(Review, on_delete=models.CASCADE, db_column='review_id')

    def __str__(self):
        return f"Plan for {self.review_id}"

class DevelopmentGoal(models.Model):
    action_id = models.AutoField(primary_key=True)
    plan_id = models.ForeignKey(DevelopmentPlan, on_delete=models.CASCADE, db_column='plan_id')
    goal_description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('done', 'Done')
    ], default='planned')

    def __str__(self):
        return f"{self.goal_description} ({self.status})"