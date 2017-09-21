function drawNestedSetsTree(data, domNode) {

  const reduce = data => {

    const append = (dom, node) => {
      let el = document.createElement('LI');
      el.innerText = node.title;
      dom.appendChild(el);
      return el;
    };

    const domRoot = document.createElement('UL');
    let root = {
      parent: null,
      dom: domRoot,
      left: Number.NEGATIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
      children: []
    };
    let trueroot = root;

    data.sort((a, b) => (a.left - b.left));
    // current dom structure
    let dom = domRoot;

    data.forEach((node) => {
      while (root.right < node.left && root.parent) {
        root = root.parent;
        dom = root.dom;
      }
      if (root.left < node.left && node.right < root.right) {
        node.parent = root;
        root.children.push(node);

        let newDom = append(dom, node);

        if (!node.children) {
          node.children = [];
          var children = document.createElement('UL');
          dom.appendChild(children);
          node.dom = children;
        }

        root = node;
        dom = root.dom;
      }
    });

    domNode.appendChild(domRoot);
    return trueroot;
  };

  var root = reduce(data);

  // just for replacing cyclic values
  // because of it, in resulting structure
  // parents of the nodes is null
  // let seen = [];
  // var replacer = (key, value) => {
  //   if (value != null && typeof value == "object") {
  //     if (seen.indexOf(value) >= 0) {
  //       return null;
  //     }
  //     seen.push(value);
  //   }
  //   return value;
  // };

  // var root = document.createElement('PRE');
  // // root.innerHTML = JSON.stringify(reduce(data), null, 2);
  // root.innerHTML = JSON.stringify(reduce(data), replacer, 2);
  // domNode.appendChild(root);
}
