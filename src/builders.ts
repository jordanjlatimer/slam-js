import { cssReset } from "./cssReset";
import { buildCssFromObject } from "./generateCss";
import { BuildObject, Identification, Child, SlamElement, Page } from "./slamInterfaces";
import { parseAtts, noChildren, equalObjects } from "./utils";
import * as fs from "fs";
import * as path from "path";

const findElementsWithCSS = (tree: Child): SlamElement[] => {
  let finalArray: SlamElement[] = [];
  if (typeof tree === "object") {
    tree.atts?.css && finalArray.push(tree);
    tree["children"]?.forEach(child => finalArray.push(...findElementsWithCSS(child)));
  }
  return finalArray;
};

const findUniqueCss = (array: SlamElement[]) => {
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
              if (equalObjects(element.atts?.css || {}, item.atts?.css || {})) {
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
};

const constructElement = (
  tree: SlamElement | string,
  build: BuildObject,
  components: Identification,
  className?: string
) => {
  if (typeof tree === "string") {
    build.html += tree;
    return;
  }
  build.html += `<${tree["tag"]}`;
  if (tree["atts"] || className) {
    const atts = tree["atts"] || {};
    const attsClass = atts["class"] || "";
    const fullClass = className ? (attsClass ? `${attsClass} ${className}` : className) : attsClass;
    const classObject = fullClass ? { class: fullClass } : {};
    build.html += parseAtts({ ...atts, ...classObject });
  }
  build.html += noChildren(tree["tag"]) ? "/>" : ">";
  tree["children"] && tree["children"].forEach(child => routeChild(child, build, components));
  build.html += tree["tag"] && !noChildren(tree["tag"]) ? `</${tree["tag"]}>` : "";
};

const routeChild = (tree: Child, build: BuildObject, components: Identification) => {
  if (typeof tree === "string") {
    build.html += tree;
    return;
  } else {
    let className = "";
    Object.keys(components).forEach(key => {
      components[parseInt(key)].forEach(component => {
        if (component === tree) {
          className = `c${key}`;
        }
      });
    });
    constructElement(tree, build, components, className);
  }
};

const buildHtmlFromObject = (tree: Child, build: BuildObject, components: Identification) => {
  return routeChild(tree, build, components);
};

const buildCss = (finalObject: BuildObject, components: Identification, reset?: boolean) => {
  finalObject.css += reset ? cssReset : "";
  Object.keys(components).forEach(key => {
    let css = components[parseInt(key)][0].atts?.css;
    finalObject.css += css ? buildCssFromObject(`.c${key}`, css) : "";
  });
};

const buildJs = (finalObject: BuildObject, components: Identification) => {
  Object.keys(components).forEach(key => {
    let js = components[parseInt(key)][0].atts.js;
    finalObject.js += js ? `(${js})()` : "";
  });
};

export const buildPage = (page: Page, content: any) => {
  let build = typeof page.html === "function" ? page.html(content) : page.html;
  let components = findUniqueCss(findElementsWithCSS(build));
  let finalObject = {
    html: "",
    css: "",
    js: "",
  };
  buildCss(finalObject, components, page.cssReset);
  buildJs(finalObject, components);
  buildHtmlFromObject(build, finalObject, components);
  finalObject.html = finalObject.html.replace("</head>", `<link rel=stylesheet href="./${page.name}.css"/></head>\n`);
  finalObject.html = finalObject.html.replace("</body>", `<script src="./${page.name}.js"></script></body>\n`);
  return finalObject;
};

export async function BuildFiles(indexFile: string, outDir: string) {
  const pages: Page[] = require(indexFile)["default"];
  let builds = await Promise.all(
    pages.map(async page => {
      let content = page.content ? await page.content() : undefined;
      return {
        name: page.name,
        ...buildPage(page, content),
      };
    })
  );
  builds.forEach(build => {
    fs.writeFileSync(path.resolve(outDir, `${build.name}.html`), build.html);
    fs.writeFileSync(path.resolve(outDir, `${build.name}.css`), build.css);
    fs.writeFileSync(path.resolve(outDir, `${build.name}.js`), build.js);
  });
}
