//弹出城市页面
$('.location-city').click(function() {
	$('.city-page').show().animate({
		'right': 0
	}, 300);
	$('.alpha-list').show();

})
$('.city-back').click(function() {
	$('.city-page').animate({
		'right': '-100%'
	}, 300).hide();
	$('.alpha-list').hide();
	$('body').scrollTop(0);

});

var arr = [];
$('.city-wrap').find('p').each(function() {
	arr.push($(this).offset().top - 95);

});
$('#keyWords').keydown(function() {
	$('.serch-close').show();
	$('.serch-close').click(function() {
		$('#keyWords').val("").focus();
	})
});

//获取热门城市
$.ajax({
	url: reqUrl('district_list'),
	type: 'post',
	dataType: 'json',
	data: {
		parentid: '-2'
	},
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		var city_list = template('hot-list', data.infor);
		$('.hot-list').html(city_list);
		var totalcount = data.infor.totalCount;

		if(totalcount == 0) {
			$('.hot-wrap').hide();
		} else {
			$('.hot-wrap').show();
		}

	},
	error: function(e, request, settings) {
		alert(settings);
	}
});
//获取城市列表
$.ajax({
	url: reqUrl('district_web_get'),
	type: 'post',
	dataType: 'json',
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		var city_list = template('city_list', data.infor);
		$('.city-wrap').html(city_list);
		filterList($('.city-wrap'), $('#keyWords'));
		$('.alpha-list').on('click', 'a', function() {
			var data = $(this).attr('data');
			var group = $('.index-' + data);
			var _top = group.offset().top;
			$("body,html").animate({
				scrollTop: (_top - 95)
			}, 500);
		});
		$('.city-list a').on('click', function() {
			var text = $(this).text();
			setInfo('city_name', text);
			var ss = getInfo('city_name');
			$('.location-city').find('i').html(ss);
			//历史搜索

			$('.city-page').show().animate({
				'right': '-100%'
			}, 300);
			$('.alpha-list').hide();
			$('body').scrollTop(0);
		});

	},
	error: function(e, request, settings) {
		alert(settings);
	}
});
var map = new AMap.Map('map', {
	resizeEnable: true,
});
showCityInfo();

//获取用户所在城市信息
function showCityInfo() {
	//实例化城市查询类
	var citysearch = new AMap.CitySearch();
	//自动获取用户IP，返回当前城市
	citysearch.getLocalCity(function(status, result) {
		if(status === 'complete' && result.info === 'OK') {
			if(result && result.city && result.bounds) {
				var cityinfo = result.city;

				document.getElementById('tip').innerHTML = cityinfo;
				$('.Loc-city').html(cityinfo);
				var city = $('#tip').html();
				setInfo('city_name', city);
			}
		} else {
			document.getElementById('tip').innerHTML = result.info;
		}
	});
}
//按关键词搜索

function filterList(list, ff) {
	console.log(ff);
	ff.change(function() {
		var filter = $(this).val();

		if(filter) {
			$matches = $(list).find('a:Contains(' + filter + ')').parents();
			$('li', list).not($matches).slideUp();
			$('.loc-wrap').slideUp();
			$('.city-item p').slideUp();
			$matches.slideDown();

		} else if(filter == '') {
			$('.loc-wrap').slideDown();
			$('.city-item p').slideDown();
			$(list).find("li").slideDown();

		}
		return false;
	}).keyup(function() {
		$(this).change();

	});
}
//历史搜索

function chkcookies(NameOfCookie) {
	var c = document.cookie.indexOf(NameOfCookie + "=");
	if((c == "undefined") || (c == 'undefined') || (typeof(c) == "undefined")) {
		return false;
	}
	return true;
}

function delCookie(NameOfCookie) //删除cookie
{
	document.cookie = NameOfCookie + "=;";
}

