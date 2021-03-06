import { boot } from 'quasar/wrappers';
import { setCssVar } from 'quasar';
import { get } from 'lodash';

import color from '../constants/Color';

export default boot(() => {
  //#region Color Brand
  Object.keys(color).map(key => setCssVar(key, get(color, key)));
  //#endregion
});
