import {createEffect, createStore} from 'effector';
import {
  addPresset,
  deletePresset,
  getUserPressets,
  updatePresset,
} from '../../utils/db/pressets';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPressetsFx = createEffect(async () => {
  const pressets = await getUserPressets();
  return pressets.sort((x, y) => y.created_at - x.created_at);
});

export const addPressetToStoreFx = createEffect(
  async ({presset, updatedArray}) => {
    const newPresset = await addPresset(presset);
    return {presset: newPresset, updatedArray};
  },
);

export const updatePressetFx = createEffect(async presset => {
  const updatedDefaults = JSON.parse(
    await AsyncStorage.getItem('updatedDefaults'),
  );
  const newPresset = await updatePresset(presset, updatedDefaults);
  return newPresset;
});

export const deletePressetFx = createEffect(async ({id, defaultPresets}) => {
  const updatedPresets = JSON.parse(
    await AsyncStorage.getItem('updatedDefaults'),
  );
  if (updatedPresets?.includes(id)) {
    await deletePresset(id);
    await AsyncStorage.setItem(
      'updatedPresets',
      JSON.stringify(updatedPresets.filter(item => item !== id)),
    );
    return id;
  }
  if (defaultPresets.includes(id)) {
    return id;
  }

  await deletePresset(id);
  return id;
});

export const $pressetsStore = createStore([])
  .on(getPressetsFx.doneData, (_, pressets) => pressets)
  .on(addPressetToStoreFx.doneData, (store, {presset, updatedArray}) =>
    [...store, presset]
      .sort((x, y) => y.created_at - x.created_at)
      .filter(pressetDefault => {
        if (updatedArray?.includes(pressetDefault.id)) {
          return false;
        }
        return true;
      }),
  )
  .on(updatePressetFx.doneData, (store, newPresset, updatedDefaults) => {
    return store

      .map(presset => {
        if (presset.id === newPresset.id) {
          return {...presset, ...newPresset};
        }
        return presset;
      })
      .filter(presset => {
        if (updatedDefaults?.includes(presset.id)) {
          return false;
        }
        return true;
      });
  })
  .on(deletePressetFx.doneData, (store, id) =>
    store.filter(presset => presset.id !== id),
  );
