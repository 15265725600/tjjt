
$.ajax({
	url: netUrl('getShareParam'),
	type: 'post',
	dataType: 'json',
	data: {
		url: location.href.split('#')[0]
	},
	xhrFields: {
		withCredentials: true
	},
	success: function(data) {
		var data = data.infor[0];
		wx.config({
			debug: false,
			appId: 'wxec28c9eb71df4cfb',
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
				'checkJsApi',
				'onMenuShareTimeline', //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口  
				'onMenuShareAppMessage', //获取“分享给朋友”按钮点击状态及自定义分享内容接口  
				'onMenuShareQQ', //获取“分享到QQ”按钮点击状态及自定义分享内容接口  
				'onMenuShareQZone', //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口  
				'onMenuShareWeibo' //分享到微博
			]
		});
		wx.ready(function() {
			// 分享到朋友
			wx.onMenuShareAppMessage({
				title: s_title, // 分享标题
				desc: s_desc, // 分享描述
				link: s_link, // 分享链接
				imgUrl: preUrl('assets/i/logo.png'), // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function() {
					alert("ok")
					window.location.href = history.go(-1);

				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消')

				}
			});

			// 分享到朋友圈
			wx.onMenuShareTimeline({
				title: s_title, // 分享标题
				desc: s_desc, // 分享描述
				link: s_link, // 分享链接
				imgUrl: preUrl('assets/i/logo.png'), // 分享图标
				success: function() {
					alert("ok")
					window.location.href = history.go(-1);

				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消')

				}
			});
			// 分享到QQ
			wx.onMenuShareQQ({
				title: s_title, // 分享标题
				desc: s_desc, // 分享描述
				link: s_link, // 分享链接
				imgUrl: preUrl('assets/i/logo.png'), // 分享图标
				success: function() {
					alert("ok")
					window.location.href = history.go(-1);

				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消')

				}
			});
			// 分享到腾讯微博
			wx.onMenuShareWeibo({
				title: s_title, // 分享标题
				desc: s_desc, // 分享描述
				link: s_link, // 分享链接
				imgUrl: preUrl('assets/i/logo.png'), // 分享图标
				success: function() {
					alert("ok")
					window.location.href = history.go(-1);

				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消')

				}
			});
			// 分享到QQ空间
			wx.onMenuShareQZone({
				title: s_title, // 分享标题
				desc: s_desc, // 分享描述
				link: s_link, // 分享链接
				imgUrl: preUrl('assets/i/logo.png'), // 分享图标
				success: function() {
					alert("ok")
					window.location.href = history.go(-1);

				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消')

				}
			});
		});

		wx.error(function(res) {

		});

	},
	error: function(e, request, settings) {
		alert(settings);
	}
});
