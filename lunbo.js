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
		
		
		this.i_now = 0;//一开始时是0，当前li位置
		this.prev = 0;//前一个(跟i_now和direct有关)
		this.i_times = 0;//播放次数，每播一次效果，则加1
		this.$ul = $('#'+this.container_id+' > ul');
		this.$lis = this.$ul.find('li');
		this.$imgs = this.$ul.find('li img');//轮播的图片
		this.li_length = this.$lis.length;
		this.direct = this.opts.direct || 'right';//轮播方向一共两个方向(看小图标的方向，就是左右)

		this.init();
	}
	LunBo.prototype = {
		constructor : LunBo,
		init : function(){
			this.set_img_wh();//设置图片的宽高
			this.can_play = true;
			this.set_ul();//设置ul的高度
		},
		play : function(){
			var _this = this;
			if(this.can_play){
				this.timer = setInterval(function(){
					_this.xiaoguo();
				},this.time);
			}
		},
		pause : function(){
			clearInterval(this.timer);
			this.timer = null;
		},
		xiaoguo : function(){
			this.xiaoguo_prcess();
			this.set_index();
			this.callback();
		},
		callback : function(){
			if(this.complete){
				if(typeof this.complete == 'function'){
					this.complete.call(this);
				}else{
					alert('回调参数应该是一个函数');
				}
			}
		},
		xiaoguo_prcess : function(){
			console.log('父类具体效果实现');
		},
		set_index : function(){
			if(this.direct=='right'){
				this.i_times++;
			}else{
				this.i_times--;
			}
			this.i_now = this.i_times % this.li_length;
			if(this.direct=='right'){
				this.prev = this.i_now - 1;
			}else{
				this.prev = this.i_now - 0 + 1;
			}
			
		},
		//设置图片的宽高,如果用户只设置了其中一种，则另外一个是auto
		set_img_wh : function(){
			if(this.img_width && this.img_height){//都设置了
				this.$imgs.css({width:this.img_width,height:this.img_height});
			}else if(this.img_width){
				this.$imgs.css({width:this.img_width});
			}else if(this.img_height){
				this.$imgs.css({height:this.img_height});
			}else{
				console.log('没设置宽高时的默认宽高');
				this.$imgs.css({width:200,height:100});
			}
		},
		set_ul : function(){}
	}

	function Fade(container_id,opt){
		LunBo.call(this,container_id,opt);
		this.i_now_z_index = 1;//当前最上面图片的z-index值，初始为1
	}
	Fade.prototype = new LunBo('blank',{});//这里new的父类的对象传的参数只是为了满足创建时不报错，没有实际意义，因为子类有这两个参数，查找时肯定会在子类查找到，不会再去父类查找
	Fade.prototype.xiaoguo_prcess = function(){
		console.log('子类具体效果展示...');
		this.i_now_z_index++;
		if(this.prev==this.i_now){//如果相同，说明是初始化，不需要执行下面的效果
			return;
		}
		this.$lis.eq(this.prev).fadeOut('slow');
		this.$lis.eq(this.i_now).css('z-index',this.i_now_z_index).fadeIn('slow');
	}
	Fade.prototype.set_ul = function(){
		//设置图片的高度，就可以让其所在的li有高度，进而让ul也有高度
		this.$ul.height(this.$lis.height());
	}

	window.Fade = window.Fade || Fade;

})(window);