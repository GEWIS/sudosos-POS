<template>
  <div class="wrapper">
    <div class="wrap-container">
      <div class="wrap-container-child login-container shadow">
        <div class="entry-row">
          <div class="keycodes-container">
            <div class="title">
              <div class="sub-title">Welcome to</div>
              <div class="title-text">SudoSOS</div>
            </div>
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
              @keyPressed="keyPress"/>
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

  private banners: string[] = [
    'https://i.imgur.com/Ku3bLab.png',
    'https://i.imgur.com/S9dsgzl.png',
  ];

  public motdIndex = 0;

  public bannerIndex = 0;

  public userId = '';

  public passcode = '';

  private enteringUserId = true;

  private loginError = '';

  private maxUserIdLength = 4;

  private maxPasscodeLength = 4;

  backspacePressed() {
    if (this.enteringUserId && this.userId.length > 0) {
      this.userId = this.userId.slice(0, -1);
    } else if(!this.enteringUserId && this.passcode.length == 0) {
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
      if(this.userId.length >= this.maxUserIdLength) return;

      this.userId += keyValue;

      if(this.userId.length == this.maxUserIdLength) this.switchInput();
    } else {
      if(this.passcode.length >= this.maxPasscodeLength) return;

      this.passcode += keyValue;
      if (this.passcode.length === this.maxPasscodeLength) this.login();
    }
  }

  async login() {
    const userDetails = {
      gewisId: parseInt(this.userId, 10),
      pin: this.passcode.toString(),
    };
    const loginResponse = await APIHelper.postResource('authentication/GEWIS/pin', userDetails);

    if (loginResponse && loginResponse !== {} && !('message' in loginResponse)) {
      APIHelper.setToken(loginResponse.token);
      this.userState.fetchUser(true);
      this.userState.fetchAllUsers();
      this.$router.push('/productOverview');
    } else {
      this.userId = '';
      this.passcode = '';
      this.enteringUserId = true;
      this.loginError = loginResponse.message;
    }
  }

  mounted() {
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
  padding: 16px;
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
            display: hidden;
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
      width: 320px;
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
      flex: 0 1 350px;
    }
  }

  .entry-row {
    display: flex;
    flex-direction: row;
    flex: 1;
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
  flex: 0 0 20vh;
  height: 20vh;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
