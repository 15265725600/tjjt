var Height = $(window).height() - $('.am-header').height();
$('.c-container').height(Height);
var para = window.location.search;
var token = getCookie('token');
var discount = getCookie('discount');
var ID = GetQueryString('id');
var count = GetQueryString('count');
var maddID = "";

var addID = GetQueryString('addid');
var couID = GetQueryString('couID');

var Pricenum = GetQueryString('Pricenum');

var is_discount = GetQueryString('isdiscount');
var aPrice = 0;
var actualPrice = 0;

//获取商品详情
$.ajax({
	url: reqUrl('goods_detail'),
	type: 'post',
	dataType: 'json',
	data: {
		id: ID
	},
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		var shopD = template('po-i-pic_div', data);
		$('.po-i-pic').html(shopD);
		$('.Num').html(count);
		var is_discount = data.infor[0].is_discount;
		var price = parseInt(data.infor[0].price); //商品单价
		var Num = count; //商品数量
		var total = Num * price; //计算商品总额

		$('.total').text(total) //商品总额

		$('.actual-price').text(aPrice); //实付款
		//判断能否打折
		if(is_discount == 1 && discount > '0.0') {
			actualPrice = Num * price * discount * 0.1 - Pricenum;
			aPrice = total - Pricenum; //原价
			$('.Oprice').text(aPrice);
			$('.actual-price').text(actualPrice.toFixed(2)); //实付款
		} else {
			aPrice = total - Pricenum; //原价
			actualPrice = Num * price - Pricenum;
			$('.Oprice').text(aPrice);
			$('.actual-price').text(actualPrice); //实付款
		};
	},
	error: function(e, request, settings) {
		alert(settings);
	}
});
//首先判断是否有默认地址存在
$.ajax({
	url: reqUrl('delivery_address_list'),
	type: 'post',
	data: {
		token: token
	},
	dataType: 'json',
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		if(data.error_code == 200) {
			window.location.href = preUrl('log/login.html' + para + '&path=index/place-order1.html');
		} else if(data.success) {
			var content = '';
			if(data.infor.totalCount == '0') {
				content = "<a href=\"javascript:;\"><p>添加收货地址</p><i class = \"am-icon-chevron-right am-fr\"></i></a>";
				$('.po-address').html(content);

			} else if(data.infor.totalCount != '0') {
				var arrLen = data.infor.listItems;
				for(var i = 0; i < arrLen.length; i++) {
					if(arrLen[i].is_default == 1) {
						maddID = arrLen[i].id;

						content = "<div class=\"c-i-top\">" +
							"<p><span>" + arrLen[i].name + "</span><span style = \"margin-left:10px;\">" + arrLen[i].mobile + "</span></p>" +
							"<p>" + arrLen[i].district_name + "<i>" + arrLen[i].address + "</i></p>" +
							"<i class = \"am-icon-chevron-right am-fr\"></i>" +
							"</div>";

						$('.po-address').html(content);
					} else if(arrLen[i].id == addID) {
						maddID = arrLen[i].id;
						content = "<div class=\"c-i-top\">" +
							"<p><span>" + arrLen[i].name + "</span><span style = \"margin-left:10px;\">" + arrLen[i].mobile + "</span></p>" +
							"<p>" + arrLen[i].district_name + "<i>" + arrLen[i].address + "</i></p>" +
							"<i class = \"am-icon-chevron-right am-fr\"></i>" +
							"</div>";

						$('.po-address').html(content);
					}
				}
			}
		}

	},
	error: function(e, request, settings) {
		alert(settings);
	}
});

//点击地址弹出地址列表
$('.po-address').click(function() {
	$.ajax({
		url: reqUrl('delivery_address_list'),
		type: 'post',
		data: {
			token: token
		},
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.error_code == 200) {
				window.loaction.href = preUrl('log/login.html' + para + '&path=index/place-order1.html');
			} else if(data.success) {
				var content = '';
				if(data.infor.totalCount == '0') {
					window.location.href = preUrl('my/add-address.html?id=' + ID + '');

				} else if(data.infor.totalCount != '0') {
					window.location.href = preUrl('my/add-contact-address.html?id=' + ID + '&count=' + count + '&couid=' + couID + '');
				}
			}

		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
});
//点击进入优惠券
$('.po-i-discount').click(function() {
	
	window.location.href = preUrl('my/coupon.html?id=' + ID + '&count=' + count + '&addid=' + addID + '&aPrice=' + aPrice + '');

});
//获取优惠券列表
if(Pricenum == null){
	$('.discount').html('0.0');
}else{
	$('.discount').html(Pricenum);
}

//$.ajax({
//	url: reqUrl('coupon_list'),
//	type: 'post',
//	data: {
//		token: token,
//		status: 0,
//		price: 0,
//		page: 0
//	},
//	dataType: 'json',
//	xhrFields: {
//		withCredentials: true
//	},
//	success: function(data) {
//		if(data.error_code == 200) {
//			window.loaction.href = preUrl('log/login.html' + para + '&path=index/place-order1.html');
//		} else if(data.success) {
//			var arrLen = data.infor.listItems;
//			for(var i = 0; i < arrLen.length; i++) {
//				if(arrLen[i].id == couID){
//					console.log(arrLen[i])
//					var price = arrLen[i].num;
//					console.log(price)
//					
//					
//				}else{
//					$('.discount').html('0.0');
//				}
//			}
//			
//		}
//
//	},
//	error: function(e, request, settings) {
//		alert(settings);
//	}
//});





//	提交订单
var type = GetQueryString('type');
var mode = '';
var dea = '';
var first = $('.mt').eq(0);
if(type == 0){
	if(first.attr('checked',true)){
		mode = 1;
		setInfo('dTime',mode);
		dea = getInfo('dTime');
		console.log(dea)
	}
}

$('.mt').click(function() {
	if($(this).attr("checked", true)) {
		mode = $(this).val();
		setInfo('dTime',mode);
		dea = getInfo('dTime');
		console.log(dea)
	}
});

dea = getInfo('dTime');
if(dea == 1){
	$('.mt').eq(0).attr("checked", true);
}else if(dea == 2){
	$('.mt').eq(1).attr("checked", true);
}else if(dea == 3){
	$('.mt').eq(2).attr("checked", true);
}

$('#payment').on('click', function() {
	var remark = $('textarea').val();
	$.ajax({
		type: 'POST',
		url: reqUrl("order_add"),
		data: {
			token: token,
			goods_id: ID,
			coupon_id: couID,
			remark: remark,
			address_id: maddID,
			recipient_time: dea,
			buy_type: 0,
			count: count

		},
		dataType: 'JSON',
		async: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.error_code == 200) {
				window.location.href = preUrl('log/login.html' + para + '&place-order1.html');
			} else if(data.success) {
				var orderID = data.infor[0].orderid;
				console.log(orderID)
				window.location.href = preUrl('index/pay.html?price=' + actualPrice + '&orderID=' + orderID + '')
			}

		},
		error: function(e, request, settings) {
			alert(settings)
		}
	});

})