var Height = $(window).height() - $('.am-header').height();
$('.c-container').height(Height);
var para = window.location.search;
var token = getCookie('token');
var discount = getCookie('discount');
console.log(discount)
var maddID = "";
var addID = GetQueryString('addid');
var couID = GetQueryString('couID');
var Pricenum = GetQueryString('Pricenum');
var is_discount = GetQueryString('isdiscount');
console.log(is_discount)
var idString = GetQueryString('idString');
var MID = idString.split(',');
var token = getCookie('token');
var aPrice = 0;
var oPrice = 0;
var actualPrice = 0;
//获取商品列表
$(function() {

	$.ajax({
		url: reqUrl('shopping_cart_list'),
		type: 'post',
		dataType: 'json',
		data: {
			token: token
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			var arrLen = data.infor.listItems;
			var a = "";
			var html = "";

			var total = 0;
			for(var i = 0; i < MID.length; i++) {
				a = MID[i];
				for(var j = 0; j < arrLen.length; j++) {
					var b = arrLen[j].goods_id;
					if(a == b) {
						html += "<div class=\"po-i-pic border-b clearfix\">" +
							"<div class=\"i-p-left am-fl\"><img src=\"" + arrLen[j].goods_img + "\" alt=\"\" /></div>" +
							"<div class=\"i-p-right\">" +
							"<p class = \"shop-name\">" + arrLen[j].goods_name + "</p>" +
							"<span>￥<i class = \"Unit-Price\">" + arrLen[j].price + "</i><em class = \"gray quantity\">x<i class = \"Num\">" + arrLen[j].count + "</i></em></span>" +
							"</div>" +
							"</div>";
						total += arrLen[j].price * arrLen[j].count; //计算商品总额

						//判断能否打折
						if(arrLen[j].is_discount == 1 && discount > '0.0') {
							aPrice += arrLen[j].price * arrLen[j].count * discount * 0.1; //折扣价

						} else {
							aPrice += arrLen[j].price * arrLen[j].count; //原价

						};
						console.log(actualPrice);
					}
				}
				$('.mshop_list').html(html)
			}
			oPrice = total - Pricenum;
			actualPrice = aPrice - Pricenum;
			$('.total').text(total.toFixed(2)) //商品总额
			$('.Oprice').text(oPrice.toFixed(2));
			$('.actual-price').text(actualPrice.toFixed(2)); //实付款
		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
})

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
			window.location.href = preUrl('log/login.html' + para + '&path=index/place-order-more.html');
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
			} else {
				mask(data.msg)
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
				window.loaction.href = preUrl('log/login.html' + para + '&path=index/place-order-more.html');
			} else if(data.success) {
				var content = '';
				if(data.infor.totalCount == '0') {
					window.location.href = preUrl('my/add-address1.html?idString=' + idString + '');

				} else if(data.infor.totalCount != '0') {
					window.location.href = preUrl('my/add-contact-address1.html?idString=' + idString + '&couID='+couID+'');
				}
			}

		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
})
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
//			window.loaction.href = preUrl('log/login.html' + para + '&path=index/place-order-more.html');
//		} else if(data.success) {
//			var arrLen = data.infor.listItems;
//			for(var i = 0; i < arrLen.length; i++) {
//				if(arrLen[i].id == couID){
//					
//					var price = arrLen[i].num;
//					console.log(price)
//					$('.discount').html(price);
//				}else{
//					$('.discount').html('0.0');
//				}
//			}
//		}
//
//	},
//	error: function(e, request, settings) {
//		alert(settings);
//	}
//});

//点击进入优惠券
$('.po-i-discount').click(function() {
	window.location.href = preUrl('my/coupon1.html?idString=' + idString + '&addid=' + addID + '&aPrice=' + aPrice + '');

});

//	选择送货时间
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
console.log(dea)
if(dea == 1){
	$('.mt').eq(0).attr("checked", true);
}else if(dea == 2){
	$('.mt').eq(1).attr("checked", true);
}else if(dea == 3){
	$('.mt').eq(2).attr("checked", true);
}

//提交订单
$('#payment').on('click', function() {
	var remark = $('textarea').val();
	$.ajax({
		type: 'POST',
		url: reqUrl("order_add"),
		data: {
			token: token,
			goods_id: idString,
			coupon_id: couID,
			remark: remark,
			address_id: maddID,
			recipient_time: dea,
			buy_type: 1,
			count: 0

		},
		dataType: 'JSON',
		async: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.error_code == 200) {
				window.location.href = preUrl('log/login.html' + para + '&place-order-more.html');
			} else if(data.success) {
				var orderID = data.infor[0].orderid;
				window.location.href = preUrl('index/pay.html?orderID=' + orderID + '&price=' + actualPrice + '')
			}

		},
		error: function(e, request, settings) {
			alert(settings)
		}
	});

});