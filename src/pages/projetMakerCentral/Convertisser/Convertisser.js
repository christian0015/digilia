import fs from "fs";
import acorn from "acorn-jsx";
import postcss from "postcss";
import cssToReact from "css-to-react";

const parseReactToJSON = (jsxCode) => {
  // Utiliser Acorn pour parser le JSX
  const ast = acorn.parse(jsxCode, { plugins: { jsx: true } });

  const extractNode = (node) => {
    if (node.type === "Literal") {
      return {
        id: `text-${nanoid()}`,
        type: "text",
        props: { text: node.value, style: {} },
        children: [],
      };
    }

    if (node.type === "JSXElement") {
      const type = node.openingElement.name.name;
      const props = node.openingElement.attributes.reduce((acc, attr) => {
        acc[attr.name.name] = attr.value?.value || true;
        return acc;
      }, {});

      return {
        id: `${type}-${nanoid()}`,
        type,
        props: {
          ...props,
          style: props.style ? cssToReact(props.style) : {},
        },
        children: node.children.map(extractNode),
      };
    }

    return null;
  };

  return extractNode(ast.body[0]);
};

const parseCSS = (cssCode) => {
  const parsedCSS = postcss.parse(cssCode);
  const styles = {};

  parsedCSS.walkRules((rule) => {
    if (rule.selector.startsWith(".")) {
      const className = rule.selector.substring(1);
      styles[className] = rule.nodes.reduce((acc, decl) => {
        acc[decl.prop] = decl.value;
        return acc;
      }, {});
    }

    if (rule.type === "atrule" && rule.name === "media") {
      styles[rule.params] = styles[rule.params] || {};
      rule.walkRules((innerRule) => {
        if (innerRule.selector.startsWith(".")) {
          const className = innerRule.selector.substring(1);
          styles[rule.params][className] = innerRule.nodes.reduce((acc, decl) => {
            acc[decl.prop] = decl.value;
            return acc;
          }, {});
        }
      });
    }
  });

  return styles;
};

const generateResponsiveJSON = (jsonTree, styles) => {
  const addStyles = (node) => {
    if (node.props.className) {
      node.props.style = {
        ...node.props.style,
        ...styles[node.props.className],
      };
    }

    if (node.children) {
      node.children = node.children.map(addStyles);
    }

    return node;
  };

  return addStyles(jsonTree);
};

const processFiles = (reactFilePath, cssFilePath) => {
  const jsxCode = fs.readFileSync(reactFilePath, "utf-8");
  const cssCode = fs.readFileSync(cssFilePath, "utf-8");

  const jsonTree = parseReactToJSON(jsxCode);
  const styles = parseCSS(cssCode);

  const finalJSON = generateResponsiveJSON(jsonTree, styles);
  fs.writeFileSync("output.json", JSON.stringify(finalJSON, null, 2));
  fs.writeFileSync("styles.json", JSON.stringify(styles, null, 2));

  console.log("JSON et styles générés avec succès !");
};

processFiles("example.jsx", "styles.css");
