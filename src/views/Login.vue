<template>
  <b-container class="login-container" fluid>
    <b-row class="entry-row">
      <b-col cols="12" lg="4" offset-lg="1" md="6" class="keycodes-container">
        <b-row class="login-row">
          <b-col align-self="center">
            <p>
              <font-awesome-icon icon="user" />
              <span v-if="userId != 0">{{ userId }}</span>
            </p>
            <p>
              <font-awesome-icon icon="lock" />
              <span>{{ passcode | passcodeDots }} </span>
            </p>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" lg="4" offset-lg="2" md="6" class="keypad-container">
        <b-row>
          <keypad :inline="true" :value.sync="keypadValue" @close="nextLine"/>
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
  private messagesOfTheDay: string[] = [
    '🦀🦀🦀🦀🦀Het bestuur geeft ons te weinig pizza🦀🦀🦀🦀🦀',
    '👩‍🦼👩‍🦼👩‍🦼Julie de Nooij👩‍🦼👩‍🦼👩‍🦼',
  ];

  private banners: string[] = [
    'https://i.imgur.com/Ku3bLab.png',
    'https://i.imgur.com/S9dsgzl.png',
  ];

  public motdIndex = 0;

  public bannerIndex = 0;

  public userId = 0;

  public passcode = -1;

  private keypadValue = 0;

  private enteringUserId = true;

  @Watch('keypadValue')
  onKeypadChanged(val: number, oldVal: number) {
    if (this.enteringUserId) {
      this.userId = val;
    } else {
      this.passcode = val;
    }
  }

  nextLine() {
    if (this.enteringUserId) {
      this.enteringUserId = false;
      this.keypadValue = 0;
    } else if (this.passcode > 999) {
      this.login();
    }
  }

  login() {
    if (this.userId === 7987 && this.passcode === 1972) {
      // TODO: Add login logic instead of hardcoded values
      this.keypadValue = 0;
      this.userId = 0;
      this.passcode = 0;
      this.$router.push('/');
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

  .keycodes-container {
    font-size: 4rem;
    .login-row {
      height: 100%;
      p {
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
    height: 55%;
    background-color: #DADADA;
    padding-top: 5%;
    margin-bottom: 5%;
  }

  .motd-container {
    min-height: 5%;
    text-align: center;
    p {
      font-size: 2rem;
      width: 100%;
    }
  }

  .banner-container {
    max-height: 30%;
    text-align: center;
    p {
      width: 100%;
      margin-top: auto;
    }
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
