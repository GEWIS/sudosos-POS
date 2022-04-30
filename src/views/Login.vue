<template>
  <b-container class="login-container" fluid>
    <b-row class="login-header">
      <img src="@/assets/img/gewis-branding.svg" />
      <h1>SudoSOS</h1>
    </b-row>
    <b-row class="entry-row">
      <b-col cols="12" lg="4" offset-lg="1" md="6" class="keycodes-container">
        <b-row class="login-row">
          <b-col align-self="center">
            <p v-bind:class="{'active-input': enteringUserId }" @click="enteringUserId = true">
              <font-awesome-icon icon="user" />
              <span v-if="userId > 0">{{ userId }}</span>
            </p>
            <p v-bind:class="{'active-input': !enteringUserId }" @click="enteringUserId = false">
              <font-awesome-icon icon="lock" />
              <span>{{ passcode | passcodeDots }} </span>
            </p>
            <div class="login-error">{{ loginError }}</div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" lg="4" offset-lg="2" md="6" class="keypad-container">
        <b-row>
          <keypad :inline="true"
            @backspace="backspacePressed"
            @ok="okPressed"
            @keyPressed="keyPress"/>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="motd-container d-none d-md-block">
      <p v-html="messagesOfTheDay[motdIndex]"></p>
    </b-row>
    <b-row class="banner-container d-none d-md-block">
      <p>- Sponsored by - </p>
      <img :src="banners[bannerIndex]" />
    </b-row>
  </b-container>
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
    passcodeDots(passcode: number) {
      if (passcode > 0) {
        return '•'.repeat(Math.floor(passcode).toString().length);
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

  backspacePressed() {
    if (this.enteringUserId && this.userId.length > 0) {
      this.userId = this.userId.slice(0, -1);
    } else if (!this.enteringUserId) {
      if (this.passcode.length > 0) {
        this.passcode = this.passcode.slice(0, -1);
      } else {
        this.enteringUserId = false;
      }
    }
  }

  okPressed() {
    if (this.enteringUserId) {
      this.enteringUserId = false;
    } else {
      this.login();
    }
  }

  keyPress(keyValue: string) {
    if (this.enteringUserId) {
      this.userId += keyValue;
    } else {
      this.passcode += keyValue;
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
      this.$router.push('/');
    } else {
      this.keypadValue = 0;
      this.userId = 0;
      this.passcode = 0;
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
.login-container {
  background-color: #DADADA;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .login-header {
    background-color: #D40000;
    height: 10%;

    img {
      margin: 16px;
      height: calc(100% - 32px);
    }

    h1 {
      color: white;
      line-height: 2.5;
    }
  }

  .login-error {
    font-size: 16px;
    color: #D40000;
  }

  .keycodes-container {
    font-size: 4rem;
    .login-row {
      height: 100%;
      p {
        &.active-input {
          background-color: #EAEAEA;
          span {
            color: #525659;
          }
          svg {
            background-color: #DADADA;
            color: #525659;
          }
        }
        background-color: #525659;
        line-height: 1;
        margin-bottom: 3rem;
        span {
          margin-left: 24px;
          color: #EAEAEA;
          letter-spacing: 0.2em;
        }
        svg {
          background-color: #DADADA;
          padding: 5px;
          margin: 2px;
          height: 4rem;
          width: 4rem;
          color: #525659;
        }
      }
    }
  }

  .entry-row {
    background-color: white;
    margin-bottom: 32px;
    padding-top: 32px;
  }

  .motd-container {
    text-align: center;
    margin-top: auto;
    p {
      font-size: 2rem;
      width: 100%;
    }
  }

  .banner-container {
    text-align: center;
    p {
      width: 100%;
      margin-top: auto;
    }
    img {
      height: 10vh;
    }
  }
}
</style>
