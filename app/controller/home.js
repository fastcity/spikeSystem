'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, egg';
	}

	async tickets() {
		const { app, ctx } = this
		const local = await ctx.service.redis.localTicket()

		if (local.success) {
			const remote = await ctx.service.redis.remoteTicket()

			if (remote.success) {

				console.log('success', local.count);

				ctx.body = {
					code: 0,
					data: 'success'
				}
			}
			return

		}

		ctx.body = {
			code: 40000,
			data: 'fail'
		}

	}
}

module.exports = HomeController;
