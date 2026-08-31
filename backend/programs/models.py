from django.db import models

class Program(models.Model):
    SPEC_CHOICES = [
        ('Applied Linguistics & ELT', 'Applied Linguistics & ELT'),
        ('Cultural Studies & Literature', 'Cultural Studies & Literature'),
        ('Communication & Media', 'Communication & Media'),
        ('Translation Studies', 'Translation Studies'),
        ('Interdisciplinary Humanities', 'Interdisciplinary Humanities'),
    ]

    title = models.CharField(max_length=255)
    university = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, choices=SPEC_CHOICES, default='Applied Linguistics & ELT')
    deadline = models.DateField(null=True, blank=True)
    portal_url = models.URLField(max_length=500, blank=True, default='')
    source = models.CharField(max_length=100, default='University Portal')
    tests_info = models.TextField(blank=True, default='Pre-selection calculation + Written Concours + Oral Interview')
    description = models.TextField(blank=True, default='')
    is_saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['deadline', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.university} ({self.city})"


class ChecklistItem(models.Model):
    code = models.CharField(max_length=50, unique=True)
    label = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label} ({'Ready' if self.is_completed else 'Pending'})"
