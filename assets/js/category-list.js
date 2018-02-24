$('.close').click(function() {
	$('.one-classify').hide();
})
var pid = GetQueryString('pid');
////下拉内容滑动
var myScroll = new IScroll('#wrapper1', {
	click: true
});
var myScroll1 = new IScroll('#wrapper2', {
	click: true
});
var myScroll1 = new IScroll('#wrapper3', {
	click: true
});

goodsList(0, pid, "", "", "");

$('.sp-c-nav li').click(function() {
	$(this).addClass('am-active').siblings().removeClass('am-active');
	var sort = $(this).attr('data');
	$('.one-classify').hide();
	$('.Mask').hide();
	$('.dropload-down').remove();
	if(sort == 2) {
		$('.pull-down-p').css({
			'background': 'url(../assets/i/pull-down-c.png) no-repeat center'
		});
		$('.up-down-p').css({
			'background': 'url(../assets/i/up-down.png) no-repeat center'
		});
		$('.s-price').attr('data', 3);

	} else if(sort == 3) {
		$('.s-price').attr('data', 2)
		$('.up-down-p').css({
			'background': 'url(../assets/i/up.png) no-repeat center'
		});
		$('.pull-down-p').css({
			'background': 'url(../assets/i/pull-down.png) no-repeat center'
		});

	}
	goodsList(sort, pid, "", "", "");

});

$('.sp-c-nav li:eq(0)').click(function() {
	var flag = parseInt($(this).attr('flag'));
	if(flag == 0) {
		$('.one-classify').show();
		$(this).attr('flag', 1);
	} else {
		$('.one-classify').hide();
		$(this).attr('flag', 0);
	}
	sort = $(this).attr('data');

});

$('.mmask').on('click', function() {
	$(this).parent().hide();
});

$.ajax({
	url: reqUrl('goods_type'),
	type: 'post',
	dataType: 'json',
	data: {
		pid: 0,
		level: 1
	},
	async: false,
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		var oneType = template('oneType', data.infor);
		$('.classify-list').html(oneType);

	}

});
//获取二级分类
var oneTypeId;
var twoTypeId;
var threeTypeId;
var fourTypeId;
$('.classify-list li').click(function() {
	oneTypeId = $(this).attr('data');
	console.log(oneTypeId);
	$('.Mask').show();
	$.ajax({
		url: reqUrl('goods_type'),
		type: 'post',
		dataType: 'json',
		data: {
			pid: oneTypeId,
			level: 2
		},
		async: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			var len = data.infor.listItems.length;
			if(len != 0) {
				var twoType = template('twoType', data.infor);
				$('.twoClassify').html(twoType);
				//获取三级分类
				$('.twoClassify li').click(function() {
					$(this).addClass('color').siblings().removeClass('color');
					console.log(0)
					twoTypeId = $(this).attr('data');
					console.log(twoTypeId);

					$.ajax({
						url: reqUrl('goods_type'),
						type: 'post',
						dataType: 'json',
						data: {
							pid: twoTypeId,
							level: 3
						},
						async: false,
						xhrFields: {
							withCredentials: true
						},
						success: function(data) {
							var len = data.infor.listItems.length;
							console.log(len);
							if(len != 0) {
								var threeType = template('threeType', data.infor);
								$('.threeClassify').html(threeType);
								console.log('if');
								//								////获取四级分类
								$('.threeClassify li').click(function() {
									$(this).addClass('color').siblings().removeClass('color');
									threeTypeId = $(this).attr('data');
									$.ajax({
										url: reqUrl('goods_type'),
										type: 'post',
										dataType: 'json',
										data: {
											pid: threeTypeId,
											level: 4
										},
										async: false,
										xhrFields: {
											withCredentials: true
										},
										success: function(data) {
											var len = data.infor.listItems.length;
											console.log(len);
											if(len != 0) {
												var fourType = template('fourType', data.infor);
												$('.fourClassify').html(fourType);
												$('.fourClassify li').click(function() {
													fourTypeId = $(this).attr('data');
													$('.one-classify').hide();
													$('.Mask').hide();
													$('.dropload-down').remove();
													goodsList(0, oneTypeId, twoTypeId, threeTypeId, fourTypeId);
													$('.sp-c-nav li:gt(0)').click(function() {
														console.log('ok')
														$(this).addClass('am-active').siblings().removeClass('am-active');
														var sort = $(this).attr('data');
														if(sort == 2) {
															$('.pull-down-p').css({
																'background': 'url(../assets/i/pull-down-c.png) no-repeat center'
															});
															$('.up-down-p').css({
																'background': 'url(../assets/i/up-down.png) no-repeat center'
															});
															$('.s-price').attr('data', 3);

														} else if(sort == 3) {
															$('.s-price').attr('data', 2)
															$('.up-down-p').css({
																'background': 'url(../assets/i/up.png) no-repeat center'
															});
															$('.pull-down-p').css({
																'background': 'url(../assets/i/pull-down.png) no-repeat center'
															});

														}
														$('.one-classify').hide();
														$('.Mask').hide();
														$('.dropload-down').remove();
														goodsList(sort, oneTypeId, twoTypeId, threeTypeId, fourTypeId);

													});
												})

											} else {
												console.log('else');
												$('.dropload-down').remove();
												goodsList(0, oneTypeId, twoTypeId, threeTypeId, "");
												$('.sp-c-nav li:gt(0)').click(function() {
													console.log('ok')
													$(this).addClass('am-active').siblings().removeClass('am-active');
													var sort = $(this).attr('data');
													if(sort == 2) {
														$('.pull-down-p').css({
															'background': 'url(../assets/i/pull-down-c.png) no-repeat center'
														});
														$('.up-down-p').css({
															'background': 'url(../assets/i/up-down.png) no-repeat center'
														});
														$('.s-price').attr('data', 3);

													} else if(sort == 3) {
														$('.s-price').attr('data', 2)
														$('.up-down-p').css({
															'background': 'url(../assets/i/up.png) no-repeat center'
														});
														$('.pull-down-p').css({
															'background': 'url(../assets/i/pull-down.png) no-repeat center'
														});

													}
													$('.one-classify').hide();
													$('.Mask').hide();
													$('.dropload-down').remove();
													goodsList(sort, oneTypeId, twoTypeId, threeTypeId, "");

												});
												$('.one-classify').hide();
												$('.Mask').hide();
												$('.sp-c-nav li').eq(0).attr('data', 0);
											}

										}
									});

								});

							} else {
								console.log('else');
								$('.dropload-down').remove();
								goodsList(0, oneTypeId, twoTypeId, "", "");
								$('.sp-c-nav li:gt(0)').click(function() {
									console.log('ok')
									$(this).addClass('am-active').siblings().removeClass('am-active');
									var sort = $(this).attr('data');
									if(sort == 2) {
										$('.pull-down-p').css({
											'background': 'url(../assets/i/pull-down-c.png) no-repeat center'
										});
										$('.up-down-p').css({
											'background': 'url(../assets/i/up-down.png) no-repeat center'
										});
										$('.s-price').attr('data', 3);

									} else if(sort == 3) {
										$('.s-price').attr('data', 2)
										$('.up-down-p').css({
											'background': 'url(../assets/i/up.png) no-repeat center'
										});
										$('.pull-down-p').css({
											'background': 'url(../assets/i/pull-down.png) no-repeat center'
										});

									}
									$('.one-classify').hide();
									$('.Mask').hide();
									$('.dropload-down').remove();
									goodsList(sort, oneTypeId, twoTypeId, "", "");

								});
								$('.one-classify').hide();
								$('.Mask').hide();
								$('.sp-c-nav li').eq(0).attr('data', 0);
							}

						}
					});

				});
				console.log('if')

			} else {

				$('.dropload-down').remove();
				goodsList(0, oneTypeId, "", "", "");
				$('.sp-c-nav li:gt(0)').click(function() {
					console.log('ok')
					$(this).addClass('am-active').siblings().removeClass('am-active');
					var sort = $(this).attr('data');
					if(sort == 2) {
						$('.pull-down-p').css({
							'background': 'url(../assets/i/pull-down-c.png) no-repeat center'
						});
						$('.up-down-p').css({
							'background': 'url(../assets/i/up-down.png) no-repeat center'
						});
						$('.s-price').attr('data', 3);

					} else if(sort == 3) {
						$('.s-price').attr('data', 2)
						$('.up-down-p').css({
							'background': 'url(../assets/i/up.png) no-repeat center'
						});
						$('.pull-down-p').css({
							'background': 'url(../assets/i/pull-down.png) no-repeat center'
						});

					}
					$('.one-classify').hide();
					$('.Mask').hide();
					$('.dropload-down').remove();
					goodsList(sort, oneTypeId, "", "", "");

				});
				$('.one-classify').hide();
				$('.Mask').hide();
				$('.sp-c-nav li').eq(0).attr('data', 0);
			}

		}
	});

});
$('#transform').click(function() {
	var data = $(this).attr('data');
	$(this).toggleClass('t-style');
	if($(this).hasClass('t-style')) {
		$('.navbox-1').show();
		$('.navbox-0').hide();
	} else {
		$('.navbox-0').show();
		$('.navbox-1').hide();
	}

});
var city = getInfo('city_name');

