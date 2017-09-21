function drawNestedSetsTree(data, domNode) {

  const reduce = data => {
    let root = {
      parent: null,
      left: Number.NEGATIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
      children: []
    };
    let trueroot = root;
    const domRoot = document.createElement('UL');

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

  seen = [];

  var replacer = function(key, value) {
    if (value != null && typeof value == "object") {
      if (seen.indexOf(value) >= 0) {
        return null;
      }
      seen.push(value);
    }
    return value;
  };

  var root = document.createElement('PRE');
  // root.innerHTML = JSON.stringify(data, null, 2);
  root.innerHTML = JSON.stringify(reduce(data), replacer, 2);
  domNode.appendChild(root);
}



// let put = (root, data) => {
//   if (!root.children) root.children = [];
//   data.forEach(node => {
//     if (root.left < node.left && node.right < root.right) {
//       node.parent = root;
//       root.children.push(node);
//       put(node, data);
//     }
//   });
// };
// let clean = (root) => {
//   root.children.forEach(node => {
//     clean(node);
//   });
//   console.log(root);
//   if (root.parent) {
//     console.log(root.parent);
//     if (root.parent.parent) {
//       console.log(root.parent.parent);
//       let compare = (child) => {
//         return (child.title == root.title && child.left == root.left && child.right == root.right);
//       };
//       if (root.parent.parent.children.filter(compare).length > 0) {
//         root.parent.parent.children.splice(root.parent.parent.children.indexOf(root));
//       }
//     }
//   }

// put(root, data);
// clean(root);
