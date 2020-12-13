import pandas as pd
import baostock as bs

def getdata(searchKey,startdate,enddate,frequency,adjustflag):
    #登录系统
    lg=bs.login()
    #打印返回信息看登陆是否成功
    print('login respond error_code:'+lg.error_code)
    print('login respond error_msg:'+lg.error_msg)

    #获取历史K线数据
    #根据“历史行情指标参数”章节设置的指标参数，必填
    if(frequency=='w' or frequency=='m'):
        queryString="date,code,open,high,low,close,volume,amount,adjustflag,turn,pctChg"
    elif frequency=='d':
        queryString="date,code,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,peTTM,psTTM,pcfNcfTTM,pbMRQ,isST"
    else:
        queryString="date,time,code,open,high,low,close,volume,amount,adjustflag"
    rs=bs.query_history_k_data_plus(searchKey,queryString,start_date=startdate,end_date=enddate,frequency=frequency,adjustflag=adjustflag)
    print('query_history_k_data_plus respond error_code:'+rs.error_code)
    print('query_history_k_data_plus respond error_msg:'+rs.error_msg)

    obj={}

    if(rs.error_code!='0'):
        obj['error_code']=rs.error_code
        obj['error_msg']=rs.error_msg
        return obj
        

    #print(type(rs))#<class 'baostock.data.resultset.ResultData'>
    #打印结果集
    data_list=[]
    while(rs.error_code=='0' and rs.next()):
    #获取一条记录，将记录合并在一起
        data_list.append(rs.get_row_data())
    obj['error_code']='0'
    obj['data_list']=data_list
    #登出系统
    bs.logout()

    return obj

def getBasicInfoByCode(searchCode):
    # 登陆系统
    lg = bs.login()
    # 显示登陆返回信息
    print('login respond error_code:'+lg.error_code)
    print('login respond  error_msg:'+lg.error_msg)

    # 获取证券基本资料
    rs = bs.query_stock_basic(code=searchCode)
    
    print('query_stock_basic respond error_code:'+rs.error_code)
    print('query_stock_basic respond  error_msg:'+rs.error_msg)

    obj={}

    if(rs.error_code!='0'):
        obj['error_code']=rs.error_code
        obj['error_msg']=rs.error_msg
        return obj

    #print(type(rs))#<class 'baostock.data.resultset.ResultData'>
    #打印结果集
    data_list=[]
    while(rs.error_code=='0' and rs.next()):
    #获取一条记录，将记录合并在一起
        data_list.append(rs.get_row_data())
    obj['error_code']='0'
    obj['data_list']=data_list
    #登出系统
    bs.logout()

    return obj

def getBasicInfoByName(name):
    # 登陆系统
    lg = bs.login()
    # 显示登陆返回信息
    print('login respond error_code:'+lg.error_code)
    print('login respond  error_msg:'+lg.error_msg)

    # 获取证券基本资料
    rs = bs.query_stock_basic(code_name=name)  # 支持模糊查询
    print('query_stock_basic respond error_code:'+rs.error_code)
    print('query_stock_basic respond  error_msg:'+rs.error_msg)

    obj={}

    if(rs.error_code!='0'):
        obj['error_code']=rs.error_code
        obj['error_msg']=rs.error_msg
        return obj
        
    #print(type(rs))#<class 'baostock.data.resultset.ResultData'>
    #打印结果集
    data_list=[]
    while(rs.error_code=='0' and rs.next()):
    #获取一条记录，将记录合并在一起
        data_list.append(rs.get_row_data())
    obj['error_code']='0'
    obj['data_list']=data_list
    #登出系统
    bs.logout()

    return obj