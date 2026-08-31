from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse

def index_view(request):
    index_path = settings.BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse("Frontend build index.html not found.", status=404)

dist_dir = settings.BASE_DIR.parent / 'frontend' / 'dist'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('programs.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': dist_dir / 'assets'}),
    re_path(r'^(?P<path>.*\.svg)$', serve, {'document_root': dist_dir}),
    re_path(r'^.*$', index_view),
]
