#这个文件是flask后端，用来路由请求的
from flask import Flask, request
import getdata
import baostockapi
app=Flask(__name__)

@app.route('/price',methods=['POST'])
def index():
    #判断请求参数是否是json
    if not request.is_json:
        return {
            'code':10001,
            'msg':'请求参数类型不是json',
            'data':None,
        }  
    #解析json数据，依然是json格式的，网络上传递的json数据的关键字都是字符串型而不是变量，所以需要通过字符串引用
    p=request.get_json()
    if 'searchObj' not in p.keys():
        return {
            'code':10001,
            'msg':'字段不存在',
            'data':None
        }
    #判断字段是否为空
    if not p['searchObj']:
        return {
            'code':10001,
            'msg':'字段非法',
            'data':None
        }
    searchObj=p['searchObj']
    #获取股票历史价格
    json_data=baostockapi.getdata(searchObj['code'],searchObj['startDate'],searchObj['endDate'],searchObj['frequency'],searchObj['adjustFlag'])
    print(json_data)
    #获取失败
    if json_data['error_code']!='0':
        return{
            'code':10002,
            'msg':json_data['error_msg'],
            'data':None
        }
    #获取成功
    #dataframe类型的变量不能被序列化为json字符串
    return {
        'code':0,
        'msg':'请求成功',
        'data':json_data['data_list']
    }

@app.route('/basic_info',methods=['POST'])
def get_basic_info():
    #判断请求参数是否是json
    if not request.is_json:
        return {
            'code':10001,
            'msg':'请求参数类型不是json',
            'data':None,
        }  
    #解析json数据，依然是json格式的，网络上传递的json数据的关键字都是字符串型而不是变量，所以需要通过字符串引用
    p=request.get_json()
    if 'searchData' not in p.keys():
        return {
            'code':10001,
            'msg':'字段不存在',
            'data':None
        }
    #判断字段是否为空
    if not p['searchData']:
        return {
            'code':10001,
            'msg':'字段非法',
            'data':None
        }
    searchData=p['searchData']
    #获取股票基本信息
    if(searchData['flag']):
        json_data=baostockapi.getBasicInfoByName(searchData['data'])
    else:
        json_data=baostockapi.getBasicInfoByCode(searchData['data'])
    print(json_data)
    #获取失败
    if json_data['error_code']!='0':
        return{
            'code':10002,
            'msg':json_data['error_msg'],
            'data':None
        }
    #获取成功
    #dataframe类型的变量不能被序列化为json字符串
    return {
        'code':0,
        'msg':'请求成功',
        'data':json_data['data_list']
    }

#通过flask实例启动服务
#这行代码的作用是：当这个文件作为模块被其他文件引入时，以下代码不会被执行，只会在直接运行当前文件时执行
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=False)
