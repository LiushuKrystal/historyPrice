from flask import Flask
import json

app = Flask(__name__)


@app.route('/')
def index():
    return {
        "msg": "success",
        "data": "welcome to use flask."
    }

@app.route('/user/<u_id>')
def user_info(u_id):
    return{
        "msg":"success",
        "data":{
            "id":u_id,
            "username":'yuz',
            "age":18
        }
    }

@app.route('/bus/<station>')
def bus_info(station):
    import bus
    info=bus.get_bus_info(station)
    print(info)
    obj={
        "msg":"success",
        "data":json.stringify(info)
    }
    return obj

app.run(debug=True)