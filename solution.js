function drawNestedSetsTree(data, domNode) {

  const domRoot = document.createElement('UL');
  const reduce = data => {

    const append = (dom, node) => {
      let el = document.createElement('LI');
      node.dom = el;
      el.innerText = node.title;
      dom.appendChild(el);
      return el;
    };

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

        if (!root.children) {
          root.children = [];
          var children = document.createElement('UL');
          root.dom.appendChild(children);
          dom = children;
          root.dom = dom;
        }

        root.children.push(node);
        let newDom = append(dom, node);
        root = node;
        dom = newDom;
      }
    });

    domNode.appendChild(domRoot);
    return trueroot;
  };

  var root = reduce(data);
  return {
    save: () => {
      console.log(domRoot);
    }
  };
}
