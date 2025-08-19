from django.http.response import JsonResponse


def homeView(request):
    return JsonResponse({"message": "FoundrCard API!"})
