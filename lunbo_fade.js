(function(window,undefined){

	function Fade(container_id,opt){
		LunBo.call(this,container_id,opt);
		this.i_now_z_index = 1;//当前最上面图片的z-index值，初始为1
		this.cssurl = 'fade.css';
		this.init();
	}
	Fade.prototype = new LunBo('blank',{});//这里new的父类的对象传的参数只是为了满足创建时不报错，没有实际意义，因为子类有这两个参数，查找时肯定会在子类查找到，不会再去父类查找
	Fade.prototype.xiaoguo_prcess = function(){
		//console.log(this.prev+'---子类具体效果展示...'+this.i_now);
		this.i_now_z_index++;
		this.$lis.eq(this.prev).fadeOut('slow');
		this.$lis.eq(this.i_now).css('z-index',this.i_now_z_index).fadeIn('slow');
	}

	Fade.prototype.set_dot_click = function(){
		var _this = this;
		this.$dots_ul.delegate('>li','click',function(index){
			var index = _this.$dots_ul.find('>li').index($(this));
			_this.xiaoguo(index);
		});
	}
	Fade.prototype.loadcss = function(){
		var csslink = $('<link rel="stylesheet" href="'+this.cssurl+'" id="fade_css1">');
		if($('#fade_css1').length==0){
			$(document).find('head:eq(0)').append(csslink);
		}
	}

	window.Fade = window.Fade || Fade;
})(window);

	