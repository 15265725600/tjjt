$(function() {
	//获取详情信息
	var Id = GetQueryString('id');
	var para = window.location.search;

	$.ajax({
		url: reqUrl('goods_detail'),
		type: 'post',
		dataType: 'json',
		data: {
			id: Id
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			var shop_datails_div = template('shop_datails_div', data);
			$("#shop_datail_box").html(shop_datails_div);
			var shopbuy_div = template('shopbuy_div', data);
			$('#my-shopbuy').html(shopbuy_div);
			var addshopcart_div = template('addshopcart_div', data);
			$('#my-shopcart').html(addshopcart_div);
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationClickable: true,
				spaceBetween: 0,
				loop: true,
			});
			$('.am-gallery').pureview();

			var num = parseInt($('.t-num').val());
			var isdiscount = data.infor[0].is_discount;

			$('#buyNow').click(function() {
				window.location.href = preUrl('index/place-order1.html?id=' + Id + '&count=' + num + '&isdiscount=' + isdiscount + '');
			})
			//加的效果
			$(".add-num").click(function() {
				var n = $(this).prev().val();
				var num = parseInt(n) + 1;
				if(num == 0) {
					return;
				}
				$(this).prev().val(num);

				console.log(num)
				$('#buyNow').click(function() {
					var infor = data.infor[0];
					window.location.href = preUrl('index/place-order1.html?id=' + Id + '&count=' + num + '&isdiscount=' + isdiscount + '');
				})

			});
			//减的效果
			$(".del-num").click(function() {
				var n = $(this).next().val();
				var num = parseInt(n) - 1;
				if(num == 0) {
					return
				}
				$(this).next().val(num);
				console.log(num)
				$('#buyNow').click(function() {
					var infor = data.infor[0];
					window.location.href = preUrl('index/place-order1.html?id=' + Id + '&count=' + num + '&isdiscount=' + isdiscount + '');
				})
			});

			//立即购买

			//加入购物车
			$('#addshopcart').click(function() {
				$.ajax({
					url: reqUrl('oper_shopping_cart'),
					type: 'post',
					dataType: 'json',
					data: {
						token: token,
						goods_id: Id,
						type: 0,
						count: $('.t-num').val()
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(data) {
						if(data.error_code == 200) {
							window.location.href = preUrl('log/login.html' + para + 'path=index/shop-details.html');
						} else {
							$('#num').show().html($('.t-num').val());
						}

					},
					error: function(e, request, settings) {
						alert(settings);
					}
				});
			});

		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
	//加入收藏列表
	var token = getCookie('token');
	$('#share').click(function() {
		$(this).toggleClass('heart-red');
		if($(this).hasClass('heart-red')) {
			$.ajax({
				url: reqUrl('add_collection'),
				type: 'post',
				dataType: 'json',
				data: {
					token: token,
					goods_id: Id
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.error_code == 200) {
						window.location.href = preUrl('log/login.html' + para + 'path=index/shop-details.html');
					}
				},
				error: function(e, request, settings) {
					alert(settings);
				}
			});
		} else {
			$.ajax({
				url: reqUrl('del_collection'),
				type: 'post',
				dataType: 'json',
				data: {
					token: token,
					goods_id: Id
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.error_code == 200) {
						window.location.href = preUrl('log/login.html' + para + 'path=index/shop-details.html');
					}
				},
				error: function(e, request, settings) {
					alert(settings);
				}
			});
		}

	});
	//获取我的收藏列表
	$.ajax({
		url: reqUrl('collection_list'),
		type: 'post',
		dataType: 'json',
		data: {
			token: token
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.error_code == 200) {
				window.location.href = preUrl('log/login.html' + para + 'path=index/shop-details.html');
			} else if(data.success) {
				var arrLen = data.infor.listItems;
				for(var i = 0; i < arrLen.length; i++) {
					if(arrLen[i].goods_id == Id) {
						$('#share').addClass('heart-red')
					}
				}
			}
		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
	//评价列表

});