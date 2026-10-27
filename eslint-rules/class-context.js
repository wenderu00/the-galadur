const classFunctions = new Set(["cn", "cva", "clsx", "twMerge"]);

export function isClassContext(node, attributes) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === "JSXAttribute") return attributes.has(current.name.name);
    if (current.type === "CallExpression") {
      const callee = current.callee;
      if (callee.type === "Identifier" && classFunctions.has(callee.name)) return true;
    }
    if (current.type === "VariableDeclarator" && current.id.type === "Identifier" && /class(es|Name)?$/i.test(current.id.name)) {
      return true;
    }
  }
  return false;
}

export function utilityOf(className) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < className.length; i++) {
    if (className[i] === "[") depth++;
    if (className[i] === "]") depth--;
    if (className[i] === ":" && depth === 0) start = i + 1;
  }
  return className.slice(start).replace(/^!|!$/g, "");
}

export function classRule({ description, message, inspect, attributes }) {
  return {
    meta: { type: "problem", docs: { description }, schema: [], messages: { raw: message } },
    create(context) {
      function check(node, text) {
        if (typeof text !== "string" || !isClassContext(node, attributes)) return;
        const value = inspect(text);
        if (value) context.report({ node, messageId: "raw", data: { value } });
      }
      return {
        Literal(node) {
          check(node, node.value);
        },
        TemplateElement(node) {
          check(node, node.value.cooked);
        },
      };
    },
  };
}
