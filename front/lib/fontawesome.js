// front/lib/fontawesome.js
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Todos los iconos sólidos
import { fab } from '@fortawesome/free-brands-svg-icons'; // Opcional
import { far } from '@fortawesome/free-regular-svg-icons'; // Opcional

// Evita que FontAwesome inyecte el CSS automáticamente
config.autoAddCss = false;
library.add(fas, fab, far);
