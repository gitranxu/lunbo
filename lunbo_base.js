(function(window,undefined){

	//多长时间执行一次，左右按钮是否显示，小图标是否显示
	//ul必须要有固定的宽高,宽高等于li中最大的宽和最大的高
	//如果用了轮播的懒加载，则一定要提前就规划好ul的宽高，即最好图片的宽高是一致的且提前知道的
	function LunBo(container_id,opt){
		if(typeof container_id!='string'){
			alert('第一个参数请输入一个字符串的容器id');
			return;
		}
		this.can_play = false;//初始化完后才能开始动画
		this.container_id = container_id;//轮播图窗口id
		this.opts = opt || {};
		this.timer = null;//定时器句柄
		this.time = this.opts.time || 1500;//轮播切换时间
		this.complete = this.opts.complete || null;//每次播完后的回调函数
		this.arrow_btn_show = this.opts.arrow_btn_show;//默认显示左右两个按钮
		this.dots_show = this.opts.dots_show;//默认显示小图标（将来可以考虑小图标的显示位置，左，右，中）
		this.move_pause = this.opts.move_pause;//是否鼠标滑过时暂停
		this.img_width = this.opts.img_width;//默认图片的宽度
		this.img_height = this.opts.img_height;//默认图片的高度

		this.can_lazy = this.opts.can_lazy;//默认不进行懒加载
		this.default_src = this.opts.default_src || '';//默认src为空，也可能为1象素图片
		
		this.i_now = 0;//一开始时是0，当前li位置
		this.prev = 0;//前一个(跟i_now和direct有关)
		this.i_times = 0;//播放次数，每播一次效果，则加1
		this.$container = $('#'+this.container_id);
		this.$ul = $('#'+this.container_id+' > ul');
		this.$lis = this.$ul.find('>li');
		this.$imgs = this.$ul.find('>li img');//轮播的图片

		this.$dots = null;
		this.$dots_ul = null;
		this.li_length = this.$lis.length;
		this.direct = this.opts.direct || 'right';//轮播方向一共两个方向(看小图标的方向，就是左右)
		this.dot_align = this.opts.dot_align || 'left';
	}
	LunBo.prototype = {
		constructor : LunBo,
		init : function(){
			//console.log('init...');
			var _this = this;
			this.loadcss();//引入相关CSS文件
			this.set_img_wh();//设置图片的宽高
			setTimeout(function(){
				_this.set_ul_wh();//设置ul的宽高
				_this.set_dots();//设置小图标
			},0);
			
			this.can_play = true;
			
			this.set_mouse_inout();//设置鼠标滑过时的效果
		},
		loadcss : function(){},
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
		xiaoguo : function(index){
			this.set_index(index);
			this.xiaoguo_prcess();
			this.move_dots();//让小图标移动起来
			if(this.can_lazy){
				this.lazy_load();
			}
			this.callback();
		},
		lazy_load : function(){
			var $li_img_now = this.$lis.eq(this.i_now).find('>img');
			var src = $li_img_now.attr('src');

			if(src == this.default_src){
				var _src = $li_img_now.attr('_src');
				$li_img_now.attr('src',_src);
			}
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
			//console.log('父类具体效果实现');
		},
		set_dots : function(){
			if(this.dots_show){//如果要显示小图标
				this.$container.append(this.get_dots_html());
				this.$dot_lis = this.$container.find('.dots li');

		
				this.set_dots_align();//设置小图标的对齐位置

				this.set_dot_click();//设置小图标的点击事件
			}
		},
		set_dot_click : function(){},
		move_dots : function(){
			//console.log('父类 '+this.prev+'======'+this.i_now);
			if(this.dots_show){
				this.$dot_lis.removeClass('active').eq(this.i_now).addClass('active');
			}
		},
		get_dots_html : function(){
			var html = '<div class="dots"><ul class="clear">';
			for(var i = 0, j = this.li_length;i < j;i++){
				if(i == 0){
					html += '<li class="active">'+(i+1)+'</li>';
				}else{
					html += '<li>'+(i+1)+'</li>';
				}
				
			}
			html += '</ul></div>';
			return html;
		},
		set_index : function(index){
			if(this.direct=='right'){
				this.i_times++;
			}else{
				this.i_times--;
			}
			if(index!=undefined){
				this.prev = this.i_now;
				this.i_now = index;
				this.i_times = index;
			}else{
				this.i_now = this.i_times % this.li_length;
				if(this.direct=='right'){
					this.prev = this.i_now - 1;
				}else{
					this.prev = this.i_now - 0 + 1;
				}
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
				//console.log('没设置宽高时的默认宽高');
				this.$imgs.css({width:200,height:100});
			}
		},
		//ul必须要有固定的宽高,宽高等于li中最大的宽和最大的高
		set_ul_wh : function(){
			var max_h = this.$ul.outerHeight();
			var max_w = this.$ul.outerWidth();
			this.$lis.each(function(){
				var me = $(this),
				width = me.outerWidth(),
				height = me.outerHeight();
				if(width > max_w){
					max_w = width;
				}
				if(height > max_h){
					max_h = height;
				}
			});
			this.ul_w = max_w;
			this.ul_h = max_h;
			this.$ul.css({width:max_w,height:max_h});
		},
		set_dots_align : function(){
			this.$dots = this.$container.find('.dots');
			this.$dots_ul = this.$dots.find('>ul');

			var dots_width = this.$dots.width();
			var u_width = this.$dots_ul.width();
			var left = 0;//默认就是左
			if(this.dot_align=='center'){
				left = (dots_width - u_width)/2;
			}else if(this.dot_align=='right'){
				left = dots_width - u_width;
			}

			this.$dots_ul.css("left",left);
		},
		set_mouse_inout : function(){
			var _this = this;
			if(!this.move_pause){
				return;//默认情况下如果不设置，则没有暂停效果
			}
			this.$container.mouseenter(function(){
				_this.pause();
			});
			this.$container.mouseleave(function(){
				_this.play();
			});
		}
	}

	window.LunBo = window.LunBo || LunBo;

})(window);