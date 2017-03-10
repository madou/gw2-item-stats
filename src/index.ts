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

const DB = loadDb();
export function queryItemAttributes(itemType: ItemType, rarity: Rarty, itemLevel: number) {
  return DB.then((db) => {
    if ( ! db[itemType] ) {
      throw new Error(`Invalid Item Type: ${itemType}`);
    }

    if ( ! db[itemType][rarity] ) {
      throw new Error(`Invalid Item Rarity: ${rarity}`);
    }

    const value = db[itemType][rarity][itemLevel.toString()];
    if ( ! value ) {
      throw new Error(`Invalid Item level: ${itemLevel}`);
    }

    return value;
  });
}

export default queryItemAttributes;