function addCookie(NameOfCookie, objValue, expiredays) {
	var oldCookie = getCookie(NameOfCookie);
	//var tmp = typeof(oldCookie);
	//alert(tmp);
	//需要设置过期时长，否则关闭浏览器就会清除cookie
	var exp = new Date();
	exp.setTime(exp.getTime() + expiredays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + exp.toUTCString();
	//alert(expires);
	if((oldCookie == "undefined") || (oldCookie == 'undefined') || (typeof(oldCookie) == "undefined")) {
		document.cookie = NameOfCookie + "=" + objValue + ";" + expires;
	} else {
		document.cookie = NameOfCookie + "=" + oldCookie + "|" + objValue + ";" + expires;
	}
}

function getCookie(NameOfCookie) {
	var arrStr = document.cookie.split("; ");
	for(var i = 0; i < arrStr.length; i++) {
		var temp = arrStr[i].split("=");
		//alert(temp);
		if(temp[0] == NameOfCookie)
			return unescape(temp[1]);
	}
	return "";
}

function AddTextCookie() {
	var data = document.getElementById("input_id1").value;
	addCookie("MY_Test_Text_Cookie", data, 10);
}

function GetTextCookie() {
	document.getElementById("input_id2").value = getCookie("MY_Test_Text_Cookie");
}

function DelTextCookie() {
	delCookie("MY_Test_Text_Cookie");
}


////////////////////////////////////////
//获取未读消息数量
var token = getCookie('token')
$.ajax({
	url: reqUrl('unread_notice_count_get'),
	data: {
		token: token
	},
	type: 'post',
	dataType: 'json',
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		if(data.error_code == 200) {
			window.location.href = preUrl('log/login.html?path=index/index.html');
		} else if(data.success) {
			var count = data.infor[0].count;
			if(count != 0) {
				$('.infor-num').show();
			}

		} else {
			mask(data.msg)
		}

	},
	error: function(e, request, settings) {
		alert(settings);
	}
});

//获取轮播图图片
$(function() {
	$.ajax({
		url: reqUrl('ad_list'),
		data: {
			position: 0
		},
		type: 'post',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {

			var carouselBox = template('carousel-box', data.infor);
			$("#swiper-box").html(carouselBox);
			//轮播图
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationClickable: true,
				spaceBetween: 0,
				loop: true,
				autoplay: 3000
			});
		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
	//首页分类
	$.ajax({
		url: reqUrl('goods_type_all'),
		type: 'post',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {

			var category_list_div = template('category_list_div', data.infor);
			$("#category_list_box").html(category_list_div);
			//              console.log(data.infor)

		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});

	//首页广告
	$.ajax({
		url: reqUrl('ad_list'),
		data: {
			position: 1
		},
		type: 'post',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			var advert_div = template('advert_div', data.infor);
			$("#advert_box").html(advert_div);
		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});
	//平台推荐上拉刷新下拉加载
	var city_ = getInfo('city_name');
	var page = 0;
	var $dropload = $('.jt_recommend').dropload({
		scrollArea: window,
		domDown: {
			domNoData: '<div class="dropload-noData">没有更多</div>'
		},
		loadUpFn: function(me) {
			$.ajax({
				type: 'post',
				url: reqUrl('goods_list'),
				dataType: "json",
				data: {
					keyword: "",
					city: city_,
					one_type: "",
					two_type: "",
					three_type: "",
					four_type: "",
					brand_id: "",
					is_promotion: 0,
					groom_type: "",
					sort: 0,
					page: page
				},
				async: false, //同步
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.success) {
						page++;
						var arrLen = data.infor.listItems.length;
						if(arrLen > 0) {
							//预编译模板
							var html = template('goods_div', data.infor);

						} else {

							// 锁定
							me.lock();
							// 无数据
							me.noData();
						}

						$('.goods-wrap').html(html);

						me.resetload();
					} else {
						mask(data.msg);
					}
				}
			});
		},
		loadDownFn: function(me) {
			$.ajax({
				type: 'post',
				url: reqUrl('goods_list'),
				dataType: "json",
				data: {
					keyword: "",
					city: "",
					one_type: "",
					two_type: "",
					three_type: "",
					four_type: "",
					brand_id: "",
					is_promotion: 0,
					groom_type: "",
					sort: 0,
					page: page
				},
				async: false, //同步
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.success) {
						page++;
						var arrLen = data.infor.listItems.length;
						if(arrLen > 0) {
							//预编译模板
							var html = template('goods_div', data.infor);

						} else {

							// 锁定
							me.lock();
							// 无数据
							me.noData();
						}

						$('.goods-wrap').html(html);

						me.resetload();
					} else {
						mask(data.msg);
					}
				}
			});
		}
	});

});
//