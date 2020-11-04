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
    rs=bs.query_history_k_data_plus(searchKey,"date,code,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,peTTM,psTTM,pcfNcfTTM,pbMRQ,isST",start_date=startdate,end_date=enddate,frequency=frequency,adjustflag=adjustflag)
    print('query_history_k_data_plus respond error_code:'+rs.error_code)
    print('query_history_k_data_plus respond error_msg:'+rs.error_msg)

    #print(type(rs))#<class 'baostock.data.resultset.ResultData'>
    #打印结果集
    data_list=[]
    while(rs.error_code=='0' and rs.next()):
    #获取一条记录，将记录合并在一起
        data_list.append(rs.get_row_data())
    #构建成pandas的DataFrame数据格式的数据
    result=pd.DataFrame(data_list,columns=rs.fields)

    #输出结果集到csv文件
    result.to_csv("C:\yan\miniprograms\historyPrice\spider\history_k_data.csv",index=False)

    #登出系统
    bs.logout()

    return data_list