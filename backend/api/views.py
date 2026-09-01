from ninja import NinjaAPI
from .sheet import get_sheet_data

api = NinjaAPI()

@api.get("")
def api_root(request):
    return {
        "message": "Lead Calculator API is running",
        "endpoints": [
            "/api/leadtime",
            "/admin/",
        ],
    }

@api.get("/leadtime")
def leadtime(request):
    return {
        "data": get_sheet_data()
    }