function goodsList(sort, oneType, twoType, threeType, fourType) {
	var page = 0;
	$('.container').dropload({
		scrollArea: window,
		threshold: 500,
		domDown: {
			domNoData: '<div class="dropload-noData">没有更多</div>'
		},
		loadDownFn: function(me) {
			$.ajax({
				type: 'post',
				url: reqUrl('goods_list'),
				dataType: "json",
				data: {
					keyword: "",
					city: city,
					one_type: oneType,
					two_type: twoType,
					three_type: threeType,
					four_type: fourType,
					brand_id: "",
					is_promotion: 0,
					groom_type: "",
					sort: sort,
					page: page
				},
				async: false, //同步
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.success) {
						page++;
						var html = '';
						var content = "";
						var arrLen = data.infor.listItems.length;
						if(arrLen > 0) {
							//预编译模板
							html = template('goods-div', data.infor);
							content = template('good-div', data.infor);

						} else {
							// 锁定
							me.lock();
							// 无数据
							me.noData();
						}

						if(page == 1) {
							$('.common-list').html(html);
							$('.line-ul').html(content);
							addshopcart()

						} else {
							$('.common-list').append(html);
							$('.line-ul').append(content)
							addshopcart()

						}

						me.resetload();

					} else {
						mask(data.msg);
					}
				}
			});
		}
	});
};


function addshopcart() {
	$('.shopcart').click(function() {
		var token = getCookie('token');
		var data = $(this).attr('data');
		console.log(data)
		console.log(token)
		$.ajax({
			url: reqUrl('oper_shopping_cart'),
			type: 'post',
			dataType: 'json',
			data: {
				token: token,
				goods_id: data,
				type: 0,
				count: 1
			},
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				if(data.error_code == 200) {
					window.location.href = preUrl('log/login.html?path=index/category-list.html');
				} else if(data.success) {
					mask('加入购物车成功')
				}
			},
			error: function(e, request, settings) {
				alert(settings);
			}
		});
	});
}