import * as request from 'request';
import { camelCase } from 'lodash';
import { writeFileSync } from 'fs';
const RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(5, 1500); // at most 5 request every 1500 ms
const throttledRequest = function(...requestArgs) {
  limiter.removeTokens(1, function() {
    request.post.apply(this, requestArgs);
  });
};

const WIKI_URL = "https://wiki.guildwars2.com/api.php";

function getMatches(str, regex) {
  const matches = Object.create(null);
  let match;
  while (match = regex.exec(str)) {
    matches[camelCase(match[1])] = match[2];
  }

  return matches;
}

function queryTemplate(itemType, rarity, itemLevel) {
  const queryTemplate = `
    {{item stat lookup|type=${itemType}|rarity=${rarity}|level=${itemLevel}}}
    #var:major attribute={{#var:major attribute|0}}
    #var:minor attribute={{#var:minor attribute|0}}
    #var:major quad attribute={{#var:major quad attribute|0}}
    #var:minor quad attribute={{#var:minor quad attribute|0}}
    #var:celestial nbr={{#var:celestial nbr|0}}
    #var:boon duration={{#var:boon duration|0}}
    #var:condition duration={{#var:condition duration|0}}
    #var:magic find={{#var:magic find|0}}
    #var:type_ori={{#var:type_ori|0}}
    #var:type_std={{#var:type_std|0}}
    #var:rarity_std={{#var:rarity_std|0}}
    #var:attribute_lu={{#var:attribute_lu|0}}
    #var:defense_lu={{#var:defense_lu|0}}
    #var:level_lu={{#var:level_lu|0}}
    #var:strength_lu={{#var:strength_lu|0}}
    #var:supertype={{#var:supertype|0}}
    #var:defense={{#var:defense|0}}
    #var:min strength={{#var:min strength|0}}
    #var:max strength={{#var:max strength|0}}
  `;

  return new Promise<string>((resolve, reject) => {
      throttledRequest(WIKI_URL, {
        form: {
          action: 'expandtemplates',
          format: 'jsonfm',
          text: queryTemplate,
          prop: 'wikitext',
          wrappedhtml: 1,
        }
      }, (err, resp, body) => {
        err && reject(err);
        resolve(body);
    });
  })
  .then((v) => JSON.parse(v))
  .then((v) => v['html'])
  .then((v) => v.match(/(\{(.|\n)+\})/g)[0])
  .then((v) => JSON.parse(v))
  .then((v) => v['expandtemplates'])
  .then((v) => v['wikitext'])
  .then((v) => getMatches(v, /#var:(.+?)=([^\n]+)/g))
}

function promiseForObject<T>(
  object: {[key: string]: Promise<T>}
): Promise<{[key: string]: T}> {
  const keys = Object.keys(object);
  const valuesAndPromises = keys.map(name => object[name]);
  return Promise.all(valuesAndPromises).then(
    values => values.reduce((resolvedObject, value, i) => {
      resolvedObject[keys[i]] = value;
      return resolvedObject;
    }, Object.create(null))
  );
}

function promiseForObjectDeep(object, nest) {
  if ( nest > 0 ) {
    const innerObj = Object.keys(object).reduce((newObj, key: string) => {
      return Object.assign(newObj, {
        [key]: promiseForObjectDeep(object[key], nest - 1),
      });
    }, {});

    return promiseForObject(innerObj);
  }

  return promiseForObject(object);
}

function fetchAll() {
  const types = [
    "helm",
    "shoulders",
    "gloves",
    "coat",
    "leggings",
    "boots",
    "back item",
    "accessory",
    "amulet",
    "ring",
    "axe",
    "dagger",
    "focus",
    "mace",
    "pistol",
    "scepter",
    "shield",
    "sword",
    "torch",
    "warhorn",
    "greatsword",
    "hammer",
    "harpoon gun",
    "longbow",
    "rifle",
    "short bow",
    "spear",
    "staff",
    "trident",
  ];
  const rarities = [
    "basic",
    "fine",
    "masterwork",
    "rare",
    "exotic",
    "ascended",
    "legendary",
  ]
  const itemLevels = Array.from(Array(80).keys());
  const allInfo = types.reduce((obj, weaponType: string) => {
    return Object.assign(obj, {
      [weaponType]: rarities.reduce((itemObj, rarityType: string) => {
        return Object.assign(itemObj, {
          [rarityType]: itemLevels.reduce((rarityObj, itemLevel: number) => {
            return Object.assign(rarityObj, {
              [itemLevel]: queryTemplate(weaponType, rarityType, itemLevel),
            });
          }),
        });
      }, {}),
    });
  }, {});

  return promiseForObjectDeep(allInfo, 2);
}

async function main() {
  const allInfo = await fetchAll();
  console.log(JSON.stringify(allInfo));
  // writeFileSync("./itemstat-db.json", JSON.stringify(allInfo));

  //const variables = await queryTemplate('short bow', 'fine', 80);
  //console.log(variables);
}

main().then(() => console.log('done'), (e) => console.error(e));
