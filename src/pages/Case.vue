<template>
  <div>
    <div class="about">
        <div class="container">
        <div class="row d_flex">
            <div class="col-md-6">
                <div class="titlepage text_align_left">
                    <h2>写作润色</h2>
                    <p>文本优化！只需输入您的文本并选择文本优化策略，即可轻松提升您的写作水平。我们的智能系统将为您提供优化后的内容，确保文笔清晰、连贯，并具有吸引力。不论是完善论文、提炼商业提案，还是增强创意作品，我们的文本优化功能将帮助您精准、有力地传达您的信息。立即体验语言提升的力量，让您的写作达到新的高度！</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="about_img text_align_center">
                    <figure><img class="img_responsive" src="../../assets/gif/polish.gif" /></figure>
                </div>
            </div>
        </div>
        </div>
    </div>
    <div class="about">
        <div class="container">
        <div class="row d_flex">
            <div class="col-md-6">
                <div class="about_img text_align_center" style="padding-right: 30px;">
                    <figure><img class="img_responsive" src="../../assets/gif/grammar.gif" /></figure>
                </div>
            </div>
            <div class="col-md-6">
                <div class="titlepage text_align_left">
                    <h2> 语法检测</h2>
                    <p>依托领先的人工智能技术和大规模语料库，不断学习和优化，以提供最准确和细致的纠错服务。立即下载我们的软件，让文本纠错成为您写作之路上的不可或缺的良师益友。开启一段流畅无误的写作旅程！</p>
                </div>
            </div>
        </div>
        </div>
    </div>
    <div class="about">
        <div class="container">
        <div class="row d_flex">
            <div class="col-md-6">
                <div class="titlepage text_align_left">
                    <h2>智能翻译</h2>
                    <p>跨越语言的壁垒，文本翻译助您畅游世界！我们自豪地推出全新软件，专注于提供卓越的文本翻译功能，为您带来无与伦比的翻译体验。无论您是在国际商务、学习、旅行还是日常生活中需要翻译的帮助，我们的软件将成为您的得力助手。</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="about_img text_align_center">
                    <figure><img class="img_responsive" src="../../assets/gif/translate.gif" /></figure>
                </div>
            </div>
        </div>
        </div>
    </div>
    <!-- <div>
      <h2 class="row-title">关于我们</h2>
      <div class="me-row speaker">
          <div class="col-md-4 col-sm-6 special">
            <h3>larger name</h3>
            <p>brief description</p>
            <ul class="speaker-social">
              <li><a href="#"><span class="ti-facebook"></span></a></li>
              <li><a href="#"><span class="ti-twitter-alt"></span></a></li>
              <li><a href="#"><span class="ti-linkedin"></span></a></li>
            </ul>
          </div>
          <div class="col-md-4 col-sm-6 special">
            <h3>larger name</h3>
            <p>brief description</p>
            <ul class="speaker-social">
              <li><a href="#"><span class="ti-facebook"></span></a></li>
              <li><a href="#"><span class="ti-twitter-alt"></span></a></li>
              <li><a href="#"><span class="ti-linkedin"></span></a></li>
            </ul>
          </div>
      </div>
      <div class="me-row speaker">
          <div class="col-md-4 col-sm-6 feature">
            <h3>name</h3>
            <p>brief description</p>
            <ul class="speaker-social">
              <li><a href="#"><span class="ti-facebook"></span></a></li>
              <li><a href="#"><span class="ti-twitter-alt"></span></a></li>
              <li><a href="#"><span class="ti-linkedin"></span></a></li>
            </ul>
          </div>
          <div class="col-md-4 col-sm-6 feature">
            <h3>name</h3>
            <p>brief description</p>
            <ul class="speaker-social">
              <li><a href="#"><span class="ti-facebook"></span></a></li>
              <li><a href="#"><span class="ti-twitter-alt"></span></a></li>
              <li><a href="#"><span class="ti-linkedin"></span></a></li>
            </ul>
          </div>
          <div class="col-md-4 col-sm-6 feature">
            <h3>name</h3>
            <p>brief description</p>
          </div>
          <div class="col-md-4 col-sm-6 feature">
            <h3>name</h3>
            <p>brief description</p>
          </div>
          <div class="col-md-4 col-sm-6 feature">
            <h3>name</h3>
            <p>brief description</p>
          </div>
      </div>
      
    </div> -->
  </div>
