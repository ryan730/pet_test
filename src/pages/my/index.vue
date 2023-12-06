<template>
	<div class="page">
		<div class="group">
			<div class="block">
				<span class="title">支付</span>
				<div class="header">
					<div class="wrapper">
						<span class="buy">购买</span>
						<span class="title-1">广泛性焦虑障碍量表</span>
					</div>
					<div class="price-wrapper">
						<span class="price-label">合计</span>
						<span class="price">¥6.9</span>
					</div>
				</div>
				<div class="submain" />
				<div class="main">
					<div class="wrapper-1">
						<div class="caption-wrapper">
							<span class="caption">选择支付方式</span>
						</div>
						<div class="group-1">
							<div class="view">
								<img class="icon-chat" src="./images/img_0.png" />
								<img class="icon-chat-1" src="./images/img_1.png" />
							</div>
							<span class="caption-1">微信支付</span>
						</div>
					</div>
					<div class="price-wrapper-1">
						<span class="price-1">确认支付 ¥6.9</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
definePageConfig({
	navigationBarTitleText: '个人中心'
});
</script>

<style lang="scss">
.page {
	display: flex;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
	font-family: PingFangSC-Medium;
}

.page .group {
	background-color: rgba(0, 0, 0, 0.6);
	padding-top: 433px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-self: flex-start;
	width: 100%;
	border-radius: 0;
}

.page .block {
	background-color: rgba(255, 255, 255, 1);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-self: center;
	width: 100%;
	padding: 21px 6px 0;
	border-radius: 20 20px 0 0;
}

.page .title {
	color: rgba(0, 0, 0, 1);
	font-size: 18px;
	font-weight: 500;
	letter-spacing: 0.37px;
	line-height: 25px;
	align-self: center;
	margin-left: 0.5px;
	max-width: 362px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.page .header {
	display: flex;
	flex-direction: column;
	margin-top: 33.5px;
	justify-content: flex-start;
	align-self: center;
	width: 329px;
}

.page .wrapper {
	display: flex;
	justify-content: space-between;
	align-self: center;
	width: 329px;
}

.page .buy {
	color: rgba(132, 136, 142, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	align-self: center;
	white-space: nowrap;
}

.page .title-1 {
	color: rgba(0, 0, 0, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	margin-right: 0.5px;
	align-self: center;
	white-space: nowrap;
}

.page .price-wrapper {
	display: flex;
	margin-top: 10px;
	justify-content: space-between;
	align-self: center;
	width: 329px;
}

.page .price-label {
	color: rgba(132, 136, 142, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	align-self: center;
	white-space: nowrap;
}

.page .price {
	color: rgba(255, 55, 55, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	margin-right: 0.5px;
	align-self: center;
	white-space: nowrap;
}

.page .submain {
	align-self: center;
	width: 332px;
	height: 0.5px;
	margin: 35px 0 0 2px;
	border-top: 0.5px solid rgba(207, 207, 207, 1);
}

.page .main {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-self: center;
	width: 363px;
	padding: 37.5px 0 28.5px;
}

.page .wrapper-1 {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-self: center;
	width: 337px;
}

.page .caption-wrapper {
	display: flex;
	justify-content: flex-start;
	align-self: center;
	width: 330px;
}

.page .caption {
	color: rgba(132, 136, 142, 1);
	font-size: 13px;
	font-weight: 500;
	letter-spacing: 0.27px;
	line-height: 18.5px;
	margin-left: 0.5px;
	align-self: flex-start;
	max-width: 329px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.page .group-1 {
	display: flex;
	margin-top: 18px;
	justify-content: flex-start;
	align-self: center;
	width: 330px;
}

.page .view {
	background-color: rgba(24, 173, 25, 1);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-self: center;
	position: relative;
	width: 27px;
	padding: 5.5px 4px 9px;
	border-radius: 5px;
}

.page .icon-chat {
	width: 14px;
	height: 12.5px;
	align-self: flex-start;
}

.page .icon-chat-1 {
	width: 12px;
	height: 10.5px;
	position: absolute;
	right: 3px;
	bottom: 5px;
}

.page .caption-1 {
	color: rgba(0, 0, 0, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	margin-left: 13px;
	align-self: center;
	white-space: nowrap;
}

.page .price-wrapper-1 {
	background-color: rgba(255, 160, 1, 1);
	display: flex;
	justify-content: center;
	align-self: center;
	width: 335px;
	margin: 38.5px 0 0 2px;
	padding: 11.5px 6px;
	border-radius: 22px;
}

.page .price-1 {
	color: rgba(255, 255, 255, 1);
	font-size: 15px;
	font-weight: 500;
	letter-spacing: 0.31px;
	line-height: 21px;
	margin-right: 0.5px;
	align-self: flex-start;
	max-width: 322px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}</style>

