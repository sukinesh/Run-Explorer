
# -----------------------------------------------------
# ---------------------------------------------------


# RUN : fnm use 22 -> from powershell 7 before using emulator or deploy

# -------------------------------------------------------


# from flask import Flask, request, jsonify
from firebase_functions import https_fn , options
from geocoder import revGeoCoding
import json

# app = Flask(__name__)

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"]))
def rev_geocoding(req: https_fn.Request) -> https_fn.Response:

# @app.route('/', methods=['GET'])
# def get_data():
    # query = request.get_json()
    lat = req.args.get("lat")
    lng = req.args.get("lng")

    # data = revGeoCoding(lat,lng)
    if lat is None or lng is None:
        return https_fn.Response("Not enough parameter")

    location = revGeoCoding(lat,lng)
    print(location)
    return https_fn.Response(json.dumps(location))

# if __name__ == '__main__':
#     app.run(debug=True)
