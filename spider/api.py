#这个文件是flask后端，用来路由请求的
from flask import Flask, request
import getdata

app=Flask(__name__)

@app.route('/',methods=['POST'])
def index():
    #判断请求参数是否是json
    if not request.is_json:
        return {
            'code':10001,
            'msg':'请求参数类型不是json',
            'data':None,
        }  
    #判断searchKey字段是否存在于请求参数中
    p=request.get_json()
    if 'searchKey' not in p.keys():
        return {
            'code':10001,
            'msg':'字段不存在',
            'data':None
        }
    #判断字段是否为空
    if p['searchKey']=='':
        return {
            'code':10001,
            'msg':'字段非法',
            'data':None
        }
    searchKey=p['searchKey']
    #获取股票历史价格
    json_data=getdata.get_data(searchKey=searchKey)
    #获取失败
    if json_data is None:
        return{
            'code':10002,
            'msg':'请求发生错误',
            'data':None
        }
    #获取成功
    return {
        'code':0,
        'msg':'请求成功',
        'data':json_data
    }

#通过flask实例启动服务
#这行代码的作用是：当这个文件作为模块被其他文件引入时，以下代码不会被执行，只会在直接运行当前文件时执行
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=False)