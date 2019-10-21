'use strict';

const redis = require("redis")

module.exports = app => {
    app.beforeStart(() => {
        // 应用会等待这个函数执行完成才启动
        const { host, port } = app.config.redis;

        app.redis = redis.createClient(port || 6379, host || 'localhost')

        // 用于记录已在redis缓存过的脚本sha码
        const bufferScript = {};

        const script = {
            name: 'ticket',
            code: `
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
            `,
            keysLength: 1,

            // param: {
            //     ticket_key: 'ticket_hash_key',
            //     ticket_total_nums: 'ticket_total_nums',
            //     ticket_sold_nums: 'ticket_sold_nums',

            // },
            param: [
                'ticket_hash_key',
                'ticket_total_nums',
                'ticket_sold_nums',
            ],
        };


        app.redisRun = (body) => {
            const { code, keysLength, param, name } = body || script

            return new Promise((resolve, reject) => {
                if (!app.redis) {
                    reject('redisClient is no ready');
                } else {
                    if (bufferScript[name]) {
                        const { code, keysLength, param } = bufferScript[name]
                        app.redis.evalsha(code, keysLength, ...param, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    } else {
                        app.redis.script('load', code, (err, sha) => {
                            if (err) {
                                reject(err);
                            } else {
                                bufferScript[name] = {
                                    code: sha,
                                    keysLength, keysLength,
                                    param: param
                                }

                                app.redis.evalsha(sha, keysLength, ...param, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }

    });
};
