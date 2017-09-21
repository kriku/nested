function drawNestedSetsTree(data, domNode) {

  const reduce = data => {
    let root = {
      parent: null,
      left: Number.NEGATIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
      children: []
    };
    let trueroot = root;
    // const domRoot = document.createElement('UL');

    data.sort((a, b) => (a.left - b.left));

    data.forEach((node) => {
      while (root.right < node.left && root.parent) {
        root = root.parent;
      }
      if (root.left < node.left && node.right < root.right) {
        node.parent = root;
        root.children.push(node);
        if (!node.children) node.children = [];
        root = node;
      }
    });

    return trueroot;
  };

  // just for replacing cyclic values
  // because of it, in resulting structure
  // parents of the nodes is null
  let seen = [];
  var replacer = (key, value) => {
    if (value != null && typeof value == "object") {
      if (seen.indexOf(value) >= 0) {
        return null;
      }
      seen.push(value);
    }
    return value;
  };

  var root = document.createElement('PRE');
  // root.innerHTML = JSON.stringify(reduce(data), null, 2);
  root.innerHTML = JSON.stringify(reduce(data), replacer, 2);
  domNode.appendChild(root);
}
