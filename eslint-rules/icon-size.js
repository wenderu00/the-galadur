import { utilityOf } from "./class-context.js";

const scale = new Set(["size-4", "size-5", "size-6"]);
const sizing = /^(size|w|h)-/;
const sizeProps = new Set(["size", "width", "height"]);

function isIconValue(node, icons) {
  if (!node) return false;
  if (node.type === "Identifier") return icons.has(node.name);
  if (node.type === "ConditionalExpression") return isIconValue(node.consequent, icons) && isIconValue(node.alternate, icons);
  return false;
}

function iconAttributeOf(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === "JSXAttribute") return current;
    if (current.type === "JSXElement") return null;
  }
  return null;
}

const iconSize = {
  meta: {
    type: "problem",
    docs: { description: "Exige que ícones do lucide-react e das origens configuradas usem a escala size-4, size-5 ou size-6" },
    schema: [
      {
        type: "object",
        properties: {
          allow: { type: "array", items: { type: "string" } },
          sources: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      scale: "Ícone fora da escala ({{ value }}). Use size-4 (16px), size-5 (20px) ou size-6 (24px).",
      prop: "Tamanho de ícone pela prop {{ value }}. Use a classe size-4, size-5 ou size-6.",
    },
  },
  create(context) {
    const allowed = new Set([...scale, ...(context.options[0]?.allow ?? [])]);
    // Uma origem terminada em / vale para todo módulo dentro dela, como @/components/icons/.
    const sources = context.options[0]?.sources ?? ["lucide-react"];
    const isIconSource = (source) => sources.some((entry) => (entry.endsWith("/") ? source.startsWith(entry) : source === entry));
    const icons = new Set();
    const namespaces = new Set();

    function isIcon(name) {
      if (name.type === "JSXIdentifier") return icons.has(name.name);
      return name.type === "JSXMemberExpression" && name.object.type === "JSXIdentifier" && namespaces.has(name.object.name);
    }

    function check(node, text) {
      if (typeof text !== "string") return;
      const attribute = iconAttributeOf(node);
      if (!attribute || attribute.name.name !== "className" || !isIcon(attribute.parent.name)) return;
      for (const className of text.split(/\s+/)) {
        const utility = utilityOf(className);
        if (sizing.test(utility) && !allowed.has(utility)) {
          context.report({ node, messageId: "scale", data: { value: className } });
          return;
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (!isIconSource(node.source.value)) return;
        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportNamespaceSpecifier") namespaces.add(specifier.local.name);
          else icons.add(specifier.local.name);
        }
      },
      VariableDeclarator(node) {
        if (node.id.type === "Identifier" && isIconValue(node.init, icons)) icons.add(node.id.name);
      },
      JSXAttribute(node) {
        if (node.name.type === "JSXIdentifier" && sizeProps.has(node.name.name) && isIcon(node.parent.name)) {
          context.report({ node, messageId: "prop", data: { value: node.name.name } });
        }
      },
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked);
      },
    };
  },
};

export default iconSize;
