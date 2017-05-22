$(function(){
	//加的效果
			$(".add-num").click(function(){
				var n=$(this).prev().val();
				var num=parseInt(n)+1;
				if(num==0){ return;}
				$(this).prev().val(num);
				TotalPrice();
			});
			//减的效果
			$(".del-num").click(function(){
				var n=$(this).next().val();
				var num=parseInt(n)-1;
				if(num==0){ return}
				$(this).next().val(num);
				TotalPrice();
			});	
		//计算价格
		TotalPrice();
		function TotalPrice(){
			var discount = $('.discount').text();//优惠券
			var Num = parseInt($('.t-num').val());//商品数量
			var price = parseFloat($('.Unit-Price').text());//商品单价
			var total = Num * price - discount;
			$('.actual-price').text(total.toFixed(2));
		}
});

 