
class timeService{

    async getDate(param){// param: minimum - 1, need to set month
        try{
            let date = new Date(),
                dd = String(date.getDate()).padStart(2, '0'),
                m = String(date.getMinutes()).padStart(2, '0'),
                s = String(date.getSeconds()).padStart(2, '0'),
                h = String(date.getHours()).padStart(2, '0'),
                ms = String(date.getMilliseconds()).padStart(2, '0'),
                mm = String(date.getMonth() + param).padStart(2, '0'), //January is 0!
                yyyy = date.getFullYear();

            console.log(date)

            if(mm > '12' ){
                yyyy += Math.floor(mm/12)
                mm -= Math.floor(mm/12)*12
            }

            return {ms, s, m, h, dd, mm, yyyy}
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new timeService()
