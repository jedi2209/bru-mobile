import {createEffect, createStore} from 'effector';
import {
  addPresset,
  deletePresset,
  getUserPressets,
  updatePresset,
} from '../../utils/db/pressets';

export const getPressetsFx = createEffect(async () => {
  const pressets = await getUserPressets();
  return pressets.sort((a, b) => a.tea_type.localeCompare(b.tea_type));
});

export const addPressetToStoreFx = createEffect(async presset => {
  const newPresset = await addPresset(presset);
  return newPresset;
});

export const updatePressetFx = createEffect(async presset => {
  const newPresset = await updatePresset(presset);
  return newPresset;
});

export const deletePressetFx = createEffect(async id => {
  await deletePresset(id);
  return id;
});

export const $pressetsStore = createStore([])
  .on(getPressetsFx.doneData, (_, pressets) => pressets)
  .on(addPressetToStoreFx.doneData, (store, presset) => [...store, presset])
  .on(updatePressetFx.doneData, (store, newPresset) =>
    store.map(presset => {
      if (presset.id === newPresset.id) {
        return {...presset, ...newPresset};
      }
      return presset;
    }),
  )
  .on(deletePressetFx.doneData, (store, id) =>
    store.filter(presset => presset.id !== id),
  );
