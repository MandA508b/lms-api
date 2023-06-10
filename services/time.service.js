
class timeService{

    async getDate(param){// param: minimum - 1, need to set month
        try{
            let date = new Date(),
                dd = String(date.getDate()).padStart(2, '0'),
                mm = String(date.getMonth() + param).padStart(2, '0'), //January is 0!
                yyyy = date.getFullYear();

            if(mm > '12' ){
                yyyy += Math.floor(mm/12)
                mm -= Math.floor(mm/12)*12
            }

            return {dd, mm, yyyy}
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new timeService()
