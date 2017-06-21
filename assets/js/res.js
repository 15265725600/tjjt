$(function() {
	//点击差号input里面的内容清除
	$(".remove-phone").click(function() {
		$("input[name='test']").val("").focus(); // 清空并获得焦点
	});
	//手机发送短信验证码
	$('.get-code').on('click', function() {
		var data = parseInt($(this).attr('data'))
		var phone = $('#phone').val().replace(/\s+/g, '');
		var numbers = /^[1][34578][0-9]{9}$/;
		var codephone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		$('.codephone').html(codephone);
		console.log(codephone);
		if(!numbers.test(phone) || phone.length == 0) {
			mask('请输入正确的手机号');
			return false;
		};
		if(numbers.test(phone) && data == 0) {
			//			
			//验证用户是否存在
			$.ajax({
				type: 'POST',
				url: reqUrl("client_verify"),
				data: {
					"username": $("#phone").val(),
				},
				dataType: 'JSON',
				async: false,
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.error_code == "106") {
						//获取验证码
						$.ajax({
							type: 'POST',
							url: reqUrl("code_get"),
							data: {
								"username": $("#phone").val(),
							},
							async: false,
							dataType: 'JSON',
							success: function(data) {
								$('.reg-mask').show();
								console.log(data.msg);

							}
						});

						var time = 60;

						function timeCountDown() {
							if(time == 0) {
								clearInterval(timer);
								$('.get-code').html("发送验证码");
								$('.get-code').attr('data', '0');
								$('.reg-mask').hide();
								return true;
							}
							$('.get-code').html("(<i>" + time + "</i>s)后重新发送");

							time--;
							$('.get-code').attr('data', '1');
							return false;
						}

						timeCountDown();
						var timer = setInterval(timeCountDown, 1000);
					} else {
						mask(data.msg);

						return;
					}
				},
				error: function(e, request, settings) {
					alert(settings);
				}
			});
		};
	});
	//点击下一步
	$('.sp-submit').on('click', function() {
		var phone = $('#phone').val();
		var code = $('#input_code').val();
		console.log(code)
		var pwd = hex_md5('95c67c9261c567b48c1ddf9e5fd6a1d7' + hex_md5($("#pwd").val()));
		var repwd = hex_md5('95c67c9261c567b48c1ddf9e5fd6a1d7' + hex_md5($("#repwd").val()));
		var numbers = /^[1][34578][0-9]{9}$/;
		if($('#phone').val() == "") {
			$('#phone').focus();
			mask('请输入手机号');
			return false
		};
		if(!numbers.test($('#phone').val())) {
			$('#phone').focus();
			mask('请输入正确的手机号');
			return false
		};
		if(code == '') {
			mask('请输入验证码');
			return false
		}
		if(pwd == '') {
			mask('请输入密码');
			return false
		};
		if(pwd != repwd) {
			mask('两次密码不一致');
		}

		//验证验证码
		$.ajax({
			type: 'POST',
			url: reqUrl("code_verify"),
			data: {
				username: phone,
				code: code

			},
			dataType: 'JSON',
			async: false,
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				if(data.success) {
					console.log(data.infor[0].temp_token);
					var token = data.infor[0].temp_token;

					window.location.href = preUrl('log/perfect-data.html?username=' + phone + '&pwd=' + pwd + '&token=' + token + '');
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