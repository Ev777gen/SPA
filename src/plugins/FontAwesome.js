import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

// Adding Font Awesome icons to the library
library.add(faPencil);

export default (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}