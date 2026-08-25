import threading
from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        # Pre-warm the sheet cache in a background thread on server startup.
        # This avoids blocking the first API request on network I/O.
        from .sheet import prewarm_cache
        threading.Thread(target=prewarm_cache, daemon=True).start()
