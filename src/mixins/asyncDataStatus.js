export default {
  data () {
    return {
      asyncDataStatus_isReady: false
    }
  },
  methods: {
    asyncDataStatus_loaded () {
      // Когда асинхронные данные загружены - выставляем флаг
      this.asyncDataStatus_isReady = true;
      // Сообщаем корневому компоненту о готовности данных
      this.$emit('ready');
    }
  }
}
