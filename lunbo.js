(function(window,undefined){

	//多长时间执行一次，左右按钮是否显示，小图标是否显示
	function LunBo(container_id,opt){
		if(typeof container_id!='string'){
			console.log('第一个参数请输入一个字符串的容器id');
			return;
		}
		this.can_play = false;//初始化完后才能开始动画
		this.container_id = container_id;//轮播图窗口id
		this.opts = opt || {};
		this.timer = null;//定时器句柄
		this.time = this.opts.time || 1500;//轮播切换时间
		this.complete = this.opts.complete || null;//每次播完后的回调函数
		this.arrow_btn_show = this.opts.arrow_btn_show || true;//默认显示左右两个按钮
		this.dots_show = this.opts.dots_show || true;//默认显示小图标（将来可以考虑小图标的显示位置，左，右，中）
		this.img_width = this.opts.img_width;//默认图片的宽度
		this.img_height = this.opts.img_height;//默认图片的高度
		this.$imgs = $('#'+this.container_id).find('li img');//轮播的图片
		this.init();
	}
	LunBo.prototype = {
		constructor : LunBo,
		init : function(){
			this.set_img_wh();//设置图片的宽高
			this.can_play = true;
		},
		play : function(){
			var _this = this;
			if(this.can_play){
				this.timer = setInterval(function(){
					_this.xiaoguo();
				},this.time);
			}
		},
		xiaoguo : function(){
			console.log('轮播效果展示');
		},
		//设置图片的宽高,如果用户只设置了其中一种，则另外一个是auto
		set_img_wh : function(){
			if(this.img_width && this.img_height){//都设置了
				console.log('宽高都设置了');
				this.$imgs.css({width:this.img_width,height:this.img_height});
			}else if(this.img_width){
				console.log('宽设置了');
				this.$imgs.css({width:this.img_width});
			}else if(this.img_height){
				console.log('高设置了');
				this.$imgs.css({height:this.img_height});
			}else{
				console.log('没设置宽高时的默认宽高');
				this.$imgs.css({width:200,height:100});
			}
		}
	}

	window.LunBo = window.LunBo || LunBo;

})(window);