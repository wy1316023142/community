<template>
  <div class="loginPage">
    <!-- <div class="logo">
      <img src="../assets/images/login/lofo.png">
    </div> -->
    <!-- <div class="loginText">
       <p>AnYi Community system login</p>
       <p>安翼社区系统登录</p>
     </div> -->
    <div class="login-down center">
      <!-- <img src="../assets/images/login/zhsq_apk.png"> -->
      <!-- <a href="http://125.64.18.118:8888">社会治安综合防控平台-智慧社区</a> -->
      <!-- <div class="mt5">社会治安综合防控-智慧社区APP</div> -->
    </div>
    <!-- <div class="login-down center">
      <img src="../assets/images/login/123.jpg">
      <div class="mt5">社会治安综合防控-智慧社区公众号</div>
    </div> -->

    <el-form ref="form" :model="user" :rules="rules" :show-message="false">
      <div class="loginMain">
        <div class="login-login">
          <!-- <img src="../assets/images/login/547474.png"> -->
        </div>
        <div class="loginBox">
          <el-form-item prop="username">
            <div class="loginCell mt44">
              <p>用户名</p>
              <input type="text" placeholder="用户名" class="user" v-model="user.username"/>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="loginCell">
              <p>密码</p>
              <input type="password" placeholder="密码" class="password" v-model="user.password" autocomplete="off"/>

            </div>
          </el-form-item>

          <el-form-item prop="code">
            <div class="loginCell">
              <div class="flexItem">
                <p>验证码</p>
                <input type="text" placeholder="验证码" v-model="user.code" @keyup.enter="submitForm()"
                       class="inputVerification"/>
              </div>
              <div @click="createCode">
                <identify :identifyCode="code" class="imgVerification"></identify>
              </div>
            </div>
            <div class="errorTip" v-if="invalidFields['code']">{{invalidFields['code'][0].message}}</div>
          </el-form-item>
          <div class="loginBtnBigBox">
            <div class="keepPwdBox">
              <el-checkbox v-model="checked" class="keepPwd" @click.native="seeTable">记住密码</el-checkbox>
            </div>
            <div class="loginBtnBox">

              <el-button :loading="loginLoading" type="primary" class="loginBtn" @click="submitForm"
                         @blur="focussubmit = false" v-focus="focussubmit">登录
              </el-button>
            </div>
          </div>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>
  import Api from '../commom/api.js'
  import identify from '../components/identify.vue'

  let Base64 = require('js-base64').Base64;
  export default {
    name: 'login',
    data() {
      var checkCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (value !== this.code) {
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      };
      return {
        identifyCode: "",
        invalidFields: {},
        code: '',
        loginLoading: false,
        focusname: false,
        focuspassword: false,
        focuscode: false,
        focussubmit: false,
        checked: true,
        sipData: {},
        user: {
          scope: 'ui',
          grant_type: 'password',
          username: '',
          password: '',
          code: '',
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          code: [
            {validator: checkCode, trigger: 'blur'}
          ]
        }
      }
    },
    components: {identify},
    created() {
      this.createCode()
      this.userLogin()
    },
    directives: {
      focus: {
        update: function (el, {value}) {
          if (value) {
            el.focus()
          }
        }
      }
    },
    methods: {
      // 验证码
      createCode() {
        this.code = ''
        //验证码的长度
        var codeLength = 4;
        //随机数
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        for (var i = 0; i < codeLength; i++) {
          //取得随机数的索引（0~35）
          var index = Math.floor(Math.random() * 10);
          //根据索引取得随机数加到code上
          this.code += random[index];
        }
      },
      // 回填
      userLogin() {
        let userLogin = sessionStorage.getItem('userLogin')
        if (this.checked) {
          if (userLogin) {
            userLogin = JSON.parse(sessionStorage.getItem('userLogin'))
            this.user.username = userLogin.username
            this.user.password = userLogin.password
            this.checked = true
          }
        }
        else {
          this.user.username = ''
          this.user.password = ''
        }

      },
      seeTable() {
        if (this.checked == false) {
          this.user.username = ''
          this.user.password = ''
        }
      },
      //登录
      submitForm() {
        this.$refs.form.validate((valid, invalidFields) => {
          this.invalidFields = invalidFields
          if (valid) {
            if (this.checked == true) {
              let userLogin = {username: this.user.username, password: this.user.password, checked: true}
              sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
            }
            const redirect = this.$route.query.redirect
            this.loginLoading = true
            this.user.password = Base64.encode(this.user.password)
            let config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic YnJvd3Nlcjo='
              }
            }
            Api.login.post(this.user, config).then(res => {
              sessionStorage.setItem('token', res.data.access_token)
              Api.userInfo.get().then(res => {
                this.loginLoading = false
                let authorities = res.data.result.purviews.split(",");
                sessionStorage.setItem('user', JSON.stringify(res.data.result))
                sessionStorage.setItem('authorities', JSON.stringify(authorities))
                this.systemConfig()
                this.bigscreenConfig(res.data.result.organId);
                if (authorities.indexOf("1001") != -1) {
                  this.$router.push({name: 'indexWork', params: {sipData: this.sipData}})
                } else {
                  this.$router.push({name: 'indexWel'})
                }
                // if(res.data.result.organType==2){
                //   // this.getSipUser()
                //   // console.log(this.sipData);


                //   //this.$router.push( (!redirect)||decodeURIComponent(redirect)==='/' ? {name: 'index'} : {path: decodeURIComponent(redirect)})
                // }else {
                //   // this.getSipUser()
                //   // console.log(this.sipData);
                //   this.$router.push( (!redirect)||decodeURIComponent(redirect)==='/' ? {name: 'indexWork'} : {path: decodeURIComponent(redirect)})
                //   // this.$router.push( {name: 'indexWork',params: { sipData: this.sipData }})
                // }
              }).catch(err => {
                this.loginLoading = false
                this.createCode()
              })
            }).catch(err => {
              this.loginLoading = false
              this.createCode()
            })

          }
        })
      },

      async systemConfig() {
        const data = await Api.systemConfig.get({}).then(res => res.data)
        var data1 = JSON.stringify(data.result)
        sessionStorage.setItem("systemConfig", data1)
      },

      async bigscreenConfig(organId) {
        const data = await Api.bigscreenConfig.get({}, {
          pathParams:
            {id: organId}
        }).then(res => res.data)
        let data2 = JSON.stringify(data.result)
        var sss = sessionStorage.setItem("bigscreenConfig", data2)
      },
      // async getSipUser(){
      //       var loginName=JSON.parse(sessionStorage.getItem('user')).loginName
      //       const data =await Api.getSipUser.get({
      //         account: loginName
      //       }).then(res=>res.data)
      //       this.sipData=data.result
      //       console.log(this.sipData);
      // },

    }
  };
