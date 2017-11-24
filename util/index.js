class Util{
    static getNowFormatDate(){
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    static timestampConvert(timestamp){
        let date = new Date(Number(timestamp));
        let   year=date.getFullYear();
        let   month=date.getMonth()+1;
        let   day=date.getDate();
        return {year,month,day};
    }
    static  getWeekDay(year,month,day){ //dayValue=“2014-01-01”
        let dateStr = `${year}/${month}/${day}`;
        let date = new Date(Date.parse(dateStr)); //将日期值格式化
        let today = new Array("日","一","二","三","四","五","六"); //创建星期数组
        return today[date.getDay()];  //返一个星期中的某一天，其中0为星期日
    }
    static isLeapYear(year){
        if(year%4==0 && year%100!=0){
            return true;
        }
        else{
            if(year%400==0){
                return true;
            }
            else{
                return false;
            }
        }
    }
    static monthDayNum(year,month){
        let dayNum = 30;
        if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
            dayNum = 31;
        }
        else if(month==4 || month==6 || month==9 || month==11){
            dayNum = 30;
        }
        else if(month==2 && Util.isLeapYear(year)){
            dayNum = 29;
        }
        else{
            dayNum = 28;
        }
        return dayNum;
    }
    static getMonthAry(year,month){
        let monthAry = [];
        let dayNum = Util.monthDayNum(year,month);
        let date = [];
        let week = [];
        for(let i = 0; i < dayNum; i++){
            let dayData = {year,month};
            let day = i + 1;
            dayData.day = day;
            dayData.ActiveAry = [];
            dayData.weekDay = Util.getWeekDay(year,month,day);
            dayData.workingDays =  (dayData.weekDay == '六' || dayData.weekDay == '日') ?  false : true; //加标识如果是工作日就是true 不是就是false
            monthAry.push(dayData);
            if(dayData.workingDays){ // 是否是工作日
                date.push(dayData.day);
                week.push(dayData.weekDay);
            }
        }
        return {date,week,monthAry};
    }
}
module.exports = Util;