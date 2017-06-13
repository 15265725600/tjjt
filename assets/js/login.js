$(function() {
	//当前页面进入注册页面，当登录成功返回当前页面
	var para = window.location.search;
	if(para != '') {
		var index = para.indexOf('&path');
		var subPara = para.substring(0, index);
		var path = GetQueryString('path') + subPara;
	}
	$('#login').click(function() {
		var phone = $('#phone').val();
		var numbers = /^[1][34578][0-9]{9}$/;
		var pwd = hex_md5('95c67c9261c567b48c1ddf9e5fd6a1d7' + hex_md5($("#pwd").val()));
		if($('#phone').val() == "") {
			$('#phone').focus();
			mask('手机号不能为空');
			return false;
		}
		var sMobile = /^[1][34578][0-9]{9}$/;
		if(!sMobile.exec($("#phone").val())) {
			mask('手机号格式不正确');
			$('#phone').focus();
			return false;
		}

		if($('#pwd').val() == "") {
			$('#pwd').focus();
			mask('密码不能为空');
			return false;
		}

		$.ajax({
			type: 'POST',
			url: reqUrl("client_login"),
			data: {
				username: phone,
				password: pwd,
				devicetype: 2,
				lastloginversion: '1.0.0'

			},
			dataType: 'JSON',
			async: false,
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {

				if(data.success) {
					setCookie('token', data.infor[0].token, 365);
					setCookie('discount', data.infor[0].discount, 365);
					if(path) {
						window.location.href = preUrl(path);
					} else {
						window.location.href = preUrl('index/index.html');
					}

				} else {
					mask(data.msg);
				}
			},
			error: function(e, request, settings) {
				alert(settings);
			}
		})

	})
})