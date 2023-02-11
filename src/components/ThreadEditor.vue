<template>
  <form @submit.prevent="save" class="form">
    <div class="form__imput-group">
      <label for="thread_title" class="form__label">Заголовок</label>
      <input v-model="form.title" type="text" id="thread_title" class="form__input" name="title">
    </div>
    <div class="form__input-group">
      <label for="thread_content" class="form__label">Сообщение</label>
      <textarea v-model="form.text" type="text" id="thread_content" class="form__input" name="content" rows="8" cols="140"></textarea>
    </div>
    <div class="form__btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn_ghost">Отмена</button>
      <button class="btn btn_blue" type="submit" name="Publish">{{ existing ? 'Обновить' : 'Опубликовать' }}</button>
    </div>
  </form>
  <!--<VeeForm @submit="save">
    <AppFormField label="Заголовок" name="title" v-model="form.title" rules="required" />
    <AppFormField as="textarea" label="Сообщение" name="text" v-model="form.text" rules="required" rows="8" cols="140" />

    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn_ghost">Отмена</button>
      <button class="btn_blue" type="submit" name="Publish">
        {{existing ? 'Обновить' : 'Опубликовать'}}
      </button>
    </div>
  </VeeForm>-->
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    existing () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$emit('clean')
      this.$emit('save', { ...this.form })
    }
  },
  watch: {
    form: {
      handler () {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty')
        } else {
          this.$emit('clean')
        }
      },
      deep: true
    }
  }
}
</script>
