import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencil, faAngleDown, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// Adding Font Awesome icons to the library
library.add(faPencil, faAngleDown, faRightFromBracket, faRightToBracket);

export default (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon);
}