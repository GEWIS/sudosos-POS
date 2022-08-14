<template>
  <div class="wrapper">
    <ean-login :handle-login="eanLogin" />
    <div class="wrap-container">
      <b-toast id="toast-incorrect-password" variant="danger" solid title="Incorrect login">
        Incorrect ID or PIN. Please try again.
      </b-toast>
      <b-toast id="toast-tos-not-accepted" variant="danger"
        solid title="Terms of Service not accepted"
      >
        You have not yet accepted the terms of service of SudoSOS.
        Please do this first on sudosos.gewis.nl!
      </b-toast>
      <div class="wrap-container-child login-container shadow">
        <div class="entry-row">
          <div class="keycodes-container">
            <div class="title">
              <div class="sub-title">Welcome to</div>
              <div class="title-text">SudoSOS</div>
            </div>
            <b-alert variant="light" show class="login-info">
              {{external==='GEWIS'
              ? 'Log in with your GEWIS ID and PIN'
              : 'Log in with your SudoSOS ID and PIN'
              }}
            </b-alert>
            <p v-bind:class="{'active-input': enteringUserId,
             'can-enter':  userId.length < maxUserIdLength}" @click="enteringUserId = true">
                <font-awesome-icon icon="user" />
                <span>{{ userId }}</span>
              </p>
              <p v-bind:class="{'active-input': !enteringUserId,
               'can-enter':  passcode.length < maxPasscodeLength }" @click="enteringUserId = false">
                <font-awesome-icon icon="lock" />
                <span class="passcode">{{ passcode | passcodeDots }} </span>
              </p>
              <div class="login-error">{{ loginError }}</div>
          </div>
          <div class="keypad-container">
            <keypad :inline="true"
              @backspace="backspacePressed"
              @ok="okPressed"
              @keyPressed="keyPress"
              v-bind:externalState.sync="external"/>
          </div>
        </div>
      </div>
      <div class="wrap-container-child sponsor-container shadow">
        <img :src="banners[bannerIndex]" />
      </div>
    </div>
    <div class="background-logo">
<!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import keypad from '@/components/Keypad.vue';
import APIHelper from '@/mixins/APIHelper';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/user';
import { LoginResponse } from '@/entities/APIResponses';
import EanLogin from '@/components/EanLogin.vue';
import { getAllActiveBanners } from '@/api/banners';

@Component({
  filters: {
    passcodeDots(passcode: string) {
      if (passcode.length > 0) {
        return '•'.repeat(passcode.length);
      }
      return '';
    },
  },
  components: {
    EanLogin,
    keypad,
  },
})
export default class Login extends Vue {
  userState = getModule(UserModule);

  private messagesOfTheDay: string[] = [
    '🦀🦀🦀🦀🦀Het bestuur geeft ons te weinig pizza🦀🦀🦀🦀🦀',
    '👩‍🦼👩‍🦼👩‍🦼Julie de Nooij👩‍🦼👩‍🦼👩‍🦼',
    'Wannie Beumer is de rechtmatige voorzitter van de AC',
    'SudoSOS zoekt coder!',
  ];

  private banners: string[] = [];

  public motdIndex = 0;

  public bannerIndex = 0;

  public userId = '';

  public passcode = '';

  private enteringUserId = true;

  private loginError = '';

  private maxUserIdLength = 5;

  private maxPasscodeLength = 4;

  private maxUserId = 40000;

  private external: String = 'GEWIS';

  backspacePressed() {
    if (this.enteringUserId && this.userId.length > 0) {
      this.userId = this.userId.slice(0, -1);
    } else if (!this.enteringUserId && this.passcode.length === 0) {
      this.switchInput();
    } else if (!this.enteringUserId && this.passcode.length > 0) {
      this.passcode = this.passcode.slice(0, -1);
    }
  }

  okPressed() {
    if (this.enteringUserId) {
      this.enteringUserId = false;
    } else {
      this.login();
    }
  }

  switchInput() {
    this.enteringUserId = !this.enteringUserId;
  }

  keyPress(keyValue: string) {
    if (this.enteringUserId) {
      if (this.userId.length >= this.maxUserIdLength) return;

      this.userId += keyValue;

      if (this.userId.length === this.maxUserIdLength
        || Number(this.userId) * 10 > this.maxUserId) {
        this.switchInput();
      }
    } else {
      if (this.passcode.length >= this.maxPasscodeLength) return;

      this.passcode += keyValue;
      if (this.passcode.length === this.maxPasscodeLength) this.login();
    }
  }

