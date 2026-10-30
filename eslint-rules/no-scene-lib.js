const sceneLib = /^(gsap|@gsap\/[^/]+|pixi\.js)(\/|$)/;

// ADR 0026: pixi.js e gsap só entram pelo SceneCanvas e pelo CharacterStage, sob demanda.
// Import de tipo não vai para o bundle e continua liberado.
const noSceneLib = {
  meta: {
    type: "problem",
    docs: { description: "Proíbe importar pixi.js e gsap em runtime fora do SceneCanvas e do CharacterStage" },
    schema: [],
    messages: {
      runtime:
        "{{ name }} carregado fora do palco. Cenas recebem PIXI do SceneCanvas e personagens recebem gsap do CharacterStage; aqui, use só import type.",
    },
  },
  create(context) {
    const check = (node, source) => {
      if (typeof source === "string" && sceneLib.test(source)) context.report({ node, messageId: "runtime", data: { name: source } });
    };
    return {
      ImportDeclaration(node) {
        const typeOnly = node.importKind === "type" || (node.specifiers.length > 0 && node.specifiers.every((specifier) => specifier.importKind === "type"));
        if (!typeOnly) check(node, node.source.value);
      },
      ImportExpression(node) {
        if (node.source.type === "Literal") check(node, node.source.value);
      },
      ExportNamedDeclaration(node) {
        if (node.source && node.exportKind !== "type") check(node, node.source.value);
      },
      ExportAllDeclaration(node) {
        if (node.exportKind !== "type") check(node, node.source.value);
      },
    };
  },
};

export default noSceneLib;
