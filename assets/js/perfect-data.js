$(function() {
	//控制页面颜色
	var Height = $(window).height() - $('.am-header').height();
	$('.c-container').height(Height);
	//上传头像
	$('.choose_photo').on('change', function(e) {
		if(!window.FileReader) return;

		e.stopPropagation();
		e.preventDefault();

		var file = e.target.files[0];
		var content = '';
		if(!file.type.match('image.*')) {
			alert('文件' + f.name + '不是图片')
			return;
		}

		var orientation;
		//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
		EXIF.getData(file, function() {
			orientation = EXIF.getTag(this, 'Orientation');
		});

		var reader = new FileReader();

		reader.onload = function(e) {
			getImgData(this.result, orientation, function(data) {
				$.ajax({
					type: 'POST',
					url: reqUrl("webfile_upload"),
					data: {
						keytype: 1,
						temp_file: data
					},
					dataType: 'JSON',
					xhrFields: {
						withCredentials: true
					},
					//async: false,
					success: function(data) {

						content = ' <img class="avatar" src="' + data.infor[0].item1 + '">';
						$('.top-pdc').find('img').replaceWith(content);
					}
				});
			});

		}
		reader.readAsDataURL(file);

	});

	//获取城市列表
	var city = [];
	$.ajax({
		type: 'POST',
		url: reqUrl("district_all_get"),
		dataType: 'JSON',
		async: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			//          console.log(data.msg);
			city = data.infor.listItems;
		},
		error: function(e, request, settings) {
			alert(settings);
		}
	});

	//店铺分类
	var shopType = [];
	$.ajax({
		type: 'POST',
		url: reqUrl("shop_type"),
		dataType: 'JSON',
		async: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(data.infor.listItems[0].name)
			if(data.success) {
				var shopCla = document.getElementById('shop-cla');
				var shopval = document.getElementById('picker1')
				var arrLen = data.infor.listItems;
				for(var i = 1; i <= arrLen.length; i++) {
					var item = {
						text: data.infor.listItems[i - 1].name,
						value: i
					}
					shopType.push(item);

				}
				pickerShow([shopType], shopCla, shopval, 1, "选择店铺分类")
			} else {
				mask(data.msg)
			}

		}
	});

	//店铺地址
	//城市选择
	var cityId = [];
	var nameEl = document.getElementById('shop-addr');
	var addr = document.getElementById('chose');

	var first = []; /* 省，直辖市 */
	var second = []; /* 市 */
	var third = []; /* 镇 */

	var checked = [0, 0, 0]; /* 已选选项 */

	function creatList(obj, list) {
		obj.forEach(function(item, index, arr) {
			var temp = new Object();
			temp.text = item.name;
			temp.value = item.id;
			list.push(temp);
		})
	}

	creatList(city, first); // 省

	if(city[0].hasOwnProperty('children')) {
		creatList(city[0].children, second); //市
	} else {
		second = [{
			text: '',
			value: 0
		}];
	}

	if(city[0].children[0].hasOwnProperty('children')) {
		creatList(city[0].children[0].children, third); //区
	} else {
		third = [{
			text: '',
			value: 0
		}];
	}

	var picker = new Picker({
		data: [first, second, third],
		selectedIndex: [0, 0, 0],
		title: ''
	});

	picker.on('picker.select', function(selectedVal, selectedIndex) {
		var text1 = first[selectedIndex[0]].text;
		var text2 = second[selectedIndex[1]].text;
		var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';

		addr.innerHTML = text1 + ' ' + text2 + ' ' + text3;
	});

	picker.on('picker.change', function(index, selectedIndex) {
		if(index === 0) {
			firstChange();
		} else if(index === 1) {
			secondChange();
		}

		function firstChange() {
			second = [];
			third = [];
			checked[0] = selectedIndex;
			var firstCity = city[selectedIndex];
			if(firstCity.hasOwnProperty('children')) {
				creatList(firstCity.children, second);

				var secondCity = city[selectedIndex].children[0]
				if(secondCity.hasOwnProperty('children')) {
					creatList(secondCity.children, third);
				} else {
					third = [{
						text: '',
						value: 0
					}];
					checked[2] = 0;
				}
			} else {
				second = [{
					text: '',
					value: 0
				}];
				third = [{
					text: '',
					value: 0
				}];
				checked[1] = 0;
				checked[2] = 0;
			}

			picker.refillColumn(1, second);
			picker.refillColumn(2, third);
			picker.scrollColumn(1, 0)
			picker.scrollColumn(2, 0)
		}

		function secondChange() {
			third = [];
			checked[1] = selectedIndex;
			var first_index = checked[0];
			if(city[first_index].children[selectedIndex].hasOwnProperty('children')) {
				var secondCity = city[first_index].children[selectedIndex];
				creatList(secondCity.children, third);
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			} else {
				third = [{
					text: '',
					value: 0
				}];
				checked[2] = 0;
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			}
		}

	});

	picker.on('picker.valuechange', function(selectedVal, selectedIndex) {

		cityId = selectedVal;

	});

	nameEl.addEventListener('click', function() {
		picker.show();
	});
	//  上传店铺照片
	$('.shop-photo').click(function() {
		$('.upload-wrap').show();
	})
	var count = 0;
	$('.j-file-cert').on('change', function(e) {
		count++;
		if(count < 4) {
			var that = $(this);
			if(!window.FileReader) return;

			e.stopPropagation();
			e.preventDefault();

			var file = e.target.files[0];
			var content = '';

			if(!file.type.match('image.*')) {
				alert('文件' + f.name + '不是图片')
				return;
			}

			var orientation;
			//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
			EXIF.getData(file, function() {
				orientation = EXIF.getTag(this, 'Orientation');
			});

			var reader = new FileReader();

			reader.onload = function(e) {
				getImgData(this.result, orientation, function(data) {
					$.ajax({
						type: 'POST',
						url: reqUrl("webfile_upload"),
						data: {
							keytype: 2,
							temp_file: data
						},
						dataType: 'JSON',
						xhrFields: {
							withCredentials: true
						},
						//async: false,
						success: function(data) {
							//                              console.log(data.msg);
							content = '<li>' +
								'<img class="j-image" src="' + data.infor[0].item1 + '">' +
								'<i class="icon-close"></i>' +
								'</li>'

							that.parent().before(content);
						}
					});
				});

			}
			reader.readAsDataURL(file);
		} else {
			mask('最多传3张证件图片');
			count = 3;
			return false;
		}

	});
	//删除上传图片
	$('.upload').on('click', '.icon-close', function() {
		$(this).parent().remove();
		if(count > 0) {
			count--;
		}
		//      console.log(count);
	});
	//提交审核
	$('#Submit-audit').on('click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		var temp_token = GetQueryString('token');
		var pwd = GetQueryString('pwd');
		var username = GetQueryString('username');
		var img = $('.avatar').attr('src');
		var name = $('#name').val();
		var idcard = $('#idcard').val();
		var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
		var shopname = $('#shopname').val();
		var shopcla = $('#picker1').html();
		var shopaddr = $('#chose').html();
		var deaddr = $('#deaddr').val();
		var imgArr = [];
		$('.j-image').each(function() {
			var that = $(this);
			imgArr.push(that.attr('src'));
		});
		var imgSrc = imgArr.join(',');
		if(!regIdCard.test(idcard)) {
			mask('身份证号码不正确');
			return false;
		}
		if(img == '') {
			mask('请添加头像');
			return false;
		}
		if(name == '') {
			mask('请添加姓名');
			return false;
		}
		if(idcard == '') {
			mask('请添加身份证号');
			return false;
		}
		if(shopname == '') {
			mask('请添加店铺名称');
			return false;
		}
		if(shopcla == '') {
			mask('请选择店铺分类');
			return false;
		}
		if(shopaddr == '') {
			mask('请选择店铺地址');
			return false;
		}
		if(deaddr == '') {
			mask('请填写详细地址');
			return false;
		}
		if(imgSrc == '') {
			mask('请添加店铺照片');
			return false;
		}
		//提交审核，调用注册接口
		$.ajax({
			type: 'POST',
			url: reqUrl("client_add"),
			dataType: 'JSON',
			async: false,
			data: {
				temp_token: temp_token,
				username: username,
				name: name,
				shopname: shopname,
				shoptype: 1,
				img: img,
				big_img: img,
				imgs: imgSrc,
				district_name: shopaddr,
				address: deaddr,
				province: cityId[0],
				city: cityId[1],
				county: cityId[2],
				idcard: idcard,
				password: pwd
			},
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				if(data.success) {
					$.ajax({
						type: 'POST',
						url: reqUrl("client_login"),
						data: {
							username: username,
							password: pwd,
						},
						dataType: 'JSON',
						async: false,
						xhrFields: {
							withCredentials: true
						},
						success: function(data) {
							if(data.error_code == '110') {
								mask(data.msg)
							} else if(data.success) {
								setCookie("token", data.infor[0].token, 365);
								window.location.href = preUrl('log/login.html');
							} else if(data.error_code == '111') {
								mask(data.msg)
							}

						}
					});
				} else {
					mask(data.msg)
				}
			},
			error: function(e, request, settings) {
				alert(settings)
			}
		});

	})

})