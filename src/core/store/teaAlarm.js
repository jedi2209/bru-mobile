import {createEffect, createStore} from 'effector';
import {getTeaAlarmById} from '../../utils/db/teaAlarms';

export const getTeaAlarmByIdFx = createEffect(async id => {
  return await getTeaAlarmById(id);
});

export const $teaAlarmStrore = createStore(null).on(
  getTeaAlarmByIdFx.doneData,
  (_, teaAlarm) => teaAlarm,
);
