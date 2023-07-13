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
      <div class="wrap-container-child login-container box">
        <div class="entry-row">
          <div class="keycodes-container">
            <div class="title">
              <div class="sub-title">Welcome to</div>
              <div class="title-text">SudoSOS</div>
            </div>
            <b-alert
              variant="light" show class="login-info"
              style="background: none !important; border: none !important">
              {{external==='GEWIS'
              ? 'Log in with your GEWIS ID and PIN'
              : 'Log in with your SudoSOS ID and PIN'
              }}
            </b-alert>
            <p v-bind:class="{'active-input': enteringUserId,
             'can-enter':  userId.length < maxUserIdLength}" @click="enteringUserId = true">
                <font-awesome-icon icon="user" />
                <span>{{external === 'GEWIS' ? '' : 'E'}}{{ userId }}</span>
              </p>
              <p v-bind:class="{'active-input': !enteringUserId,
               'can-enter':  passcode.length < maxPasscodeLength }" @click="enteringUserId = false">
                <font-awesome-icon icon="lock" />
                <span class="passcode">{{ passcodeDots }} </span>
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
      <div class="wrap-container-child sponsor-container box">
        <img :src="`${bannerImageBase}${this.banner?.picture}`" />
      </div>
    </div>
    <p class="build"> {{buildHash}} </p>
    <Background />
  </div>
</template>
<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';
import keypad from '@/components/login/Keypad.vue';
import APIHelper from '@/mixins/APIHelper';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/user';
import { LoginResponse } from '@/entities/APIResponses';
import EanLogin from '@/components/login/EanLogin.vue';
import { getAllActiveBanners } from '@/api/banners';
import Background from '@/components/Background.vue';
import { Banner } from '@/entities/Banner';
import ApiService from '@/api/ApiService';
import {
  AuthenticationPinRequest,
  AuthenticationResponse,
  GEWISAuthenticationPinRequest,
} from 'sudosos-client';

/**
 * The login page.
 */
@Component({
  components: {
  EanLogin,
  keypad,
  Background,
  },
  })
export default class Login extends Vue {
  private userState = getModule(UserModule);

  public banners: Banner[] = [];

  public banner: Banner = {
    name: '',
    picture: '',
    duration: 0,
    active: false,
    startDate: null,
    endDate: null,
    id: 0,
    createdAt: undefined,
    updatedAt: undefined,
  };

  public userId = '';

  public passcode = '';

  public enteringUserId = true;

  public loginError = '';

  public maxUserIdLength = 5;

  public maxPasscodeLength = 4;

  private maxUserId = 40000;

  public external: String = 'GEWIS';

  public buildHash: String = ''

  public bannerImageBase: String = '';

  /**
   * When the page is mounted, get all active banners.
   */
  mounted() {
    this.buildHash = `${process.env.VUE_APP_A_B}-${process.env.VUE_APP_BUILD_HASH}`;

    getAllActiveBanners().then((banners) => {
      this.banners = banners;
      this.selectBanner(0);
    });

    this.bannerImageBase = `${process.env.VUE_APP_IMAGE_BASE}banners/`;
  }

  selectBanner(bannerIndex) {
    this.banner = this.banners[bannerIndex];
    // Schedule the next banner selection after the specified duration
    setTimeout(() => {
      // Increment the bannerIndex and wrap around to the beginning if necessary
      const nextBannerIndex = (bannerIndex + 1) % this.banners.length;
      this.selectBanner(nextBannerIndex);
    }, this.banners[bannerIndex].duration);
  }

  /**
   * The passcode is shown as dots.
   */
  get passcodeDots() {
    if (this.passcode.length > 0) {
      return '•'.repeat(this.passcode.length);
    }

    return '';
  }

  /**
   * Handle when the user presses the backspace button.
   */
  backspacePressed() {
    if (this.enteringUserId && this.userId.length > 0) {
      this.userId = this.userId.slice(0, -1);
    } else if (!this.enteringUserId && this.passcode.length === 0) {
      this.switchInput();
    } else if (!this.enteringUserId && this.passcode.length > 0) {
      this.passcode = this.passcode.slice(0, -1);
    }
  }

  /**
   * Handle when the user presses the ok button.
   */
  okPressed() {
    if (this.enteringUserId) {
      this.enteringUserId = false;
    } else {
      this.login();
    }
  }

  /**
   * Switch if the user is entering the user id or the passcode.
   */
  switchInput() {
    this.enteringUserId = !this.enteringUserId;
  }

  /**
   * Handle if a key is pressed. If it is entering the user id, add the key to
   * the user id and if that is at the max length, switch to the passcode. If it
   * is entering the passcode, add the key to the passcode and if that is at the
   * max length, login.
   * @param {string} keyValue The value of the key that was pressed.
   */
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

  /**
   * Login using the EAN code.
   * @param {string} eanCode The EAN code.
   */
  async eanLogin(eanCode: string) {
    let loginResponse;
    try {
      loginResponse = ApiService.authenticate.eanAuthentication({ eanCode });
    } catch (error) {
      console.error(error);
    } finally {
      await this.handleLoginResponse(loginResponse);
    }
  }

  /**
   * Login using the user id and passcode.
   */
  async login() {
    let loginResponse: AuthenticationResponse;

    try {
      // External login goes straight via SudoSOS
      if (this.external === 'EXTERNAL') {
        const userDetails: AuthenticationPinRequest = {
          userId: parseInt(this.userId, 10),
          pin: this.passcode.toString(),
        };
        loginResponse = (await ApiService.authenticate.pinAuthentication(userDetails)).data;
      } else {
        const userDetails: GEWISAuthenticationPinRequest = {
          gewisId: parseInt(this.userId, 10),
          pin: this.passcode.toString(),
        };
        loginResponse = (await ApiService.authenticate.gewisPinAuthentication(userDetails)).data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      await this.handleLoginResponse(loginResponse);
    }

    this.userId = '';
    this.passcode = '';
    this.enteringUserId = true;
  }

  /**
   * Handle the login response. If the user has not accepted the TOS, show a
   * toast. If the user has accepted the TOS, set the token and redirect to the
   * home page. If the login was incorrect, show a toast.
   * @param {LoginResponse} loginResponse The login response.
   */
  async handleLoginResponse(loginResponse?: AuthenticationResponse | any) {
    if (loginResponse && Object.keys(loginResponse).length > 0 && !('message' in loginResponse)) {
      if (loginResponse.user.acceptedTOS === 'NOT_ACCEPTED') {
        this.$bvToast.show('toast-tos-not-accepted');
      } else {
        APIHelper.setToken(loginResponse.token);
        ApiService.setJwtToken(loginResponse.token);
        await this.userState.fetchUser(true);
        await this.userState.fetchAllUsers();
        await this.$router.push('/home');
      }
    } else {
      this.$bvToast.show('toast-incorrect-password');
      this.passcode = '';
      this.loginError = loginResponse.message;
    }
  }
}
</script>
<style lang="scss" scoped>
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
            background: white;
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