</template>
   <!-- <img src="img/speaker-1.png" class="speaker-img"> -->
<script>

export default {

}
</script>

<style>

.about {
     background: #fff;
     padding: 30px 30px 90px 30px;
     position: relative;
}

.about::before {
     position: absolute;
     content: "";
     background: url();
     background-repeat: no-repeat;
     width: 360px;
     height: 212px;
     top: 0;
}

.about .titlepage {
     padding-bottom: 0;
}

.about .titlepage h2 {
    padding-left: 20px;
     padding-bottom: 30px;
     color: #2196F3;
}

.about .titlepage p {
     font-weight: 400;
     font-size: 17px;
     line-height: 30px;
     color: #303030;
     padding-bottom: 59px;
}

.about_img figure {
     margin: 0;
     align-items: center;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

.container-fluid {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

.d_flex {
     display: flex;
     align-items: center;
     flex-wrap: wrap;
}

.row {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.titlepage {
     padding-bottom: 60px;
}

.titlepage h2 {
     font-size: 45px;
     color: #fff;
     line-height: 50px;
     font-weight: bold;
     padding: 0;
     display: inline-block;
}

.text_align_left {
     text-align: left;
}

.text_align_center {
     text-align: center;
}

.read_more {
     font-size: 17px;
     background: #2196F3;
     max-width: 171px;
     width: 100%;
     height: 48px;
     display: block;
     line-height: 48px;
     transition: ease-in all 0.5s;
     font-weight: 400;
     text-align: center;
     color: #fff;
     z-index: 999;
     border-radius: 30px;
}

.read_more:hover {
     background: #000000;
     color: #fff;
     transition: ease-in all 0.5s;
}

.img_responsive {
     max-width: 90%;
}

.col-md-6 {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }

.img_logo {
     width: 15%;
}

.white_background {
  background-color: white;
  padding-top: 30px;
}

.speaker-img {
	max-width: 40%;
    border: 4px solid #efefef;
    border-radius: 50%;
}


.row-title {
	font-weight: 400;
  text-align: center;

}

.feature {
	padding: 20px;
	margin-top: 30px;
}
.feature span {
	font-size: 5em;
  color: #016cc7;
}

.special {
	padding: 20px;
	margin-top: 30px;
}
.special span {
	font-size: 5em;
  color: #016cc7;
}

.speaker .feature {
	width: 21.333333%;
	-webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  margin-right: 20px;
  border: 3px solid #f6f6f6;
  border-radius: 5px;
}
.speaker .feature:hover {
    box-shadow: 3px 3px 10px #ccc;
    transform: translateY(-10px);
}

.speaker .special {
	width: 41.333333%;
	-webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  margin-right: 20px;
  border: 3px solid #f6f6f6;
  border-radius: 5px;
}
.speaker .special:hover {
    box-shadow: 3px 3px 10px #ccc;
    transform: translateY(-10px);
}

@media (max-width: 767px) {
    .hero-header {
        padding: 3em 1em 1em 1em;
        text-align: center;
        max-height: 550px;
    }
    .speaker .feature {
        width: 100%
    }
    .footer-credit {
        text-align: center;
        padding: 40px 20px;
    }
    ul.footer-menu {
        text-align: center;
        margin-top: 30px;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .hero-header {
        padding: 3em 1em 1em 1em;
        text-align: center;
    }
    .speaker .feature {
        width: 49%;
        margin-right: 7px;
    }
    ul.footer-menu {
        margin-top: 0;
    }
}

@media (min-width: 992px) and (max-width: 1199px) {
    .speaker .feature {
        width: 49%;
        margin-right: 9px;
    }
}

.me-row {
	padding: 30px 0;
  margin-right: -15px;
  margin-left: -15px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  justify-content: center 
}

ul.speaker-social li {
	list-style: none;
	display: inline-block;
	margin: 10px 5px;
}
ul.speaker-social li a {
	font-size: 0.2em;
	padding: 0 10px;
}
ul.speaker-social li a:hover {
	text-decoration: none;
}

.col-md-4 {
    width: 33.33333333%;
  }

</style>

<!DOCTYPE html>
