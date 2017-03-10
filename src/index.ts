import { loadDb } from './loadDb';
export { TYPES, RARITIES } from './types';

export type ItemType =
  "helm" | "shoulders" | "gloves" | "coat" | "leggings" |
  "boots" | "back item" | "accessory" | "amulet" | "ring" |
  "axe" | "dagger" | "focus" | "mace" | "pistol" |
  "scepter" | "shield" | "sword" | "torch" | "warhorn" |
  "greatsword" | "hammer" | "harpoon gun" | "longbow" | "rifle" |
  "short bow" | "spear" | "staff" | "trident";

export type Rarty =
  "basic" | "fine" | "masterwork" |
  "rare" | "exotic" | "ascended" | "legendary";

let DB;
export function queryItemAttributes(itemType: ItemType, rarity: Rarty, itemLevel: number) {
  if ( !DB ) {
    DB = loadDb();
  }

  if ( ! DB[itemType] ) {
    throw new Error(`Invalid Item Type: ${itemType}`);
  }

  if ( ! DB[itemType][rarity] ) {
    throw new Error(`Invalid Item Rarity: ${rarity}`);
  }

  const value = DB[itemType][rarity][itemLevel.toString()];
  if ( ! value ) {
    throw new Error(`Invalid Item level: ${itemLevel}`);
  }

  return value;
}

export default queryItemAttributes;
