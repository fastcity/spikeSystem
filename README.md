# spikeSystem

### 简单的12306 并发抢票逻辑node 实现，源来自：[12306抢票](https://github.com/GuoZhaoran/spikeSystem)

## QuickStart

+ redis 

   + init ,设置总票数10000，当前已卖0
   ```
   hmset ticket_hash_key "ticket_total_nums" 10000 "ticket_sold_nums" 0
   ```
+ api

    ```bash
    $ npm i
    $ npm run dev
    $ open http://localhost:7001/buy/ticket
    ```