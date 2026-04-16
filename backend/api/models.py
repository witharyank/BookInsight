from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    rating = models.FloatField(default=0.0)
    description = models.TextField()
    url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title
