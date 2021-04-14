import { Identification, Child, SlamElement, TagName } from "./slamInterfaces";
import { isChildless, isPresentAtt } from "./utils";

function buildAttsString<T extends SlamElement<TagName>["atts"]>(atts: T): string {
  let attsText = "";
  Object.keys(atts!).forEach(att => {
    if (isPresentAtt(att.toString())) {
      attsText += " " + att;
    } else if (att !== "js" && att !== "css") {
      attsText += " " + att + '="' + atts![att as keyof T] + '"';
    }
  });
  return attsText;
}

function buildElementAndChildrenStrings(
  tree: SlamElement<TagName> | string,
  components: Identification,
  className?: string
): string {
  if (typeof tree === "string") {
    return tree;
  }
  let build = `<${tree["tag"]}`;
  if (tree["atts"] || className) {
    const atts = tree["atts"] || {};
    const attsClass = atts["class"] || "";
    const fullClass = className ? (attsClass ? `${attsClass} ${className}` : className) : attsClass;
    const classObject = fullClass ? { class: fullClass } : {};
    build += buildAttsString({ ...atts, ...classObject });
  }
  build += isChildless(tree["tag"]) ? "/>" : ">";
  tree["children"] && tree["children"].forEach(child => (build += buildPageHtmlString(child, components)));
  build += !isChildless(tree["tag"]) ? `</${tree["tag"]}>` : "";
  return build;
}

export function buildPageHtmlString(tree: Child, components: Identification): string {
  if (typeof tree === "string") {
    return tree;
  } else {
    let className = "";
    Object.keys(components).forEach(key => {
      components[parseInt(key)].forEach(component => {
        if (component === tree) {
          className = `c${key}`;
        }
      });
    });
    return buildElementAndChildrenStrings(tree, components, className);
  }
}