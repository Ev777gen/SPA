<template>
  <div class="form">
    <form @submit.prevent="save">
      <textarea v-model="text" rows="10" class="form__input"></textarea>
      <div class="form__button">
        <button class="btn_blue">Опубликовать</button>
      </div>
    </form>
    <!--<VeeForm @submit="save" :key="formKey">
      <AppFormField as="textarea" name="text" v-model="postCopy.text" rows="10" cols="30" rules="required" />
      <div class="form-actions">
        <button class="btn_blue">{{post.id ? 'Сохранить изменения' : 'Опубликовать'}}</button>
      </div>
    </VeeForm>-->
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => ({ text: null }) }
  },
  data () {
    return {
      text: '',
      //postCopy: { ...this.post },
      //formKey: Math.random()
    }
  },
  methods: {
    save () {
      //const postId = 'a' + Math.random(); // нужна система генерации postId. Пока просто строка + случайное число
      const post = {
        //id: postId, //теперь генерируем id в store
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000), // переводим в секунды
        userId: '1', // т.к. мы еще не создали Authentication, используем id любого пользователя
      };
      //sourceData.posts.push(post); // добавляем пост в массив постов (не в файл). 
      // Но это не реактивная зависимость и если сделать так, то на странице ничего не обновится
      // Поэтому надо обновить реактивную зависимость (свойство posts, которое находится в свойстве data()):
      //this.posts.push(post);
      //this.thread.posts.push(postId); // Еще надо добавить id поста в свойство thread.posts, 
      // т.к. мы использовали это свойство, чтобы найти посты, которые нужно отобразить.
      // Но для нас это уже не актуально, т.к. мы вынесли этот шаблон в отдельный компонент PostList
      // Поэтому в данном случае нам не надо это делать
      this.$emit('save', {post}); // Лучше передавать параметры в виде объекта, т.к. в этом случае сохраняется имя ключа post и можно получить доступ к его содержимому через eventData.post

      this.text = '';
    },
    /*save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
      this.formKey = Math.random()
    }*/
  }
}
</script>

<style lang="scss" scoped>
.form__input {
  width: 100%;
  margin: 20px 0 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #505050;
  background-color: #fdfdfd;
}
.form__button {
  display: flex;
  justify-content: flex-end;
}
</style>