  async eanLogin(eanCode: string) {
    const loginResponse = await APIHelper.postResource('authentication/ean', { eanCode });
    await this.handleLoginResponse(loginResponse);
  }

  async login() {
    let loginResponse;

    // External login goes straight via SudoSOS
    if (this.external === 'EXTERNAL') {
      const userDetails = {
        userId: parseInt(this.userId, 10),
        pin: this.passcode.toString(),
      };

      loginResponse = await APIHelper.postResource('authentication/pin', userDetails);
    } else {
      const userDetails = {
        gewisId: parseInt(this.userId, 10),
        pin: this.passcode.toString(),
      };

      loginResponse = await APIHelper.postResource('authentication/GEWIS/pin', userDetails);
    }

    await this.handleLoginResponse(loginResponse);

    this.userId = '';
    this.passcode = '';
    this.enteringUserId = true;
  }

  async handleLoginResponse(loginResponse?: LoginResponse | any) {
    if (loginResponse && Object.keys(loginResponse).length > 0 && !('message' in loginResponse)) {
      if (loginResponse.user.acceptedTOS === 'NOT_ACCEPTED') {
        this.$bvToast.show('toast-tos-not-accepted');
      } else {
        APIHelper.setToken(loginResponse.token);
        await this.userState.fetchUser(true);
        await this.userState.fetchAllUsers();
        await this.$router.push('/productOverview');
      }
    } else {
      this.$bvToast.show('toast-incorrect-password');
      this.loginError = loginResponse.message;
    }
  }

  mounted() {
    getAllActiveBanners().then((banners) => {
      this.banners = [];
      banners.forEach((b) => {
        this.banners.push(`${process.env.VUE_APP_IMAGE_BASE}banners/${b.picture}`);
      });
    });
    setInterval(() => {
      if (this.motdIndex < this.messagesOfTheDay.length - 1) {
        this.motdIndex += 1;
      } else {
        this.motdIndex = 0;
      }
      if (this.bannerIndex < this.banners.length - 1) {
        this.bannerIndex += 1;
      } else {
        this.bannerIndex = 0;
      }
    }, 5000);
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/global/_variables.scss";
@import "./src/styles/common.scss";

@keyframes cursor-blink {
  0% {
    opacity: 0;
  }
}

.wrap-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 32px;
  z-index: 2;
  gap: 16px;
}

.wrap-container-child {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: $border-radius;
  background: rgba(white, 0.8);
  padding: 32px;
}

.login-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .login-error {
    font-size: 16px;
    color: #D40000;
    display: none;
  }

  .keycodes-container {
    font-size: 4rem;
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    width: fit-content;
    justify-content: center;
    gap: 24px;
    align-items: center;

    p {
      &.active-input {
        background-color: $gewis-red;
        span {
          color: white;
          &::after {
            content: "";
            width: 5px;
            height: 3rem;
            background: #525659;
            animation: cursor-blink 1.5s steps(2) infinite;
            display: none;
          }
        }
        svg {
          color: white;
        }
      }

      &.can-enter {
        span::after {
          display: inline-block;
        }
      }

      background-color: white;
      border-radius: $border-radius;
      border: 1px solid $gewis-red;
      line-height: 1;
      margin: 0;
      padding: 8px;
      min-width: 320px;
      width: fit-content;
      font-size: 64px;

      span {
        margin-left: 24px;
        color: $gewis-red;
        letter-spacing: 0.2em;
      }

      svg {
        padding: 5px;
        margin: 2px;
        height: 4rem;
        width: 4rem;
        color: $gewis-red;
      }
    }

    .login-info {
      font-size: 18px;
      padding: 0;
      margin: 0;
    }

    .title {
      display: flex;
      flex-direction: column;
      align-items: center;

      .sub-title {
        font-size: 20px;
        color: $gewis-red;
      }

      .title-text {
        font-size: 77px;
        line-height: .9;
      }
    }
  }

  .keypad-container {
    flex-basis: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .keypad {
      // TODO: Not a good approach
      flex: 0 1 324px;
    }
  }

  .entry-row {
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 16px;
  }

  .motd-container {
    text-align: center;
    background: white;
    border-radius: $border-radius;
    font-size: 2rem;
    padding: 8px;
  }
}

.sponsor-container {
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 0 12.82vw;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

@media screen and (max-width: 950px) {
  .wrap-container {
    margin: 0;
    gap: 0;
  }

  .wrap-container-child {
    border-radius: 0;
  }
}

@media screen and (max-width: 850px) {
  .entry-row {
    flex-direction: column !important;
    align-items: center;
  }

  .keycodes-container {
    justify-content: center;
  }
}

</style>
