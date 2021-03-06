import { Child, SlamElement, Identification, TagName, ChildlessElements, CSSObject } from "./slamInterfaces";

export function toKebabCase(value: string): string {
  return value.split("").reduce((a, b) => a + (/[A-Z]/.test(b) ? "-" + b.toLowerCase() : b), "");
}

export function isPresentAtt(attName: string): boolean {
  return [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "novalidate",
    "open",
    "readonly",
    "required",
    "reversed",
    "selected",
    "typemustmatch",
  ].includes(attName);
}

export function isChildless(tag: TagName): tag is ChildlessElements {
  return [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "circle",
    "ellipse",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "use",
  ].includes(tag);
}

interface GenericObject {
  [key: string]: any;
}

export function areEqualObjects(object1: GenericObject, object2: GenericObject): boolean {
  if (object1 === object2) {
    return true;
  }
  let object1Keys = Object.keys(object1);
  let object2Keys = Object.keys(object2);
  if (object1Keys.length !== object2Keys.length) {
    return false;
  }
  for (let key of object1Keys) {
    if (typeof object1[key] === "object") {
      if (typeof object2[key] === "object") {
        if (!areEqualObjects(object1[key], object2[key])) {
          return false;
        }
      } else {
        return false;
      }
    } else if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}

export function collectElementsWithCss(tree: Child): SlamElement<TagName>[] {
  let finalArray: SlamElement<TagName>[] = [];
  if (typeof tree === "object") {
    tree.atts?.css && finalArray.push(tree);
    tree["children"]?.forEach(child => finalArray.push(...collectElementsWithCss(child)));
  }
  return finalArray;
}

export function determineSimilarElementsByCss(array: SlamElement<TagName>[]): Identification {
  let identities: Identification = {};
  let identitiesIndex = 0;
  array.forEach(element => {
    if (identitiesIndex === 0) {
      identities[identitiesIndex] = [element];
      identitiesIndex++;
    } else {
      let matchFound = false;
      Object.keys(identities).forEach(key => {
        if (!matchFound) {
          identities[parseInt(key)].forEach(item => {
            if (!matchFound) {
              if (areEqualObjects(element.atts?.css || {}, item.atts?.css || {})) {
                identities[parseInt(key)].push(element);
                matchFound = true;
              }
            }
          });
        }
      });
      if (!matchFound) {
        identities[identitiesIndex] = [element];
        identitiesIndex++;
      }
    }
  });
  return identities;
}

export function clearCache(module: NodeModule): void {
  module.children.forEach(child => {
    if (/node_modules/.test(child.id) || /dist/.test(child.id)) {
      return;
    } else {
      clearCache(child);
    }
  });
  delete require.cache[require.resolve(module.id)];
}

export function deepStyleMerge<T extends keyof CSSObject>(...objs: (CSSObject | CSSObject[] | undefined)[]): CSSObject {
  const mergedObj: CSSObject = {};
  objs.forEach((obj, i) => (Array.isArray(obj) ? (objs[i] = deepStyleMerge(...obj)) : (objs[i] = obj))); //Flatten arrays of styles
  if (objs[objs.length - 1]) {
    let deepMergeKeys: Set<T> = new Set();
    objs.forEach(obj => {
      if (obj) {
        (Object.keys(obj) as T[]).forEach(key => {
          if (obj[key] || obj[key] === 0) {
            if (typeof obj[key] === "object") {
              deepMergeKeys.add(key);
            } else {
              mergedObj[key] = obj[key];
            }
          }
        });
      }
    });
    deepMergeKeys.forEach(key => {
      let objectsToMerge: CSSObject[] = [];
      objs.forEach(obj => (obj ? (obj[key] ? objectsToMerge.push(obj[key]) : undefined) : undefined));
      //@ts-ignore
      mergedObj[key] = deepStyleMerge(...objectsToMerge);
    });
  }
  return mergedObj;
}
