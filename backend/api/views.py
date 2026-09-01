from ninja import NinjaAPI
from .sheet import get_sheet_data

api = NinjaAPI()

@api.get("/leadtime")
def leadtime(request):
    return {
        "data": get_sheet_data()
    }