</script>
<style lang="less" scoped>
  .loginPage {
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 800px;
    background: url('../assets/images/login/bg.png') no-repeat center;
    background-size: cover;

    .login-down {
      float: right;
      display: block;
      color: #ffffff;
      margin-right: 28px;
      margin-top: 20px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .logo {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 213px;
      height: 127px;
      img {
        width: 213px;
        height: 127px;
      }
    }
    .loginText {
      position: absolute;
      left: 57px;
      top: 46.11%;
      p {
        font-size: 35px;
        color: #FFFFFF;
        font-weight: 400;
        line-height: 1;
        &:last-child {
          margin-top: 13px;
        }
      }
    }
    .loginMain {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .login-logo {
        text-align: center;
      }
      .loginBox {
        width: 447px;
        height: 334px;
        margin: 20px auto 0;
        background: url('../assets/images/login/11.png') no-repeat center;
        border-radius: 12px;
        box-sizing: border-box;
        .mt44 {
          margin-top: 44px;
        }
        .errorTip {
          display: inline;
          font-size: 12px;
          color: #DA706C;
          position: absolute;
          top: 87%;
          left: 14%;
        }
        .title {
          width: 190px;
          margin: 55px auto 30px;
          line-height: 1;
          padding-bottom: 8px;
          font-size: 27px;
          font-weight: bold;
          color: rgba(91, 91, 91, 1);
          text-align: center;
          border-bottom: 2px solid #4D3E9A;
        }
        .loginCell {
          width: 351px;
          height: 48px;
          margin-left: 50px;
          line-height: 36px;
          padding-bottom: 14px;
          border-radius: 10px;
          display: flex;
          p {
            width: 95px !important;
            height: 48px;
            line-height: 48px;
            background: #363BB7;
            text-align: center;
            border-radius: 10px 0px 0px 10px;
            font-size: 18px;
            color: #fff;
          }
          input {
            text-indent: 20px;
            background: #fff !important;
            color: #9D9D9E;
            font-size: 17px;
            height: 48px;
            line-height: 48px;
            border-radius: 0px 10px 10px 0px;
          }
          .flexItem {
            display: flex;
          }
          .inputVerification {
            width: 148px;
          }
          .imgVerification {
            margin-top: 10px;
          }
          .user {
            width: 71%;
            background: url('../assets/images/login/yhm.png') no-repeat center right;
          }
          .password {
            width: 71%;
            background: url('../assets/images/login/mima.png') no-repeat center right;
          }
          .yzm {
            font-size: 17px;
            color: #9D9D9E;
            cursor: pointer;
          }
        }
        .loginBtnBigBox {
          display: flex;
          justify-content: space-between;
          .keepPwdBox {
            margin-left: 50px;
            margin-top: 19px;
            font-size: 14px;
            color: #fff;
            .keepPwd {
              font-size: 14px;
              color: #fff;
            }
          }
          .loginBtnBox {

            .loginBtn {
              width: 133px;
              height: 48px;
              background: #278CFF !important;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              text-align: center;
              border-radius: 5px;
              border: none;
              margin-right: 49px;
            }
          }
        }
      }
    }

  }
</style>
