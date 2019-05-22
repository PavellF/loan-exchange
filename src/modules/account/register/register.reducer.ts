import axios from 'axios';

import {FAILURE, REQUEST, SUCCESS} from 'app/shared/reducers/action-type.util';
import {IUser} from 'app/shared/model/user.model';
import {translate} from 'app/shared/language';

export const ACTION_TYPES = {
  CREATE_ACCOUNT: 'register/CREATE_ACCOUNT',
  RESET: 'register/RESET'
};

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null
};

export type RegisterState = Readonly<typeof initialState>;

// Reducer
export default (state: RegisterState = initialState, action): RegisterState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...initialState,
        registrationFailure: true,
        errorMessage: action.payload.response.data.errorKey
      };
    case SUCCESS(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...initialState,
        registrationSuccess: true
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// Actions
export const handleRegister = (user: IUser, ref = '') => {
  if (!user.langKey) {
    user.langKey = 'en';
  }

  return {
    type: ACTION_TYPES.CREATE_ACCOUNT,
    payload: axios.post(`api/register?ref=${ref}`, user),
    meta: {
      successMessage: translate('register.messages.success')
    }
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});