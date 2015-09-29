(function(window,undefined){

	//多长时间执行一次，左右按钮是否显示，小图标是否显示
	function LunBo(opt){
		this.opts = opt || {};
		this.timer = null;//定时器句柄
		this.time = this.opts.time || 500;//轮播切换时间
		this.complete = this.opts.complete || null;//每次播完后的回调函数
		this.container_id = this.opts.container_id || 'lunboId';//轮播图窗口id
		this.arrow_btn_show = this.opts.arrow_btn_show || true;//默认显示左右两个按钮
		this.dots_show = this.opts.dots_show || true;//默认显示小图标（将来可以考虑小图标的显示位置，左，右，中）

	}
	LunBo.prototype = {
		constructor : LunBo,
		play : function(){
			var _this = this;
			this.timer = setInterval(function(){
				_this.xiaoguo();
			},this.time);
		},
		xiaoguo : function(){
			console.log('轮播效果展示');
		}
	}

	window.LunBo = window.LunBo || LunBo;

})(window);