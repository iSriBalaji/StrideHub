from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Person

User = get_user_model()

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_person_for_user(sender, instance: User, created, **kwargs):
    if created and not hasattr(instance, 'person'):
        # Try matching existing Person by email first
        person = None
        if instance.email:
            person = Person.objects.filter(email=instance.email).first()
        if person and person.user is None:
            person.user = instance
            if not person.first_name and instance.first_name:
                person.first_name = instance.first_name
            if not person.last_name and instance.last_name:
                person.last_name = instance.last_name
            person.save()
        elif not person:
            Person.objects.create(
                user=instance,
                first_name=instance.first_name or instance.username,
                last_name=instance.last_name or "",
                email=instance.email or f"{instance.username}@example.invalid",
                is_active=instance.is_active,
            )
