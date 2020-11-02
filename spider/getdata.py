# import requests #帮助发送网络请求的库
# from bs4 import BeautifulSoup #页面解析库，需要配合解析器使用，本项目使用的是lxml
# import re #正则表达式
# import datetime #日期
# import execjs #调用js，让python读懂网站代码
import json #json序列化与反序列化
import urllib.request,urllib.error, sys
from datetime import date,timedelta
from dateutil.relativedelta import relativedelta

def get_data(searchKey):
    #创建session会话，接下来发送请求时使用session，session会保存服务器发送过来的信息
    #session=requests.session()
    #构造请求接口的url
    host = 'http://stock.market.alicloudapi.com'
    path = '/sz-sh-stock-history'
    method = 'GET'
    appcode = '7a94d53b600d40c79b218f4623fd532c'
    querys = 'begin={}&code={}&end={}'.format(date.today()-timedelta(days=1),searchKey,date.today())
    bodys = {}
    url = host + path + '?' + querys
    print(url)
    #对接口发起get请求
    #python3中urllib.request对象是一个模块。需要通过.Request()创建这个模块的对象，和Python2不同
    request = urllib.request.Request(url)
    request.add_header('Authorization', 'APPCODE ' + appcode)
    #打开url，返回的值是http.client.HTTPResponse类型的对象
    response = urllib.request.urlopen(request)

    #通过HTTPResponse对象的read方法得到content,返回值是bytes类型的
    content = response.read()
    #请求成功则将bytes数据解析成json格式，否则返回空值
    if (content):
        print(content)
        content = json.loads(content.decode('utf-8'))
    else:
        print('error2')
        return None
    #构造图表需要的数据
    list_data=[]
    for i in content['showapi_res_body']['list']:
        #交易金额
        trade_money=i['trade_money']
        #股票代码
        code=i['code']
        #开盘价
        open_price=i['open_price']
        #收盘价
        close_price=i['close_price']
        #日期
        today=i['date']
        #市场
        market=i['market']
        #最低价
        min_price=i['min_price']
        #交易手数
        trade_num=i['trade_num']
        #最高价
        max_price=i['max_price']
        #diff_money
        diff_money=i['diff_money']
        #turnover
        turnover=i['turnover']
        #swing
        swing=i['swing']
        #diff_rate
        diff_rate=i['diff_rate']
        list_data.append({'trade_money':trade_money,'code':code,'open_price':open_price,'close_price':close_price,
        'date':today,'market':market,'min_price':min_price,'trade_num':trade_num,'max_price':max_price,'diff_money':diff_money,
        'turnover':turnover,'swing':swing,'diff_rate':diff_rate})
    json_data={}
    json_data['list_data']=list_data
    print(json_data)
    return json_data

if __name__ == '__main__':
    #单元测试，获取历史价格
    searchKey='600004'
    j=get_data(searchKey)
    file=open('result.json','w',encoding='utf-8')
    #将python的对象转化成json
    json.dump(j,file)
    file.close()