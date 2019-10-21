
const Controller = require('egg').Controller;

class RedisAcctroll extends Controller {

    async localTicket() {
        let { total, count } = this.app.config.ticket.local

        this.app.config.ticket.local.count++

        return {
            success: total >= this.app.config.ticket.local.count,
            count: this.app.config.ticket.local.count
        }
    }


    async remoteTicket() {

        const luaScript = `
        local ticket_key = KEYS[1]
        local ticket_total_key = ARGV[1]
        local ticket_sold_key = ARGV[2]
        local ticket_total_nums = tonumber(redis.call('HGET', ticket_key, ticket_total_key))
        local ticket_sold_nums = tonumber(redis.call('HGET', ticket_key, ticket_sold_key))
		-- 查看是否还有余票,增加订单数量,返回结果值
        if(ticket_total_nums >= ticket_sold_nums) then
            return redis.call('HINCRBY', ticket_key, ticket_sold_key, 1)
        end
        return 0
`

        const tickets = {
            name: 'ticket',
            code: luaScript,
            keysLength: 1,
            param: [
                'ticket_hash_key',
                'ticket_total_nums',
                'ticket_sold_nums',
            ],

        }


        // const p = () => new Promise((resolve, reject) => {
        //     const ticket_key = 'ticket_hash_key'
        //     const ticket_total_nums = 'ticket_total_nums'
        //     const ticket_sold_nums = 'ticket_sold_nums'
        //     this.app.redis.script('load', LuaScript, (err, sha) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             this.app.redis.evalsha(sha, 1, ticket_key, ticket_total_nums, ticket_sold_nums, (err, result) => {
        //                 if (err) {
        //                     reject(err);
        //                 } else {
        //                     resolve(result);
        //                 }
        //             });
        //         }
        //     });
        // })

        // const res = await p()


        const res = await this.app.redisRun(tickets)


        return {
            success: res > 0,
            count: res
        }

    }
}

module.exports = RedisAcctroll