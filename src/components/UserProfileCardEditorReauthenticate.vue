<template>
  <VueFinalModal v-model="showModal" classes="modal-container" content-class="modal">
    <div class="modal__content">
      <h4>Войдите заново, чтобы сменить логин/пароль</h4>
      <VeeForm @submit="reauthenticate">
        <AppFormField name="reauth-email" label="e-mail" v-model="email" rules="email" />
        <AppFormField name="reauth-password" label="Пароль" v-model="password" type="password" />
        <button class="btn btn_blue btn_small">Войти</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
//import { VueFinalModal } from 'vue-final-modal';
export default {
  //components: { VueFinalModal },
  props: {
    modelValue: { type: Boolean, default: false }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modelValue;
      },
      set (value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    async reauthenticate () {
      try {
        await this.$store.dispatch('reauthenticate', { email: this.email, password: this.password });
        this.$emit('success');
      } catch (error) {
        this.$emit('fail', error);
      }
    }
  }
}
</script>
